import { GameAddValidator } from './../../shared/validators/game-add.validator';
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
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  QueryList,
  ViewChildren,
  OnDestroy,
} from '@angular/core';
import { errorMessages } from 'src/app/shared/error-messages/error-messages';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-game-add',
  templateUrl: './game-add.component.html',
  styleUrls: ['./game-add.component.scss'],
})
export class GameAddComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  isLoadingMore: boolean = false;
  useApi: boolean = false;
  dispError = null;
  toggleFormText: string = '';
  games: Game[] = [];
  form: FormGroup;
  noMoreEntries = false;
  errors = errorMessages;
  private sub = new Subscription();

  @ViewChildren('gamesRef') gamesRef: QueryList<ElementRef>;

  @Output() onSaveEmitter = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private gameService: GamesService,
    private authService: AuthService,
    private gameAddValidator: GameAddValidator
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.authService.getAuthStatusListener().subscribe((authStatus) => {
        this.isLoading = false;
        this.isLoadingMore = false;
      })
    );
    this.form = this.fb.group(
      {
        id: [null],
        title: [null, [Validators.required, Validators.minLength(2)]],
        imagePath: [null],
        minPlayers: [null, [Validators.required, Validators.min(1)]],
        maxPlayers: [null, [Validators.required, Validators.min(1)]],
        minPlayTime: [null, [Validators.required, Validators.min(1)]],
        maxPlayTime: [null, [Validators.required, Validators.min(1)]],
        minAge: [null, [Validators.required, Validators.min(0)]],
        note: [''],
        consider: [true],
        gameType: ['boardgame', Validators.required],
      },
      {
        validators: [
          this.gameAddValidator.minPlayTimeSmallerEqualMaxPlayTime(),
          this.gameAddValidator.minPlayersSmallerEqualMaxPlayers(),
        ],
      }
    );
    this.toggleFormType();
    this.onChanges();
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

  onChanges() {
    this.sub.add(
      this.form
        .get('minPlayers')
        .valueChanges.pipe(distinctUntilChanged())
        .subscribe((value) => {
          const maxPlayersControl = this.form.get('maxPlayers');

          if (!this.useApi && !maxPlayersControl.touched) {
            maxPlayersControl.patchValue(value);
          }
        })
    );

    this.sub.add(
      this.form
        .get('maxPlayers')
        .valueChanges.pipe(distinctUntilChanged())
        .subscribe((value) => {
          const minPlayersControl = this.form.get('minPlayers');

          if (!this.useApi && !minPlayersControl.touched) {
            minPlayersControl.patchValue(value);
          }
        })
    );

    this.sub.add(
      this.form
        .get('minPlayTime')
        .valueChanges.pipe(distinctUntilChanged())
        .subscribe((value) => {
          const maxPlayTimeControl = this.form.get('maxPlayTime');

          if (!this.useApi && !maxPlayTimeControl.touched) {
            maxPlayTimeControl.patchValue(value);
          }
        })
    );

    this.sub.add(
      this.form
        .get('maxPlayTime')
        .valueChanges.pipe(distinctUntilChanged())
        .subscribe((value) => {
          const minPlayTimeControl = this.form.get('minPlayTime');

          if (!this.useApi && !minPlayTimeControl.touched) {
            minPlayTimeControl.patchValue(value);
          }
        })
    );
  }

  setActive(game, i) {
    this.gamesRef.forEach((game) => {
      game.nativeElement.classList.remove('active');
    });
    this.gamesRef.get(i).nativeElement.classList.add('active');

    this.form.controls['title'].setValue(game.title);
    this.form.controls['imagePath'].setValue(game.imagePath);
    this.form.controls['minPlayers'].setValue(game.minPlayers);
    this.form.controls['maxPlayers'].setValue(game.maxPlayers);
    this.form.controls['minPlayTime'].setValue(game.minPlayTime);
    this.form.controls['maxPlayTime'].setValue(game.maxPlayTime);
    this.form.controls['minAge'].setValue(game.minAge);
    this.form.controls['note'].setValue(game.note);
    this.form.controls['consider'].setValue(game.consider);
    this.form.controls['gameType'].setValue(game.gameType);
  }

  onSearch() {
    this.dispError = null;
    this.form.controls['title'].markAsTouched();
    if (this.form.controls['title'].invalid) {
      return;
    }
    this.games = [];
    this.noMoreEntries = false;
    this.isLoading = true;
    this.searchGames(0);
  }

  loadMoreGames() {
    const index = this.games.length;
    if (index <= 0) {
      return;
    }
    this.isLoadingMore = true;
    this.searchGames(index);
  }

  async searchGames(index: number) {
    const clientId = 'XcGu7GjNEz';
    const limit = 10;
    const BGA_URL = `https://api.boardgameatlas.com/api/search?client_id=${clientId}&limit=${limit}&skip=${index}&name=`;
    const query = BGA_URL + this.form.value.title;
    const response = await fetch(query);
    const data = await response.json();
    if (data.count == 0) {
      this.dispError = 'Nothing found, try custom form!';
      this.noMoreEntries = true;
    } else {
      const newGames = data.games.map((game) => {
        return {
          title: game.name,
          imagePath: game.images.medium,
          minPlayers: game.min_players,
          maxPlayers: game.max_players,
          minPlayTime: game.min_playtime,
          maxPlayTime: game.max_playtime,
          minAge: game.min_age,
          note: '',
          consider: true,
          gameType: game.type,
        };
      });
      this.games = [...this.games, ...newGames];

      if (newGames.length < limit) {
        this.noMoreEntries = true;
      }
    }
    this.isLoading = false;
    this.isLoadingMore = false;
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
      consider: this.form.value.consider,
      gameType: this.form.value.gameType,
      creator: '',
    };

    this.gameService.addGame(newGame).subscribe(
      (response) => {
        this.onSaveEmitter.emit({ message: response.message, error: false });
      },
      (error) => {
        this.onSaveEmitter.emit({ message: error, error: true });
      }
    );
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

  trackByTitle(index: number, game: Game): string {
    return game.title;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
