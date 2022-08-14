import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckAllComponent } from './deck-all.component';

describe('DeckAllComponent', () => {
  let component: DeckAllComponent;
  let fixture: ComponentFixture<DeckAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
