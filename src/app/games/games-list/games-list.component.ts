import { SnackbarService } from './../../snackbar.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from './../../confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';
import { AuthService } from './../../auth/auth.service';
import { GamesService } from './../games.service';
import { GameAddComponent } from '../game-add/game-add.component';
import { Game } from '../../shared/interfaces/game.interface';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
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
  maxNoteLength = 50;
  initNotesDone = false;
  private authStatusSub!: Subscription;
  private gamesSub!: Subscription;
  private gamesRefSub: Subscription;

  @ViewChildren('gamesRef') gamesRef: QueryList<ElementRef>;

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
    this.gamesRefSub.unsubscribe();
  }

  ngAfterViewInit() {
    this.gamesRefSub = this.gamesRef.changes.subscribe((change) => {
      this.initNote();
    });
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

  trackById(index: number, game: Game): string {
    return game.id;
  }

  initNote() {
    if (this.initNotesDone) return;
    this.gamesRef.forEach((game, i) => {
      this.toggleNote(i);
    });
    this.initNotesDone = true;
  }

  toggleNote(i) {
    const noteElement =
      this.gamesRef.get(i).nativeElement.children[0].children[4];
    if (noteElement) {
      const textAndMore = noteElement.children[1];
      const noteText = textAndMore.children[0];
      const showMore = textAndMore.children[1];

      const text = noteText.innerHTML;
      if (
        noteElement.getAttribute('truncated') === '0' &&
        text.length > this.maxNoteLength
      ) {
        const newText = text.slice(0, this.maxNoteLength) + '...';
        noteText.innerHTML = newText;
        showMore.classList.remove('hidden');
        noteElement.setAttribute('truncated', '1');
      } else {
        noteText.innerHTML = this.games[i].note;
        noteElement.setAttribute('truncated', '0');
        showMore.classList.add('hidden');
      }
    }
  }
}
