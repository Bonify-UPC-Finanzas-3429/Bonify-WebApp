import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstallmentService } from '../../services/installment.service';
import { Installment } from '../../models/installment.entity';

@Component({
  selector: 'app-installment-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './installment-table.component.html',
  styleUrls: ['./installment-table.component.css']
})
export class InstallmentTableComponent implements OnInit {
  @Input() bondNumericId!: number;

  installments: Installment[] = [];

  constructor(private installmentService: InstallmentService) {}

  ngOnInit(): void {
    if (this.bondNumericId) {
      this.installmentService.getByBondId(this.bondNumericId).subscribe({
        next: data => this.installments = data,
        error: err => console.error('Error loading installments', err)
      });
    }
  }
}
