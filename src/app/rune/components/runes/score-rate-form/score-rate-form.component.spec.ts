import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreRateFormComponent } from 'src/app/rune/components/runes/score-rate-form/score-rate-form.component';

describe('ScoreRateFormComponent', () => {
  let component: ScoreRateFormComponent;
  let fixture: ComponentFixture<ScoreRateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreRateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreRateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
