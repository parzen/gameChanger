import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { GameAddComponent } from './game-add.component';

describe('GameAddComponent', () => {
  let component: GameAddComponent;
  let fixture: ComponentFixture<GameAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameAddComponent],
      imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
