import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstallmentTableComponent } from '../../components/installment-table/installment-table.component';
import { BondCardComponent } from '../../components/bond-card/bond-card.component';

@Component({
  selector: 'app-bond-details',
  standalone: true,
  imports: [
    InstallmentTableComponent,
    BondCardComponent
  ],
  templateUrl: './bond-details.component.html',
  styleUrls: ['./bond-details.component.css']
})
export class BondDetailsComponent implements OnInit {
  userId!: number;
  bondId!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('userId'));
    this.bondId = this.route.snapshot.paramMap.get('bondId')!;
  }
}
