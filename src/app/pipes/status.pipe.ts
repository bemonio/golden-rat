import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusTranslate'
})
export class StatusPipe implements PipeTransform {
  transform(value: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'Pendiente',
      winner: 'Ganador',
      loser: 'Perdedor'
    };
    return statusMap[value] || value;
  }
}
