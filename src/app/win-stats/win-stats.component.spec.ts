import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinStatsComponent } from './win-stats.component';

describe('WinStatsComponent', () => {
  let component: WinStatsComponent;
  let fixture: ComponentFixture<WinStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WinStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
