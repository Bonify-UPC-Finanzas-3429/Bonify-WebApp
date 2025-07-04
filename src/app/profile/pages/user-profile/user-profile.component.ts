import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile.component',
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  imports: [UserCardComponent, CommonModule]
})
export class UserProfileComponent implements OnDestroy {
  userId!: number;
  private sub: Subscription;

  constructor(private route: ActivatedRoute) {
    this.sub = this.route.params.subscribe(params => {
      this.userId = +params['id'];
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
