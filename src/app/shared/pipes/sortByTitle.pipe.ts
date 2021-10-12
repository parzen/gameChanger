import { Game } from './../interfaces/game.interface';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByTitle',
})
export class SortByTitlePipe implements PipeTransform {
  transform(values: Game[], sortit: boolean): Game[] {
    if (sortit) {
      return values.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      return values;
    }
  }
}
