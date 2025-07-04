import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BondCardComponent } from './bond-card.component';

describe('BondCardComponent', () => {
  let component: BondCardComponent;
  let fixture: ComponentFixture<BondCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BondCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BondCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
