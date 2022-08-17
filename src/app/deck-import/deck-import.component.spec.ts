import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckImportComponent } from './deck-import.component';

describe('DeckImportComponent', () => {
  let component: DeckImportComponent;
  let fixture: ComponentFixture<DeckImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
