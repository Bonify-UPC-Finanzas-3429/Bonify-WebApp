import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AuthFormComponent} from '../../components/auth-form/auth-form.component';

@Component({
  selector: 'app-auth-page',
  imports: [AuthFormComponent],
  standalone: true,
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css'
})
export class AuthPageComponent {
  mode: 'login' | 'register' | 'reset' = 'login';
  constructor(private route: ActivatedRoute) {
    this.route.url.subscribe(url => {
      const path = url[0]?.path;
      if (path === 'register' || path === 'reset') {
        this.mode = path;
      } else {
        this.mode = 'login';
      }
    });
  }
}
