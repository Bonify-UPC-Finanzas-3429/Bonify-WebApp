import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private baseUrl = `${environment.baseUrl}/authentication`;

  constructor(private http: HttpClient) {}

  signInUser(username: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/sign-in`, { username, password });
  }

  signUp(data: any) {
    return this.http.post<any>(`${this.baseUrl}/sign-up`, data);
  }

  changePassword(data: any) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put<any>(`${this.baseUrl}/change-password`, data, { headers });
  }
}
