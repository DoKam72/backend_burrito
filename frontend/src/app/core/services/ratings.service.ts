import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AffinityItem, BookRating } from '../models/models';

@Injectable({ providedIn: 'root' })
export class RatingsService {
  private readonly url = `${environment.apiUrl}/ratings`;
  constructor(private readonly http: HttpClient) {}
  getBookRating(bookId: number): Observable<BookRating> { return this.http.get<BookRating>(`${this.url}/book/${bookId}`); }
  rate(bookId: number, puntuacion: number): Observable<unknown> { return this.http.put(`${this.url}/${bookId}`, { puntuacion }); }
  affinity(): Observable<AffinityItem[]> { return this.http.get<AffinityItem[]>(`${this.url}/me/affinity`); }
}
