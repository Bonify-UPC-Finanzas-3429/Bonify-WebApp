import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfilesService } from '../../services/user.service';
import { UserProfile } from '../../models/user.entity';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-table',
  templateUrl: './profile-table.component.html',
  styleUrls: ['./profile-table.component.css'],
  standalone: true,
  imports: [NgForOf, FormsModule, NgIf]
})
export class ProfileTableComponent implements OnInit {
  users: UserProfile[] = [];

  constructor(private userService: UserProfilesService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: data => this.users = data,
      error: err => console.error('Error cargando usuarios', err)
    });
  }

  updateRole(user: UserProfile): void {
    this.userService.update(user.id, user).subscribe({
      next: () => console.log(`Rol actualizado para ${user.email}`),
      error: err => console.error('Error actualizando rol', err)
    });
  }

  viewProfile(id: number): void {
    this.router.navigate(['/profile', id]);
  }

  viewPlans(id: number): void {
    this.router.navigate(['/bonds', id]);
  }
}
