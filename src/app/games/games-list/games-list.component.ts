import { SnackbarService } from './../../snackbar.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';
import { AuthService } from './../../auth/auth.service';
import { GamesService } from './../games.service';
import { GameAddComponent } from '../game-add/game-add.component';
import { Game } from '../../shared/interfaces/game.interface';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddGameResponse } from 'src/app/shared/interfaces/addGameResponse.interface';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
})
export class GamesListComponent implements OnInit, OnDestroy {
  games: Game[] = [];
  allGames: Game[] = [];
  isLoading = false;
  userId: string = '';
  userIsauthenticated = false;
  form: FormGroup;
  private authStatusSub!: Subscription;
  private gamesSub!: Subscription;

  constructor(
    public dialog: MatDialog,
    private gameService: GamesService,
    private authService: AuthService,
    private snackBarService: SnackbarService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.gameService.getGames();
    this.userId = this.authService.getUserId();
    this.gamesSub = this.gameService
      .getGameUpdateListener()
      .subscribe((gameData: { games: Game[] }) => {
        this.isLoading = false;
        this.games = gameData.games;
        this.allGames = [...this.games];
      });
    this.userIsauthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userId = this.authService.getUserId();
        this.userIsauthenticated = isAuthenticated;
      });
    this.form = this.fb.group({ searchTitle: [''] });
    this.form.controls['searchTitle'].valueChanges.subscribe(
      (searchTitle: string) => {
        this.games = this.allGames.filter(
          (game: Game) =>
            game.title.toLowerCase().indexOf(searchTitle.toLowerCase()) > -1
        );
      }
    );
  }

  openSnackBar(message: string, error: boolean) {
    this.snackBarService.open(message, error);
  }

  addGame() {
    const dialogRef = this.dialog.open(GameAddComponent, {
      width: '80%',
    });

    const sub = dialogRef.componentInstance.onSaveEmitter.subscribe(
      (response: AddGameResponse) => {
        dialogRef.close();
        if (!response.cancel) {
          this.openSnackBar(response.message, response.error);
        }
        this.gameService.getGames();
      }
    );
  }

  ngOnDestroy() {
    this.gamesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDeleteGame(gameId: string) {
    const message = null;
    const dialogData = new ConfirmDialogModel(
      'Are you sure you want to delete?',
      message
    );

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.isLoading = true;
        this.gameService.deleteGame(gameId).subscribe(
          () => {
            this.gameService.getGames();
          },
          () => {
            this.isLoading = false;
          }
        );
      }
    });
  }

  openSearch() {
    console.log('open it');
  }

  closeSearch() {
    console.log('close it');
  }
}
