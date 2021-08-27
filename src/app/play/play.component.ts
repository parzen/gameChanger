import { GamesService } from './../games/games.service';
import { Game } from './../shared/interfaces/game.interface';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  isLoading = false;
  games: Game[] = [];
  apiError = null;

  constructor(private gamesService: GamesService) { }

  ngOnInit(): void {
  }

  onPlay(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.apiError = null;
    this.gamesService.play(form.value.players).subscribe((transformedGameData) => {
      this.games = transformedGameData.games;
      console.log(transformedGameData)
      if (this.games.length == 0) {
        this.apiError = 'No games found, try a different number of players!';
      }
      this.isLoading = false;
    });
  }
}
