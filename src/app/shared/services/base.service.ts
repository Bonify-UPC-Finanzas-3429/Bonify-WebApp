import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T> {
  basePath: string = environment.baseUrl;
  resourceEndpoint: string = '/resources';

  constructor(public http: HttpClient) {}

  protected getHttpOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return { headers };
  }

  private resourcePath() {
    return `${this.basePath}${this.resourceEndpoint}`;
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`An error occurred: ${error.error.message}`);
    } else {
      console.log(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => new Error('Something happened with request, please try again later'));
  }

  create(item: any): Observable<T> {
    return this.http.post<T>(this.resourcePath(), JSON.stringify(item), this.getHttpOptions())
      .pipe(retry(2), catchError(this.handleError));
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.resourcePath()}/${id}`, this.getHttpOptions())
      .pipe(retry(2), catchError(this.handleError));
  }

  update(id: any, item: any): Observable<T> {
    return this.http.put<T>(`${this.resourcePath()}/${id}`, JSON.stringify(item), this.getHttpOptions())
      .pipe(retry(2), catchError(this.handleError));
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.resourcePath(), this.getHttpOptions())
      .pipe(retry(2), catchError(this.handleError));
  }

  getById(id: any): Observable<T> {
    return this.http.get<T>(`${this.resourcePath()}/${id}`, this.getHttpOptions())
      .pipe(retry(2), catchError(this.handleError));
  }
}
