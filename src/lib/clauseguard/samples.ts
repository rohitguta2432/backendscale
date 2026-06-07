// Sample contracts used to seed the on-site demo. Same fixtures the eval suite
// scores against.
export interface ContractSample {
    id: string;
    label: string;
    text: string;
}

export const SAMPLES: ContractSample[] = [
    {
        id: "msa",
        label: "Freelance MSA (risky)",
        text: `MASTER SERVICES AGREEMENT

This Master Services Agreement is entered into between the Client and the Contractor.

1. Services. Contractor shall perform the services described in each Statement of Work.

2. Intellectual Property. Contractor hereby assigns all rights, title and interest in and to all work product, including any pre-existing materials and tools, to the Client.

3. Payment. All undisputed invoices shall be payable net 90 days from receipt.

4. Termination. The Client may terminate this Agreement at any time without cause on three (3) days written notice. Contractor may terminate only upon the Client's uncured material breach.

5. Indemnification. Contractor shall indemnify and hold harmless the Client against any and all third-party claims arising out of the services.

6. Liability. Contractor shall have unlimited liability for all losses arising under this Agreement.

7. Restrictive Covenant. For two (2) years following termination, Contractor shall not compete with the Client in any market in which the Client operates.

8. Entire Agreement. This Agreement constitutes the entire understanding of the parties.`,
    },
    {
        id: "saas",
        label: "SaaS Terms of Service",
        text: `SOFTWARE-AS-A-SERVICE TERMS OF SERVICE

1. Changes to Terms. We may modify these terms at any time in our sole discretion.

2. Subscription and Renewal. Your subscription will automatically renew for successive one-month terms unless you cancel before the end of the current term.

3. Fees. All fees are non-refundable.

4. Warranty Disclaimer. The Service is provided "as is" and we disclaim all warranties of any kind.

5. Limitation of Liability. Our aggregate liability under this Agreement shall not exceed the fees you paid in the previous three (3) months.

6. Disputes. You agree that all disputes will be resolved by binding arbitration, and you waive any right to a class action or a jury trial.

7. General. These terms constitute the entire agreement between you and us.`,
    },
];
