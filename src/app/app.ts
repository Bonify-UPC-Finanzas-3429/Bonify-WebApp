import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {ToolbarComponent} from './public/components/toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, ToolbarComponent,],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Bonify';
}
