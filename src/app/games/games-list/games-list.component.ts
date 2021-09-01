import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from './../../confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';
import { AuthService } from './../../auth/auth.service';
import { GamesService } from './../games.service';
import { GameAddComponent } from '../game-add/game-add.component';
import { Game } from '../../shared/interfaces/game.interface';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css'],
})
export class GamesListComponent implements OnInit, OnDestroy {
  games: Game[] = [];
  isLoading = false;
  userId: string = '';
  userIsauthenticated = false;
  maxNoteLength = 50;
  private authStatusSub!: Subscription;
  private gamesSub!: Subscription;

  constructor(
    public dialog: MatDialog,
    private gameService: GamesService,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  openSnackBar(message: string, error: boolean) {
    this._snackBar.open(message, "Close",{
      duration: 3000,
      panelClass: error ? ["error-style"] : ["success-style"]
    });
  }

  addGame() {
    const dialogRef = this.dialog.open(GameAddComponent, {
      width: '80%',
    });

    const sub = dialogRef.componentInstance.onSaveEmitter.subscribe((response: {"message": string, "error": boolean}) => {
      dialogRef.close();
      this.openSnackBar(response.message, response.error)
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.gameService.getGames();
    this.userId = this.authService.getUserId();
    this.gamesSub = this.gameService
      .getGameUpdateListener()
      .subscribe((gameData: { games: Game[] }) => {
        this.isLoading = false;
        this.games = gameData.games;
      });
    this.userIsauthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userId = this.authService.getUserId();
        this.userIsauthenticated = isAuthenticated;
      });
  }

  ngOnDestroy() {
    this.gamesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(gameId: string) {
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
}
