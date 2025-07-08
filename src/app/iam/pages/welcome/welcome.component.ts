import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {WelcomeCardComponent} from '../../components/welcome-card/welcome-card.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    WelcomeCardComponent
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

}
