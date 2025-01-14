import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JerseyContainerComponent } from './jersey-container.component';

describe('JerseyContainerComponent', () => {
  let component: JerseyContainerComponent;
  let fixture: ComponentFixture<JerseyContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JerseyContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JerseyContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
