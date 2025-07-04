import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {UserProfile} from '../models/user.entity';
import {BaseService} from '../../shared/services/base.service';


@Injectable({
  providedIn: 'root'
})
export class UserProfilesService extends BaseService<UserProfile> {
  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/users';
  }
}
