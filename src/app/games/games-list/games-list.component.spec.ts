import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { GamesRoutingModule } from './../games-routing.module';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './../../angular-material.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesListComponent } from './games-list.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('GamesListComponent', () => {
  let component: GamesListComponent;
  let fixture: ComponentFixture<GamesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GamesListComponent],
      imports: [
        AngularMaterialModule,
        CommonModule,
        ReactiveFormsModule,
        GamesRoutingModule,
        HttpClientModule,
        RouterTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
