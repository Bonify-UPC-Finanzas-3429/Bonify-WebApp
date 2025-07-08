import axios, { AxiosInstance } from 'axios';
import { environment } from '../../environments/environment';
import {Injectable} from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: environment.baseUrl
    });
  }

  async signInUser(username: string, password: string) {
    try {
      const response = await this.http.post('/authentication/sign-in', {
        username,
        password
      });

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }

      return response;
    } catch (error: any) {
      console.error('Login failed', error);
      return error.response;
    }
  }

  async signUp(data: any) {
    try {
      return await this.http.post('/authentication/sign-up', data);
    } catch (error: any) {
      console.error('Sign-up failed', error);
      return error.response;
    }
  }

  async changePassword(data: any) {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        Authorization: `Bearer ${token}`
      };

      return await this.http.put('/authentication/change-password', data, { headers });
    } catch (error: any) {
      console.error('Password change failed', error);
      return error.response;
    }
  }

}
