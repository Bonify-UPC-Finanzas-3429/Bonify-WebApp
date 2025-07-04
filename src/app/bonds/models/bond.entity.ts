export class Bond {
  constructor(
    public id: number,
    public bondId: string,
    public name: string,
    public nominalValue: number,
    public issueDate: Date,
    public termInYears: number,
    public annualInterestRate: number,
    public rateType: string,
    public paymentFrequency: string,
    public gracePeriod: number | null,
    public calculatedInstallment: number,
    public tcea: number,
    public tea: number,
    public readonly userId: number
  ) {}
}
