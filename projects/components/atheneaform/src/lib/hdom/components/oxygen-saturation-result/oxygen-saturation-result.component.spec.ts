import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { OxygenSaturationResultComponent } from './oxygen-saturation-result.component';


describe('OxygenSaturationResultComponent', () => {
  let component: OxygenSaturationResultComponent;
  let fixture: ComponentFixture<OxygenSaturationResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OxygenSaturationResultComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OxygenSaturationResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
