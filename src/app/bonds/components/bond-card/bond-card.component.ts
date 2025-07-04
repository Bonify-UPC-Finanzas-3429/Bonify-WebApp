import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bond } from '../../models/bond.entity';
import { BondService } from '../../services/bond.service';

@Component({
  selector: 'app-bond-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bond-card.component.html',
  styleUrls: ['./bond-card.component.css']
})
export class BondCardComponent implements OnInit {
  @Input() bondId!: string;
  @Input() userId!: number;

  bond!: Bond | null;

  constructor(private bondService: BondService) {}

  ngOnInit(): void {
    if (this.bondId) {
      this.bondService.getByBondId(this.bondId).subscribe({
        next: data => this.bond = data,
        error: err => {
          console.error('Error loading bond by bondId', err);
          this.bond = null;
        }
      });
    }
  }



  formatDate(dateStr: string | Date): string {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  }

  formatPercent7Decimals(value: number): string {
    const fixed = (value * 100).toFixed(7);
    return fixed + '%';
  }
}
