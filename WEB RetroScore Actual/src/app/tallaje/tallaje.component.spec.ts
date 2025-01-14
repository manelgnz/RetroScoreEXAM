import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TallajeComponent } from './tallaje.component';

describe('TallajeComponent', () => {
  let component: TallajeComponent;
  let fixture: ComponentFixture<TallajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TallajeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TallajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
