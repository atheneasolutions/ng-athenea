import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListAtheneaFormsPage } from './list-athenea-forms.page';

describe('ListFormsPage', () => {
  let component: ListAtheneaFormsPage;
  let fixture: ComponentFixture<ListAtheneaFormsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListAtheneaFormsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
