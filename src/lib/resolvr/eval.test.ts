import { runEval } from "./eval";

describe("Resolvr decision gate", () => {
    const report = runEval();

    it("never resolves a must-escalate ticket (security/legal/abuse)", () => {
        expect(report.mustEscalateRecall).toBe(1);
    });

    it("classifies categories with at least 0.83 accuracy", () => {
        expect(report.categoryAccuracy).toBeGreaterThanOrEqual(0.83);
    });

    it("takes the correct resolve/escalate action on at least 0.9 of cases", () => {
        expect(report.actionAccuracy).toBeGreaterThanOrEqual(0.9);
    });

    it("does not over-escalate clean self-serve tickets", () => {
        expect(report.overEscalationRate).toBeLessThanOrEqual(0.2);
    });
});
