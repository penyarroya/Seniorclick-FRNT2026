import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }

  transform(value: string, limit: number = 45, ellipsis: boolean = true): string {
    if (!value) return '';
    return value.length > limit
      ? value.substring(0, limit) + (ellipsis ? '...' : '')
      : value;
  }

}
