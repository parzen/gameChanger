import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs';
import { GamesService } from './../games.service';
import { Game } from '../../shared/interfaces/game.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-add',
  templateUrl: './game-add.component.html',
  styleUrls: ['./game-add.component.css'],
})
export class GameAddComponent implements OnInit {
  isLoading = false;
  useApi = false;
  toggleFormText = '';
  games = [];
  customAddGameForm: FormGroup;
  apiAddGameForm: FormGroup;
  authStatusSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private gameService: GamesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.toggleFormType();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.apiAddGameForm = this.fb.group({
      title: [null, Validators.required],
    });
    this.customAddGameForm = this.fb.group({
      id: [null],
      title: ['Kiki Ricky', Validators.required],
      thumbnail: [''],
      image: [''],
      minPlayers: [2, [Validators.required, Validators.min(1)]],
      maxPlayers: [3, [Validators.required, Validators.min(1)]],
      playingTime: [15, Validators.required],
      minAge: [0, [Validators.required, Validators.min(0)]],
      note: ['Eine grüne Figur fehlt'],
      gameType: ['boardgame', Validators.required],
    });
  }

  toggleFormType() {
    this.useApi = !this.useApi;
    if (this.useApi) {
      this.toggleFormText = 'Use custom form';
    } else {
      this.toggleFormText = 'Use Api';
    }
  }

  async onSearch() {
    if (!this.apiAddGameForm.valid) {
      return;
    }
    const clientId = 'XcGu7GjNEz';

    const BGA_URL = `https://api.boardgameatlas.com/api/search?client_id=${clientId}&limit=10&name=`;
    const query = BGA_URL + this.apiAddGameForm.value.title;
    console.log(query);
    const response = await fetch(query);
    const data = await response.json();
    if (data.count == 0) {
      console.log('Nothing found!');
    } else {
      this.games = data.games.map((game) => {
        return {
          title: game.name,
          thumbnail: game.images.thumb,
          image: game.image_url,
          minPlayers: game.min_players,
          maxPlayers: game.max_players,
          minPlayTime: game.min_playtime,
          maxPlayTime: game.max_playtime,
          minAge: game.min_age,
          note: game.description_preview,
          gameType: game.type,
        };
      });
      console.log(this.games);
    }
  }

  onSubmit() {
    if (!this.customAddGameForm.valid) {
      return;
    }
    const newGame: Game = {
      id: '',
      title: this.customAddGameForm.value.title,
      thumbnail: this.customAddGameForm.value.thumbnail,
      image: this.customAddGameForm.value.image,
      minPlayers: this.customAddGameForm.value.minPlayers,
      maxPlayers: this.customAddGameForm.value.maxPlayers,
      playingTime: this.customAddGameForm.value.playingTime,
      minAge: this.customAddGameForm.value.minAge,
      note: this.customAddGameForm.value.note,
      gameType: this.customAddGameForm.value.gameType,
      creator: '',
    };
    console.log(newGame);
    this.gameService.addGame(newGame);
    //this.customAddGameForm.reset();
  }
}
