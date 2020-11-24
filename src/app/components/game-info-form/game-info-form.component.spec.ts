import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameInfoFormComponent } from './game-info-form.component';

describe('GameInfoFormComponent', () => {
  let component: GameInfoFormComponent;
  let fixture: ComponentFixture<GameInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameInfoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
