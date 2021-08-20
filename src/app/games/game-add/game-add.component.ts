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
  customAddGameForm: FormGroup;
  apiAddGameForm: FormGroup;
  authStatusSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private gameService: GamesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
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

  async onSearch() {
    if (!this.apiAddGameForm.valid) {
      return;
    }
    const BGG_URL = 'https://www.boardgamegeek.com/xmlapi2/search?';
    const query = BGG_URL + 'query=' + this.apiAddGameForm.value.title;
    console.log(query);
    const xmlData = await fetch(query);
    console.log("xmlData: ", xmlData);

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
