import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentStatus'
})
export class PaymentStatusPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'Pagado' : 'No Pagado';
  }
}