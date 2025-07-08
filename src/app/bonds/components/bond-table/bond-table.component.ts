import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Bond } from '../../models/bond.entity';
import { BondService } from '../../services/bond.service';
import { InstallmentService } from '../../services/installment.service';

@Component({
  selector: 'app-bond-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bond-table.component.html',
  styleUrls: ['./bond-table.component.css']
})
export class BondTableComponent implements OnInit {
  bonds: Bond[] = [];
  @Input() userId!: number;
  constructor(
    private bondService: BondService,
    private installmentService: InstallmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!isNaN(this.userId)) {
      this.bondService.getByUserId(this.userId).subscribe({
        next: data => {
          console.log('Bonds cargados:', data);
          this.bonds = data;
        },
        error: err => console.error('Error loading bonds by userId', err)
      });
    } else {
      this.loadBonds();
    }
  }


  refreshUserBonds(): void {
    if (!isNaN(this.userId)) {
      this.bondService.getByUserId(this.userId).subscribe({
        next: data => this.bonds = data,
        error: err => console.error('Error loading bonds by userId', err)
      });
    }
  }

  loadBonds(): void {
    this.bondService.getAll().subscribe({
      next: data => this.bonds = data,
      error: err => console.error('Error loading bonds', err)
    });
  }

  viewInstallments(userId: number, bond: Bond): void {
    this.router.navigate([`/bonds/${userId}/details/${bond.bondId}/${bond.id}`]);
  }

  confirmDelete(bondNumericId: number): void {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar este plan y sus cuotas?');
    if (!confirmed) return;

    this.installmentService.deleteByBondId(bondNumericId).subscribe({
      next: () => {
        this.bondService.delete(bondNumericId).subscribe({
          next: () => {
            alert('Plan y cuotas eliminados correctamente');
            this.refreshUserBonds();
          },
          error: err => {
            console.error('Error al eliminar bono:', err);
            alert('Error al eliminar el bono.');
          }
        });
      },
      error: err => {
        console.error('Error al eliminar cuotas:', err);
        alert('Error al eliminar las cuotas.');
      }
    });
  }
}
