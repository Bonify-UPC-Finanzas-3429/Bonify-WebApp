import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from '../models/user.entity';
import { BaseService } from '../../shared/services/base.service';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfilesService extends BaseService<UserProfile> {
  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = `/users`;
  }

  getByEmail(email: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.baseUrl}${this.resourceEndpoint}/email?email=${encodeURIComponent(email)}`);
  }
}
