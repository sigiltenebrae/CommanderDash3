import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckBansComponent } from './deck-bans.component';

describe('DeckBansComponent', () => {
  let component: DeckBansComponent;
  let fixture: ComponentFixture<DeckBansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckBansComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckBansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
