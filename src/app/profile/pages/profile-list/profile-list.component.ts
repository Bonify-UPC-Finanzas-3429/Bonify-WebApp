import { Component } from '@angular/core';
import {ProfileTableComponent} from '../../components/profile-table/profile-table.component';

@Component({
  selector: 'app-profile-list',
  imports: [
    ProfileTableComponent
  ],
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.css'
})
export class ProfileListComponent {

}
