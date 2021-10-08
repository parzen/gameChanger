import { PlayService } from './../play.service';
import { errorMessages } from 'src/app/shared/error-messages/error-messages';
import { Game } from '../../shared/interfaces/game.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit {
  isLoading = false;
  game: Game = null;
  dispError = null;
  form: FormGroup;
  games: Game[];
  errors = errorMessages;

  constructor(private fb: FormBuilder, private PlayService: PlayService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      playerControl: ['2', Validators.required],
      maxPlayControl: ['999', Validators.required],
      minAgeControl: ['6', Validators.required],
    });
  }

  getGamesToPlay(random: boolean) {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.dispError = null;
    this.game = null;
    this.games = null;

    this.PlayService.play(
      this.form.value.playerControl,
      this.form.value.maxPlayControl,
      this.form.value.minAgeControl
    ).subscribe((transformedGameData) => {
      if (transformedGameData.games.length == 0) {
        this.dispError = this.errors.noGamesFound;
      } else {
        if (random) {
          const randomNumber = Math.floor(
            Math.random() * transformedGameData.games.length
          );
          this.game = transformedGameData.games[randomNumber];
        } else {
          this.games = transformedGameData.games;
        }
      }
      this.isLoading = false;
    });
  }
}
