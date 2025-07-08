import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { UserProfile } from '../../models/user.entity';
import { NgIf } from '@angular/common';
import { UserProfilesService } from '../../services/user.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  standalone: true,
  styleUrls: ['./user-card.component.css'],
  imports: [NgIf]
})
export class UserCardComponent implements OnInit, OnChanges {
  @Input() userId!: number;
  profile?: UserProfile;

  constructor(
    private userProfilesService: UserProfilesService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && !changes['userId'].firstChange) {
      this.loadUser();
    }
  }

  private loadUser(): void {
    if (!this.userId) return;
    this.userProfilesService.getById(this.userId).subscribe(data => {
      this.profile = data;
    });
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      data: { userId: this.userId },
      width: 'auto',
      maxWidth: '90vw',
      height: 'auto',
      panelClass: 'custom-dialog-container',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((wasUpdated) => {
      if (wasUpdated) {
        this.loadUser();
      }
    });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/welcome']);
  }
}
