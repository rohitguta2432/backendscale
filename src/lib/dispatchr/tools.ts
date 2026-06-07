// Tools the Dispatchr agent can call. Each is a plain function over the seed
// data plus an in-memory calendar. A fresh Tools instance owns its own mutable
// state, so every conversation (and every replay) gets an isolated world.

import {
    PRICE_BOOK,
    TECHNICIANS,
    JOB_TYPES,
    type JobType,
    type Technician,
} from "./data";

// Working windows, 24h start hours -> [start, end].
const WINDOWS: [number, number][] = [
    [9, 11],
    [11, 13],
    [14, 16],
    [16, 18],
];

function fmtHour(h: number): string {
    const suffix = h < 12 ? "AM" : "PM";
    const h12 = h % 12 || 12;
    return `${h12}:00 ${suffix}`;
}

function dayLabel(day: Date, now: Date): string {
    const d0 = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const n0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const delta = Math.round((d0.getTime() - n0.getTime()) / 86_400_000);
    if (delta === 0) return "Today";
    if (delta === 1) return "Tomorrow";
    return day.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
}

interface Slot {
    slot_id: string;
    technician_id: string;
    technician_name: string;
    skills: JobType[];
    start: Date;
    end: Date;
    label: string;
}

export interface OfferedSlot {
    slot_id: string;
    technician_name: string;
    label: string;
}

export class Tools {
    readonly now: Date;
    private booked = new Set<string>();
    private bookings: Record<string, Record<string, unknown>> = {};
    private slots: Record<string, Slot>;

    constructor(now?: Date) {
        this.now = now ?? new Date();
        this.slots = this.buildSlots();
    }

    private buildSlots(): Record<string, Slot> {
        const slots: Record<string, Slot> = {};
        const base = new Date(this.now);
        base.setMinutes(0, 0, 0);
        for (const dayOff of [0, 1]) {
            for (let wIdx = 0; wIdx < WINDOWS.length; wIdx++) {
                const [sh, eh] = WINDOWS[wIdx];
                const start = new Date(base);
                start.setDate(start.getDate() + dayOff);
                start.setHours(sh, 0, 0, 0);
                if (start <= this.now) continue; // window already started/passed
                const end = new Date(start);
                end.setHours(eh, 0, 0, 0);
                for (const tech of TECHNICIANS) {
                    const sid = `${tech.id}-${dayOff}-${wIdx}`;
                    slots[sid] = {
                        slot_id: sid,
                        technician_id: tech.id,
                        technician_name: tech.name,
                        skills: tech.skills,
                        start,
                        end,
                        label: `${dayLabel(start, this.now)} ${fmtHour(sh)}–${fmtHour(eh)}`,
                    };
                }
            }
        }
        return slots;
    }

    getPriceEstimate(jobType: string): Record<string, unknown> {
        const entry = PRICE_BOOK[jobType as JobType];
        if (!entry) return { error: `unknown job_type '${jobType}'`, known_job_types: JOB_TYPES };
        return { job_type: jobType, ...entry };
    }

    findAvailableSlots(jobType: string, limit = 3): Record<string, unknown> {
        if (!(jobType in PRICE_BOOK)) {
            return { error: `unknown job_type '${jobType}'`, known_job_types: JOB_TYPES };
        }
        const matches: OfferedSlot[] = [];
        const seenWindows = new Set<number>();
        const ordered = Object.values(this.slots).sort((a, b) => a.start.getTime() - b.start.getTime());
        for (const s of ordered) {
            if (!s.skills.includes(jobType as JobType) || this.booked.has(s.slot_id)) continue;
            const key = s.start.getTime();
            if (seenWindows.has(key)) continue; // one technician per time window
            seenWindows.add(key);
            matches.push({ slot_id: s.slot_id, technician_name: s.technician_name, label: s.label });
            if (matches.length >= limit) break;
        }
        return { job_type: jobType, slots: matches };
    }

    bookJob(slotId: string, customerName: string, address: string, problem: string): Record<string, unknown> {
        const slot = this.slots[slotId];
        if (!slot) return { error: `unknown slot_id '${slotId}'` };
        if (this.booked.has(slotId)) return { error: `slot '${slotId}' is already booked` };
        this.booked.add(slotId);
        const bookingId = `BK-${1000 + Object.keys(this.bookings).length}`;
        const booking = {
            booking_id: bookingId,
            technician_name: slot.technician_name,
            window: slot.label,
            customer_name: customerName,
            address,
            problem,
        };
        this.bookings[bookingId] = booking;
        return { status: "booked", ...booking };
    }

    escalateToHuman(reason: string, summary = ""): Record<string, unknown> {
        return {
            status: "escalated",
            reason,
            message: "Flagged for a human dispatcher to take over immediately.",
            summary,
        };
    }

    call(name: string, args: Record<string, unknown>): Record<string, unknown> {
        switch (name) {
            case "get_price_estimate":
                return this.getPriceEstimate(String(args.job_type));
            case "find_available_slots":
                return this.findAvailableSlots(String(args.job_type), args.limit ? Number(args.limit) : 3);
            case "book_job":
                return this.bookJob(
                    String(args.slot_id),
                    String(args.customer_name),
                    String(args.address),
                    String(args.problem),
                );
            case "escalate_to_human":
                return this.escalateToHuman(String(args.reason), args.summary ? String(args.summary) : "");
            default:
                return { error: `unknown tool '${name}'` };
        }
    }
}

export type { Technician };
