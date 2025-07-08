import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  imports: [MatButton, MatToolbar]
})
export class ToolbarComponent implements OnInit {
  currentRole: 'USER' | 'ADMIN' = 'USER';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole?.toUpperCase() === 'ADMIN') {
      this.currentRole = 'ADMIN';
    } else {
      this.currentRole = 'USER';
    }
  }

  onPlansClick(): void {
    const userId = localStorage.getItem('userId');
    if (this.currentRole === 'ADMIN') {
      this.router.navigate(['/management']);
    } else if (userId) {
      this.router.navigate(['/bonds', userId]);
    } else {
      alert('ID de usuario no encontrado.');
    }
  }

  onProfileClick(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.router.navigate(['/profile', userId]);
    } else {
      alert('ID de usuario no encontrado.');
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
