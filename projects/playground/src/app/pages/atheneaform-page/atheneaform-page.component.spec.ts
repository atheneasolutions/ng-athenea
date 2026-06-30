import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtheneaformPageComponent } from './atheneaform-page.component';

describe('AtheneaformPageComponent', () => {
  let component: AtheneaformPageComponent;
  let fixture: ComponentFixture<AtheneaformPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtheneaformPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AtheneaformPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
