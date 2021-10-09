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

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
})
export class GamesListComponent implements OnInit, OnDestroy {
  games: Game[] = [];
  isLoading = false;
  userId: string = '';
  userIsauthenticated = false;
  private authStatusSub!: Subscription;
  private gamesSub!: Subscription;

  constructor(
    public dialog: MatDialog,
    private gameService: GamesService,
    private authService: AuthService,
    private snackBarService: SnackbarService
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
      });
    this.userIsauthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userId = this.authService.getUserId();
        this.userIsauthenticated = isAuthenticated;
      });
  }

  openSnackBar(message: string, error: boolean) {
    this.snackBarService.open(message, error);
  }

  addGame() {
    const dialogRef = this.dialog.open(GameAddComponent, {
      width: '80%',
    });

    const sub = dialogRef.componentInstance.onSaveEmitter.subscribe(
      (response: { message: string; error: boolean; cancel: boolean }) => {
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
}
