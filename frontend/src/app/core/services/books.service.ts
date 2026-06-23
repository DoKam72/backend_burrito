import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Book } from '../models/models';
@Injectable({ providedIn: 'root' })
export class BooksService {
  private readonly url = `${environment.apiUrl}/books`; constructor(private readonly http: HttpClient) {}
  list(): Observable<Book[]> { return this.http.get<Book[]>(this.url); } get(id: number): Observable<Book> { return this.http.get<Book>(`${this.url}/${id}`); }
  create(data: FormData): Observable<Book> { return this.http.post<Book>(this.url, data); } update(id: number, data: FormData): Observable<Book> { return this.http.patch<Book>(`${this.url}/${id}`, data); } remove(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  imageUrl(path: string | null): string | null { if (!path) return null; return path.startsWith('http') ? path : `${environment.apiUrl}${path}`; }
}
