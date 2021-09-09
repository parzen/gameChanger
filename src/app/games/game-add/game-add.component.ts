import { Game } from './../../shared/interfaces/game.interface';
import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs';
import { GamesService } from './../games.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-add',
  templateUrl: './game-add.component.html',
  styleUrls: ['./game-add.component.css'],
})
export class GameAddComponent implements OnInit {
  isLoading: boolean = false;
  useApi: boolean = false;
  dispError = null;
  toggleFormText: string = '';
  maxNoteLength = 50;
  games: Game[] = [];
  form: FormGroup;
  authStatusSub: Subscription;

  @Output() onSaveEmitter = new EventEmitter();

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
    this.form = this.fb.group({
      id: [null],
      title: [null, Validators.required],
      imagePath: [null],
      minPlayers: [null, [Validators.required, Validators.min(1)]],
      maxPlayers: [null, [Validators.required, Validators.min(1)]],
      minPlayTime: [null, Validators.required],
      maxPlayTime: [null, Validators.required],
      minAge: [null, [Validators.required, Validators.min(0)]],
      note: [''],
      gameType: ['boardgame', Validators.required],
    });
    this.toggleFormType();
  }

  toggleFormType() {
    this.dispError = null;
    this.useApi = !this.useApi;
    if (this.useApi) {
      this.toggleFormText = 'Use form';
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
      current[0].classList.remove('active');
    }
    element.classList.add('active');

    this.form.controls['title'].setValue(this.games[idx].title);
    this.form.controls['imagePath'].setValue(this.games[idx].imagePath);
    this.form.controls['minPlayers'].setValue(this.games[idx].minPlayers);
    this.form.controls['maxPlayers'].setValue(this.games[idx].maxPlayers);
    this.form.controls['minPlayTime'].setValue(this.games[idx].minPlayTime);
    this.form.controls['maxPlayTime'].setValue(this.games[idx].maxPlayTime);
    this.form.controls['minAge'].setValue(this.games[idx].minAge);
    this.form.controls['note'].setValue(this.games[idx].note);
    this.form.controls['gameType'].setValue(this.games[idx].gameType);
  }

  async onSearch() {
    this.dispError = null;
    if (!this.form.value.title) {
      return;
    }
    this.isLoading = true;
    this.games = [];
    const clientId = 'XcGu7GjNEz';
    const BGA_URL = `https://api.boardgameatlas.com/api/search?client_id=${clientId}&limit=10&name=`;
    const query = BGA_URL + this.form.value.title;
    console.log(query);
    const response = await fetch(query);
    const data = await response.json();
    if (data.count == 0) {
      this.dispError = 'Nothing found, try custom form!';
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

  onSubmit() {
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);

      // If some values are missing, switch to custom form
      if (this.useApi) {
        this.useApi = false;
      }
      return;
    }

    const newGame: Game = {
      id: '',
      title: this.form.value.title,
      imagePath: this.form.value.imagePath,
      minPlayers: this.form.value.minPlayers,
      maxPlayers: this.form.value.maxPlayers,
      minPlayTime: this.form.value.minPlayTime,
      maxPlayTime: this.form.value.maxPlayTime,
      minAge: this.form.value.minAge,
      note: this.form.value.note,
      gameType: this.form.value.gameType,
      creator: '',
    };

    this.gameService.addGame(newGame).subscribe((response) => {
      this.onSaveEmitter.emit({"message": response.message, "error": false});
    }, error => {
      this.onSaveEmitter.emit({"message": error.error.message, "error": true});
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
