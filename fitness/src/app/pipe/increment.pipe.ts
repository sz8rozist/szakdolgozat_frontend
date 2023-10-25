import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'increment'
})
export class IncrementPipe implements PipeTransform {

  transform(value: number): number {
    return value + 1;
  }

}
