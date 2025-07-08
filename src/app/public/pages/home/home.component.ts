import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userRole: string | null = null;

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    console.log('Rol:', this.userRole);
  }
}
