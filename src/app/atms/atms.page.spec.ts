import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtmsPage } from './atms.page';

describe('AtmsPage', () => {
  let component: AtmsPage;
  let fixture: ComponentFixture<AtmsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtmsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtmsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
