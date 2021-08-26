import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Game } from './../../shared/interfaces/game.interface';
import { GamesService } from './../games.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  styleUrls: ['./game-edit.component.css'],
})
export class GameEditComponent implements OnInit {
  gameId: string;
  creator: string;
  isLoading = false;
  form: FormGroup;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private gamesService: GamesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [null, Validators.required],
      imagePath: [null],
      minPlayers: [null, [Validators.required, Validators.min(1)]],
      maxPlayers: [null, [Validators.required, Validators.min(1)]],
      minPlayTime: [null, Validators.required],
      maxPlayTime: [null, Validators.required],
      minAge: [null, [Validators.required, Validators.min(0)]],
      note: [null],
      gameType: ['boardgame', Validators.required],
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.gameId = paramMap.get('id');
        this.isLoading = true;
        this.gamesService.getGame(this.gameId).subscribe((gameData) => {
          this.isLoading = false;

          this.creator = gameData.creator;
          this.form.setValue({
            title: gameData.title,
            imagePath: gameData.imagePath,
            minPlayers: gameData.minPlayers,
            maxPlayers: gameData.maxPlayers,
            minPlayTime: gameData.minPlayTime,
            maxPlayTime: gameData.maxPlayTime,
            minAge: gameData.minAge,
            note: gameData.note,
            gameType: gameData.gameType,
          });
        });
      } else {
        this.router.navigate(['/games']);
      }
    });
  }

  onSaveGame() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    const updatedGame: Game = {
      id: this.gameId,
      title: this.form.value.title,
      imagePath: this.form.value.imagePath,
      minPlayers: this.form.value.minPlayers,
      maxPlayers: this.form.value.maxPlayers,
      minPlayTime: this.form.value.minPlayTime,
      maxPlayTime: this.form.value.maxPlayTime,
      minAge: this.form.value.minAge,
      note: this.form.value.note,
      gameType: this.form.value.gameType,
      creator: this.creator,
    };

    this.gamesService.updateGame(updatedGame);
    this.form.reset();
  }
}
