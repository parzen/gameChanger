import { GamesService } from './../games/games.service';
import { Game } from './../shared/interfaces/game.interface';
import { NgForm } from '@angular/forms';
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

  constructor(private gamesService: GamesService) {}

  ngOnInit(): void {}

  onPlay(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.apiError = null;
    this.game = null;
    this.gamesService
      .play(form.value.players)
      .subscribe((transformedGameData) => {
        if (transformedGameData.games.length == 0) {
          this.apiError = 'No games found, try a different number of players!';
        } else {
          const random = Math.floor(Math.random() * transformedGameData.games.length);
          this.game = transformedGameData.games[random];
        }
        this.isLoading = false;
      });
  }
}
