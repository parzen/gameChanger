import { Game } from './../../shared/interfaces/game.interface';
import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs';
import { GamesService } from './../games.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-game-add',
  templateUrl: './game-add.component.html',
  styleUrls: ['./game-add.component.css'],
})
export class GameAddComponent implements OnInit {
  isLoading: boolean = false;
  useApi: boolean = false;
  apiError = null;
  activeCard = null;
  toggleFormText: string = '';
  maxNoteLength = 50;
  games: Game[] = [];
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
      title: ['', Validators.required],
      imagePath: [''],
      minPlayers: [2, [Validators.required, Validators.min(1)]],
      maxPlayers: [3, [Validators.required, Validators.min(1)]],
      minPlayTime: [15, Validators.required],
      maxPlayTime: [30, Validators.required],
      minAge: [0, [Validators.required, Validators.min(0)]],
      note: ['Eine grüne Figur fehlt'],
      gameType: ['boardgame', Validators.required],
    });
    this.toggleFormType();
  }

  toggleFormType() {
    this.apiError = null;
    this.useApi = !this.useApi;
    this.customAddGameForm
      .get('title')
      .setValue(this.apiAddGameForm.get('title').value);
    if (this.useApi) {
      this.toggleFormText = 'Use custom form';
    } else {
      this.toggleFormText = 'Use Api';
    }
  }

  toggleNote(idx) {
    console.log('Toggle ', idx);
    const element = document.getElementById('game' + idx);
    const text = element.textContent;
    let newText = text;
    if (element.getAttribute('truncated') === '0') {
      newText = text.slice(0, this.maxNoteLength) + '...';
      element.setAttribute('truncated', '1');
    }
    console.log('newText: ' + newText);
  }

  setActive(idx) {
    const element = document.getElementById('card' + idx);
    console.log('Try to add active to: ', idx);
    const current = document.getElementsByClassName('active');
    if (current[0]) {
      current[0].className = current[0].className.replace(' active', '');
    }
    element.className += ' active';
    this.activeCard = idx;
  }

  async onSearch() {
    this.apiError = null;
    if (!this.apiAddGameForm.valid) {
      return;
    }
    this.isLoading = true;
    this.games = [];
    const clientId = 'XcGu7GjNEz';
    const BGA_URL = `https://api.boardgameatlas.com/api/search?client_id=${clientId}&limit=10&name=`;
    const query = BGA_URL + this.apiAddGameForm.value.title;
    console.log(query);
    const response = await fetch(query);
    const data = await response.json();
    if (data.count == 0) {
      this.apiError = 'Nothing found, try custom form!';
    } else {
      this.games = data.games.map((game) => {
        return {
          title: game.name,
          imagePath: game.images.medium,
          minPlayers: game.min_players,
          maxPlayers: game.max_players,
          minPlayTime: game.min_playtime,
          maxPlayTime: game.max_playtime,
          minAge: game.min_age,
          //note: game.description_preview,
          note: '',
          gameType: game.type,
        };
      });
      console.log(this.games);
    }
    this.isLoading = false;
  }

  onSubmitCustom() {
    console.log('onSubmitCustom');
    if (!this.customAddGameForm.valid) {
      return;
    }
    const newGame: Game = {
      id: '',
      title: this.customAddGameForm.value.title,
      imagePath: this.customAddGameForm.value.imagePath,
      minPlayers: this.customAddGameForm.value.minPlayers,
      maxPlayers: this.customAddGameForm.value.maxPlayers,
      minPlayTime: this.customAddGameForm.value.minPlayTime,
      maxPlayTime: this.customAddGameForm.value.maxPlayTime,
      minAge: this.customAddGameForm.value.minAge,
      note: this.customAddGameForm.value.note,
      gameType: this.customAddGameForm.value.gameType,
      creator: '',
    };
    console.log(newGame);
    this.gameService.addGame(newGame);
    //this.customAddGameForm.reset();
  }

  onSubmitApi() {
    console.log('onSubmitApi with: ', this.games[this.activeCard]);
    if (!this.apiAddGameForm.valid || this.activeCard == null) {
      return;
    }
    const newGame: Game = {
      id: '',
      title: this.games[this.activeCard].title,
      imagePath: this.games[this.activeCard].imagePath,
      minPlayers: this.games[this.activeCard].minPlayers,
      maxPlayers: this.games[this.activeCard].maxPlayers,
      minPlayTime: this.games[this.activeCard].minPlayTime,
      maxPlayTime: this.games[this.activeCard].maxPlayTime,
      minAge: this.games[this.activeCard].minAge,
      note: this.games[this.activeCard].note,
      gameType: this.games[this.activeCard].gameType,
      creator: '',
    };
    console.log(newGame);
    this.gameService.addGame(newGame);
  }
}
