import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtheneaformComponent } from './atheneaform.component';

describe('AtheneaformComponent', () => {
  let component: AtheneaformComponent;
  let fixture: ComponentFixture<AtheneaformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtheneaformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AtheneaformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
