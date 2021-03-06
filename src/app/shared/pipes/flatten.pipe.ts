import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'flatten' })
export class FlattenPipe implements PipeTransform {
  transform(minValue: string, maxValue: string): string {
    return minValue === maxValue ? minValue : minValue + '-' + maxValue;
  }
}
