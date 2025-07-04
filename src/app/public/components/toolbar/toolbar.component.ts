import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  imports: [
    MatButton,
    MatToolbar
  ]
})
export class ToolbarComponent implements OnInit {
  currentRole: 'user' | 'admin' = 'user';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const savedRole = localStorage.getItem('userRole');
    this.currentRole = savedRole === 'admin' ? 'admin' : 'user';
  }

  onPlansClick(): void {
    if (this.currentRole === 'admin') {
      this.router.navigate(['/management']);
    } else {
      const userId = localStorage.getItem('userId');
      this.router.navigate(['/bonds', userId]);
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
