import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitDialogComponent } from 'src/app/unit/components/unit-dialog/unit-dialog.component';

describe('UnitDialogComponent', () => {
  let component: UnitDialogComponent;
  let fixture: ComponentFixture<UnitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
