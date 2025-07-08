import {Component, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BondFormComponent } from '../../components/bond-form/bond-form.component';
import { BondTableComponent } from '../../components/bond-table/bond-table.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bonds-page.component',
  templateUrl: './bonds-page.component.html',
  styleUrls: ['./bonds-page.component.css'],
  standalone: true,
  imports: [BondTableComponent]
})
export class BondsPageComponent implements OnInit{
  userId!: number;
  @ViewChild(BondTableComponent) bondTable!: BondTableComponent;

  constructor(private dialog: MatDialog, private route: ActivatedRoute) {}
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('userId');
    this.userId = idParam ? Number(idParam) : 0;
  }
  openBondForm() {
    const dialogRef = this.dialog.open(BondFormComponent, {
      width: '600px',
      data: { userId: this.userId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bondTable.refreshUserBonds();
      }
    });
  }

}
