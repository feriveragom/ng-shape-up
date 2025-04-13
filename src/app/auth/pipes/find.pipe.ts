import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'find',
  standalone: true
})
export class FindPipe implements PipeTransform {
  transform<T extends { id: string }>(items: T[], id: string | null): T | undefined {
    if (!items || !id) return undefined;
    return items.find(item => item.id === id);
  }
} 