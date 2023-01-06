import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { painting } from './painting';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class paintingService {

  private paintingsUrl = 'api/paintings';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET paintings from the server */
  getpaintings(): Observable<painting[]> {
    return this.http.get<painting[]>(this.paintingsUrl)
      .pipe(
        tap(_ => this.log('fetched paintings')),
        catchError(this.handleError<painting[]>('getpaintings', []))
      );
  }

  /** GET painting by id. Return `undefined` when id not found */
  getpaintingNo404<Data>(id: number): Observable<painting> {
    const url = `${this.paintingsUrl}/?id=${id}`;
    return this.http.get<painting[]>(url)
      .pipe(
        map(paintings => paintings[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} painting id=${id}`);
        }),
        catchError(this.handleError<painting>(`getpainting id=${id}`))
      );
  }

  /** GET painting by id. Will 404 if id not found */
  getpainting(id: number): Observable<painting> {
    const url = `${this.paintingsUrl}/${id}`;
    return this.http.get<painting>(url).pipe(
      tap(_ => this.log(`fetched painting id=${id}`)),
      catchError(this.handleError<painting>(`getpainting id=${id}`))
    );
  }

  /* GET paintings whose name contains search term */
  searchpaintings(term: string): Observable<painting[]> {
    if (!term.trim()) {
      // if not search term, return empty painting array.
      return of([]);
    }
    return this.http.get<painting[]>(`${this.paintingsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found paintings matching "${term}"`) :
         this.log(`no paintings matching "${term}"`)),
      catchError(this.handleError<painting[]>('searchpaintings', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new painting to the server */
  addpainting(painting: painting): Observable<painting> {
    return this.http.post<painting>(this.paintingsUrl, painting, this.httpOptions).pipe(
      tap((newpainting: painting) => this.log(`added painting w/ id=${newpainting.id}`)),
      catchError(this.handleError<painting>('addpainting'))
    );
  }

  /** DELETE: delete the painting from the server */
  deletepainting(id: number): Observable<painting> {
    const url = `${this.paintingsUrl}/${id}`;

    return this.http.delete<painting>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted painting id=${id}`)),
      catchError(this.handleError<painting>('deletepainting'))
    );
  }

  /** PUT: update the painting on the server */
  updatepainting(painting: painting): Observable<any> {
    return this.http.put(this.paintingsUrl, painting, this.httpOptions).pipe(
      tap(_ => this.log(`updated painting id=${painting.id}`)),
      catchError(this.handleError<any>('updatepainting'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a paintingService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`paintingService: ${message}`);
  }
}
