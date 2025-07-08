import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './welcome-card.component.html',
  styleUrl: './welcome-card.component.css'
})
export class WelcomeCardComponent {
  constructor(private router: Router) {}

  goToLogin(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
