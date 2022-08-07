import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckRecsComponent } from './deck-recs.component';

describe('DeckRecsComponent', () => {
  let component: DeckRecsComponent;
  let fixture: ComponentFixture<DeckRecsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckRecsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckRecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
