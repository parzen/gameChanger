import { AddGameResponse } from './../../shared/interfaces/addGameResponse.interface';
import { SnackbarService } from './../../snackbar.service';
import { GameAddValidator } from './../../shared/validators/game-add.validator';
import { Game } from './../../shared/interfaces/game.interface';
import { AuthService } from './../../auth/auth.service';
import { Subject, Subscription } from 'rxjs';
import { GamesService } from './../games.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { errorMessages } from 'src/app/shared/error-messages/error-messages';
import { distinctUntilChanged } from 'rxjs/operators';
import { validateAllFormFields } from 'src/app/shared/validators/validate-all-form-fields';

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
  searchTitle: string = '';
  triggerRemoveActiveClass: Subject<void> = new Subject<void>();
  private sub = new Subscription();

  @Output() onSaveEmitter: EventEmitter<AddGameResponse> =
    new EventEmitter<AddGameResponse>();

  constructor(
    private fb: FormBuilder,
    private gameService: GamesService,
    private authService: AuthService,
    private gameAddValidator: GameAddValidator,
    private snackBarService: SnackbarService
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

  fillForm(game: Game) {
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

  emptyForm() {
    if (!this.useApi) {
      this.form.controls['title'].setValue(null);
      this.form.controls['title'].markAsUntouched();
    }

    this.form.controls['imagePath'].setValue(null);
    this.form.controls['minPlayers'].setValue(null);
    this.form.controls['maxPlayers'].setValue(null);
    this.form.controls['minPlayTime'].setValue(null);
    this.form.controls['maxPlayTime'].setValue(null);
    this.form.controls['minAge'].setValue(null);
    this.form.controls['note'].setValue(null);
    this.form.controls['consider'].setValue(true);
    this.form.controls['gameType'].setValue('boardgame');

    this.form.controls['imagePath'].markAsUntouched();
    this.form.controls['minPlayers'].markAsUntouched();
    this.form.controls['maxPlayers'].markAsUntouched();
    this.form.controls['minPlayTime'].markAsUntouched();
    this.form.controls['maxPlayTime'].markAsUntouched();
    this.form.controls['minAge'].markAsUntouched();
    this.form.controls['note'].markAsUntouched();
    this.form.controls['consider'].markAsUntouched();
    this.form.controls['gameType'].markAsUntouched();
  }

  onSearch() {
    this.dispError = null;
    this.emptyForm();
    this.form.controls['title'].markAsTouched();
    if (this.form.controls['title'].invalid) {
      return;
    }
    this.searchTitle = this.form.value.title;
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
    const query = BGA_URL + this.searchTitle;
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

  onSubmit(closeAfterSaving) {
    if (!this.form.valid) {
      validateAllFormFields(this.form);

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
        if (closeAfterSaving) {
          this.onSaveEmitter.emit({
            message: response.message,
            error: false,
            cancel: false,
          });
        } else {
          this.emptyForm();
          this.triggerRemoveActiveClass.next();
          this.snackBarService.open(response.message, false);
        }
      },
      (error) => {
        if (closeAfterSaving) {
          this.onSaveEmitter.emit({
            message: error,
            error: true,
            cancel: false,
          });
        } else {
          this.snackBarService.open(error, true);
        }
      }
    );
  }

  onCancel() {
    this.onSaveEmitter.emit({ message: '', error: false, cancel: true });
  }

  trackByTitle(index: number, game: Game): string {
    return game.title;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
