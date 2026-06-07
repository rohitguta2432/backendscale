// Seed data for the Dispatchr agent — a faithful TypeScript port of the
// original Python project (github.com/rohitguta2432/dispatchr). The agent is a
// home-services dispatcher (HVAC / plumbing / electrical) that takes a customer
// from "I have a problem" to a booked appointment on its own.

export type JobType =
    | "ac_repair"
    | "heating_repair"
    | "plumbing"
    | "electrical"
    | "installation";

export interface PriceEntry {
    label: string;
    diagnostic_fee: number;
    repair_low: number;
    repair_high: number;
    currency: string;
}

export const PRICE_BOOK: Record<JobType, PriceEntry> = {
    ac_repair: { label: "AC repair", diagnostic_fee: 800, repair_low: 2000, repair_high: 4000, currency: "INR" },
    heating_repair: { label: "Heating repair", diagnostic_fee: 800, repair_low: 1800, repair_high: 3500, currency: "INR" },
    plumbing: { label: "Plumbing", diagnostic_fee: 500, repair_low: 1200, repair_high: 3000, currency: "INR" },
    electrical: { label: "Electrical", diagnostic_fee: 600, repair_low: 1500, repair_high: 3500, currency: "INR" },
    installation: { label: "Installation", diagnostic_fee: 0, repair_low: 3500, repair_high: 9000, currency: "INR" },
};

export interface Technician {
    id: string;
    name: string;
    skills: JobType[];
    zone: string;
}

export const TECHNICIANS: Technician[] = [
    { id: "t1", name: "Rahul", skills: ["ac_repair", "installation"], zone: "north" },
    { id: "t2", name: "Priya", skills: ["plumbing"], zone: "south" },
    { id: "t3", name: "Arjun", skills: ["electrical"], zone: "east" },
    { id: "t4", name: "Sana", skills: ["heating_repair", "ac_repair"], zone: "central" },
];

export const JOB_TYPES = Object.keys(PRICE_BOOK) as JobType[];

// ---------------------------------------------------------------- shared types

export type Role = "system" | "user" | "assistant" | "tool";

export interface Message {
    role: Role;
    content?: string | null;
    name?: string;
    tool_call_id?: string;
    tool_calls?: {
        id: string;
        type: "function";
        function: { name: string; arguments: string };
    }[];
}

export interface ToolCall {
    id: string;
    name: string;
    arguments: Record<string, unknown>;
}

export interface AssistantTurn {
    content?: string | null;
    tool_calls: ToolCall[];
}

export interface StepRecord {
    name: string;
    arguments: Record<string, unknown>;
    result: Record<string, unknown>;
}

export interface AgentResult {
    reply: string;
    tool_calls: StepRecord[];
    escalated: boolean;
}
