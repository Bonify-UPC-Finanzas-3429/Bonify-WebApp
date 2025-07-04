import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../shared/services/base.service';
import { Installment } from '../models/installment.entity';
import { catchError, Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstallmentService extends BaseService<Installment> {
  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/installments';
  }

  getByBondId(bondId: number): Observable<Installment[]> {
    return this.http.get<Installment[]>(`${this.basePath}${this.resourceEndpoint}?bondId=${bondId}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteByBondId(bondId: number): Observable<any> {
    return this.http.delete<Installment[]>(`${this.basePath}${this.resourceEndpoint}?bondId=${bondId}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
