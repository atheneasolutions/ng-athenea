import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListFormsPage } from './list-forms.page';

describe('ListFormsPage', () => {
  let component: ListFormsPage;
  let fixture: ComponentFixture<ListFormsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListFormsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
