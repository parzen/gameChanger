import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  QueryList,
  ViewChildren,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Game } from '../../interfaces/game.interface';

@Component({
  selector: 'app-games-view',
  templateUrl: './games-view.component.html',
  styleUrls: ['./games-view.component.scss'],
})
export class GamesViewComponent implements OnInit, OnDestroy {
  maxNoteLength = 50;
  private subs = new Subscription();

  @Input()
  games: Game[] = [];

  @Input()
  sortit: boolean = false;

  @Input()
  showMenu: boolean = false;

  @Input()
  canBeActivated: boolean = false;

  @Input() triggerRemoveActiveClassObservable: Observable<void>;

  @Output()
  deleteEvent: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  activeClassRemoved: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  returnActiveGame: EventEmitter<Game> = new EventEmitter<Game>();

  @ViewChildren('gamesRef') gamesRef: QueryList<ElementRef>;

  constructor() {}

  ngOnInit(): void {
    if (this.triggerRemoveActiveClassObservable) {
      this.subs.add(
        this.triggerRemoveActiveClassObservable.subscribe(() => {
          this.removeActiveClass();
        })
      );
    }
  }

  ngAfterViewInit() {
    this.initNote();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initNote() {
    this.gamesRef.forEach((game, i) => {
      this.toggleNote(i);
    });
  }

  toggleNote(i) {
    let index = 0;
    if (this.showMenu) {
      index = 1;
    }
    const noteElement =
      this.gamesRef.get(i).nativeElement.children[0].children[0].children[index]
        .children[3];
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

  onDelete(gameId: string) {
    if (this.showMenu) {
      this.deleteEvent.emit(gameId);
    }
  }

  trackById(index: number, game: Game): string {
    return game.id;
  }

  setNrColumns() {
    const nrColums = this.games.length < 5 ? this.games.length : 5;
    return {
      'grid-template-columns': `repeat(${nrColums}, 1fr)`,
    };
  }

  setActive(game, i) {
    if (this.canBeActivated) {
      this.removeActiveClass();
      this.gamesRef
        .get(i)
        .nativeElement.children[0].children[0].classList.add('active');

      this.returnActiveGame.emit(game);
    }
  }

  removeActiveClass() {
    if (this.canBeActivated) {
      this.gamesRef.forEach((game) => {
        game.nativeElement.children[0].children[0].classList.remove('active');
      });

      this.activeClassRemoved.emit();
    }
  }
}
