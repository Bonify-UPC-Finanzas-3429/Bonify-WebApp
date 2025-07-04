import { Component, OnInit } from '@angular/core';
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
  userId!: number;

  constructor(
    private bondService: BondService,
    private installmentService: InstallmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('userId'));
    if (!isNaN(this.userId)) {
      this.bondService.getByUserId(this.userId).subscribe({
        next: data => this.bonds = data,
        error: err => console.error('Error loading bonds by userId', err)
      });
    } else {
      this.loadBonds();
    }
  }

  loadBonds(): void {
    this.bondService.getAll().subscribe({
      next: data => this.bonds = data,
      error: err => console.error('Error loading bonds', err)
    });
  }

  viewInstallments(userId: number, bondId: number): void {
    this.router.navigate([`/bonds/${userId}/details/${bondId}`]);
  }

  confirmDelete(bondId: number): void {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar este plan y sus cuotas?');
    if (!confirmed) return;

    this.installmentService.deleteByBondId(bondId).subscribe({
      next: () => {

        this.bondService.delete(bondId).subscribe({
          next: () => {
            alert('Plan y cuotas eliminados correctamente');
            this.bondService.getByUserId(this.userId).subscribe({
              next: data => this.bonds = data
            });
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
