import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BloodPressureHeartRateResultComponent } from './blood-pressure-heart-rate-result.component';

describe('BloodPressureHeartRateResultComponent', () => {
  let component: BloodPressureHeartRateResultComponent;
  let fixture: ComponentFixture<BloodPressureHeartRateResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BloodPressureHeartRateResultComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BloodPressureHeartRateResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
