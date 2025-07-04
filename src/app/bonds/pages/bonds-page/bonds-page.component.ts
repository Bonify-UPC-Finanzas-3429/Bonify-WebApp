import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BondFormComponent } from '../../components/bond-form/bond-form.component';
import { BondTableComponent } from '../../components/bond-table/bond-table.component';

@Component({
  selector: 'app-bonds-page.component',
  templateUrl: './bonds-page.component.html',
  styleUrls: ['./bonds-page.component.css'],
  standalone: true,
  imports: [BondTableComponent]
})
export class BondsPageComponent {
  @ViewChild(BondTableComponent) bondTable!: BondTableComponent;

  constructor(private dialog: MatDialog) {}

  openBondForm() {
    const dialogRef = this.dialog.open(BondFormComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bondTable.loadBonds();
      }
    });
  }
}
