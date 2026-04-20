import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'imageUrl'
})
export class ImageUrlPipe implements PipeTransform {
  transform(relativePath: string | null | undefined): string {
    if (!relativePath) return 'assets/placeholder.jpg';
    if (relativePath.startsWith('http')) return relativePath; // already absolute
    return `${environment.imageBaseUrl}${relativePath}`; // 👈 use imageBaseUrl
  }
}