import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchQuery: string): any[] {
    if (!items || !searchQuery) {
      return items;
    }
    searchQuery = searchQuery.toLowerCase();
    return items.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchQuery)
      )
    );
  }
}