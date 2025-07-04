import { Component, OnInit } from '@angular/core';
import {UserProfilesService} from '../../../profile/services/user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentRole: 'user' | 'admin' = 'user';

  constructor(private userService: UserProfilesService) {}

  ngOnInit(): void {
    const savedId = localStorage.getItem('userId') || '1';
    this.userService.getById(savedId).subscribe(user => {
      this.currentRole = user.role === 'admin' ? 'admin' : 'user';
    });
  }

  toggleRole(): void {
    const currentId = localStorage.getItem('userId') || '1';
    const newId = currentId === '1' ? '2' : '1';

    localStorage.setItem('userId', newId);

    this.userService.getById(newId).subscribe(user => {
      localStorage.setItem('userRole', user.role);
      window.location.reload();
    });
  }
}
