import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingHeartsComponentComponent } from './floating-hearts-component.component';

describe('FloatingHeartsComponentComponent', () => {
  let component: FloatingHeartsComponentComponent;
  let fixture: ComponentFixture<FloatingHeartsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingHeartsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingHeartsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
