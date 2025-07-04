import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Installment } from '../../models/installment.entity';
import { Bond } from '../../models/bond.entity';
import { BondService } from '../../services/bond.service';
import { InstallmentService } from '../../services/installment.service';

@Component({
  selector: 'app-bond-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bond-form.component.html',
  styleUrls: ['./bond-form.component.css'],
  providers: [BondService, InstallmentService]
})
export class BondFormComponent {
  bond = {
    name: '',
    nominalValue: 0,
    issueDate: '',
    termInYears: 1,
    annualInterestRate: 0,
    rateType: '',
    paymentFrequency: '',
    gracePeriod: 0,
    calculatedInstallment: 0,
    tea: 0,
    tcea: 0,
    userId: 1
  };

  rateTypes = ['Efectiva', 'Nominal'];
  paymentFrequencies = ['Mensual', 'Bimestral', 'Trimestral', 'Cuatrimestral', 'Semestral', 'Anual', 'Quincenal'];
  today = new Date().toISOString().split('T')[0];

  constructor(
    @Optional() private dialogRef: MatDialogRef<BondFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private bondService: BondService,
    private installmentService: InstallmentService
  ) {}

  preventInvalidKeys(event: KeyboardEvent) {
    if (['-', '+'].includes(event.key)) {
      event.preventDefault();
    }
  }

  close() {
    this.dialogRef?.close();
  }

  async getNextBondId(): Promise<number> {
    const bonds = await this.bondService.getAll().toPromise();
    const ids = bonds?.map(b => b.id) || [];
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return maxId + 1;
  }

  async saveBond() {
    const {
      name, nominalValue, issueDate, termInYears,
      annualInterestRate, rateType, paymentFrequency,
      gracePeriod, userId
    } = this.bond;

    const errors: string[] = [];

    if (!name.trim()) errors.push('Nombre es obligatorio.');
    if (nominalValue <= 0) errors.push('Valor nominal debe ser mayor a 0.');
    if (!issueDate) errors.push('Fecha de emisión es obligatoria.');
    if (termInYears <= 0) errors.push('Años de plazo debe ser mayor a 0.');
    if (annualInterestRate <= 0) errors.push('Interés anual debe ser mayor a 0.');
    if (!rateType.trim()) errors.push('Tipo de tasa es obligatorio.');
    if (!paymentFrequency.trim()) errors.push('Frecuencia de pago es obligatoria.');
    if (gracePeriod < 0) errors.push('Período de gracia no puede ser negativo.');

    if (errors.length > 0) {
      alert('Por favor corrige los siguientes errores:\n- ' + errors.join('\n- '));
      return;
    }

    const frequencyMap: { [key: string]: number } = {
      'mensual': 12,
      'bimestral': 6,
      'trimestral': 4,
      'cuatrimestral': 3,
      'semestral': 2,
      'anual': 1,
      'quincenal': 24
    };

    const paymentsPerYear = frequencyMap[paymentFrequency.toLowerCase()];
    const totalInstallments = termInYears * paymentsPerYear;

    let ratePerPeriod = rateType.toLowerCase() === 'efectiva'
      ? Math.pow(1 + annualInterestRate / 100, 1 / paymentsPerYear) - 1
      : (annualInterestRate / 100) / paymentsPerYear;

    const installmentRaw = nominalValue * ratePerPeriod / (1 - Math.pow(1 + ratePerPeriod, -totalInstallments));
    const tea = Number((Math.pow(1 + ratePerPeriod, paymentsPerYear) - 1).toFixed(7));
    const tcea = Number(tea.toFixed(7));

    this.bond.calculatedInstallment = totalInstallments;
    this.bond.tea = tea;
    this.bond.tcea = tcea;

    const nextBondId = await this.getNextBondId();

    try {
      const bondToSave = new Bond(
        nextBondId,
        nextBondId.toString(),
        name,
        nominalValue,
        new Date(issueDate),
        termInYears,
        annualInterestRate,
        rateType,
        paymentFrequency,
        gracePeriod,
        totalInstallments,
        tcea,
        tea,
        userId
      );

      const savedBond = await this.bondService.create(bondToSave).toPromise();
      const savedBondId = (savedBond as any).id;

      const existingInstallments = await this.installmentService.getAll().toPromise();
      const maxInstallmentId = Array.isArray(existingInstallments) && existingInstallments.length > 0
        ? Math.max(...existingInstallments.map(i => Number(i.id)))
        : 0;

      const installments: Installment[] = [];
      let balance = nominalValue;
      const monthsBetweenPayments = Math.floor(12 / paymentsPerYear);
      const baseDate = new Date(issueDate);

      for (let i = 1; i <= totalInstallments; i++) {
        const interest = Number((balance * ratePerPeriod).toFixed(2));
        const amortization = Number((installmentRaw - interest).toFixed(2));
        const totalPayment = Number((interest + amortization).toFixed(2));
        let adjustedAmortization = amortization;
        let adjustedBalance = Number((balance - amortization).toFixed(2));

        if (i === totalInstallments) {
          adjustedAmortization = Number(balance.toFixed(2));
          adjustedBalance = 0;
        }

        balance = adjustedBalance;

        const paymentDate = new Date(baseDate);
        paymentDate.setMonth(paymentDate.getMonth() + i * monthsBetweenPayments);

        const installmentId = maxInstallmentId + i;

        installments.push(new Installment(
          installmentId,
          i,
          savedBondId,
          interest,
          adjustedAmortization,
          totalPayment,
          adjustedBalance,
          paymentDate
        ));
      }

      for (const inst of installments) {
        await this.installmentService.create(inst).toPromise();
      }

      alert('¡Plan creado exitosamente!');
      this.dialogRef?.close(true);
    } catch (error) {
      console.error('Error al guardar el bono o las cuotas:', error);
      alert('Hubo un error al guardar el bono o las cuotas. Revisa la consola.');
    }
  }
}
