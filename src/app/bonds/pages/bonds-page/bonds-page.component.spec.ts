import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BondsPageComponent } from './bonds-page.component';

describe('BondsPageComponent', () => {
  let component: BondsPageComponent;
  let fixture: ComponentFixture<BondsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BondsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BondsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
