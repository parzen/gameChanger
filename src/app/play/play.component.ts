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
      players: [2, [Validators.required, Validators.min(1)]],
      minPlayTime: [1, [Validators.required, Validators.min(1)]],
      minAge: [6, [Validators.required, Validators.min(0)]],
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
      .play(this.form.value.players)
      .subscribe((transformedGameData) => {
        if (transformedGameData.games.length == 0) {
          this.apiError = 'No games found, try a different number of players!';
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
