export class Installment {
  constructor(
    public id: number,
    public periodNumber: number,
    public bondId: number,
    public interest: number,
    public amortization: number,
    public totalPayment: number,
    public remainingBalance: number,
    public paymentDate: Date
  ) {}
}
