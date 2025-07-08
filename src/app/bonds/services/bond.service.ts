import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BaseService} from '../../shared/services/base.service';
import {Bond} from '../models/bond.entity';
import {catchError, map, Observable, retry} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BondService extends BaseService<Bond> {
  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/bonds';
  }
  getByUserId(userId: number): Observable<Bond[]> {
    return this.http.get<Bond[]>(`${this.basePath}${this.resourceEndpoint}/user/${userId}`, this.getHttpOptions())
      .pipe(retry(2), catchError(this.handleError));
  }

  getByBondId(bondId: string): Observable<Bond | null> {
    return this.http.get<Bond>(`${this.basePath}${this.resourceEndpoint}/${bondId}`, this.getHttpOptions()).pipe(
      retry(2),
      map(bond => bond ?? null),
      catchError(this.handleError)
    );
  }

}
