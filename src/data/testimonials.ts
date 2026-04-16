import type { Testimonial } from '@/types/testimonial';

// TODO: Replace with real client testimonials — these are placeholder examples
// WARNING: Do not display fabricated testimonials on a live site. Keep this array
// empty until real quotes are collected from actual clients.
export const testimonials: Testimonial[] = [
    {
        name: "Arjun Kapoor",
        role: "Founder, NovaByte Labs",
        text: "Rohit delivered our MVP in 5 weeks — on budget and ahead of schedule. His architecture decisions saved us from rewriting everything when we scaled.",
        project: "MVP Development",
    },
    {
        name: "Priya Mehta",
        role: "CTO, MediConnect Health",
        text: "We needed a WhatsApp bot for our clinic chain. Rohit understood the problem immediately and shipped a working solution that our staff could use without training.",
        project: "WhatsApp Bot",
    },
    {
        name: "Vikram Desai",
        role: "Product Manager, FinLeap Technologies",
        text: "What impressed me most was the transparency. GitHub access from day one, weekly demos, no surprises. The React Native app he built is still running with zero issues.",
        project: "Mobile App",
    },
];
