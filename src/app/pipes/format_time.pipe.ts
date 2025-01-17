import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
})
export class FormatTimePipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return '';

    const [hours, minutes] = value.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convierte 0 a 12

    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
}
