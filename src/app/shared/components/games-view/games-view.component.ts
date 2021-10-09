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
import { Subscription } from 'rxjs';
import { Game } from '../../interfaces/game.interface';

@Component({
  selector: 'app-games-view',
  templateUrl: './games-view.component.html',
  styleUrls: ['./games-view.component.scss'],
})
export class GamesViewComponent implements OnInit, OnDestroy {
  maxNoteLength = 50;
  initNotesDone = false;
  private gamesRefSub: Subscription;

  @Input()
  games: Game[] = [];

  @Input()
  showMenu: boolean = false;

  @Output()
  deleteEvent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChildren('gamesRef') gamesRef: QueryList<ElementRef>;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.gamesRefSub = this.gamesRef.changes.subscribe((change) => {
      this.initNote();
    });
  }

  ngOnDestroy(): void {
    this.gamesRefSub.unsubscribe();
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

  onDelete(gameId: string) {
    if (this.showMenu) {
      this.deleteEvent.emit(gameId);
    }
  }

  trackById(index: number, game: Game): string {
    return game.id;
  }

  getStyles() {
    const nrColums = this.games.length < 5 ? this.games.length : 5;
    return {
      'grid-template-columns': `repeat(${nrColums}, 1fr)`,
    };
  }
}
