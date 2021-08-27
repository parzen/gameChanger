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

  constructor(private gamesService: GamesService) { }

  ngOnInit(): void {
  }

  onPlay(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.gamesService.play(form.value.players).subscribe((transformedGameData) => {
      this.games = transformedGameData.games;
      this.isLoading = false;
    });
  }
}
