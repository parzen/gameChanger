import { GamesService } from './../games/games.service';
import { Game } from './../shared/interfaces/game.interface';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css'],
})
export class PlayComponent implements OnInit {
  isLoading = false;
  game: Game = null;
  apiError = null;
  form: FormGroup;

  constructor(private fb: FormBuilder, private gamesService: GamesService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      playerControl: ['2', Validators.required],
      maxPlayControl: ['999', Validators.required],
      minAgeControl: ['6', Validators.required]
    });
  }

  onPlay() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.apiError = null;
    this.game = null;

    this.gamesService
      .play(this.form.value.playerControl, this.form.value.maxPlayControl, this.form.value.minAgeControl)
      .subscribe((transformedGameData) => {
        if (transformedGameData.games.length == 0) {
          this.apiError = 'No games found, try different parameters!';
        } else {
          const random = Math.floor(
            Math.random() * transformedGameData.games.length
          );
          this.game = transformedGameData.games[random];
        }
        this.isLoading = false;
      });
  }
}
