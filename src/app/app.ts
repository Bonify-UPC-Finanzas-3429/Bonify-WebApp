import {Component, inject} from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from './public/components/toolbar/toolbar.component';
import { filter } from 'rxjs/operators';
import {NgIf} from '@angular/common';
import {firstValueFrom} from 'rxjs';
import {UserProfilesService} from './profile/services/user.service';
import {UserAuthService} from './iam/services/authuser.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, ToolbarComponent, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Bonify';
  isWelcomePage = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.isWelcomePage = ['/welcome', '/login', '/register', '/reset']
          .some(path => url.startsWith(path));
      });
    this.autoCreateAdmin();
  }
  private async autoCreateAdmin() {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'Admin123!';

    try {
      const existingUser = await firstValueFrom(
        inject(UserProfilesService).getByEmail(adminEmail)
      );
      console.log('Admin ya existe');
    } catch (err: any) {
      if (err?.status === 404) {
        await inject(UserAuthService).signUp({
          email: adminEmail,
          password: adminPassword,
          firstName: 'Admin',
          lastName: 'Bonify',
          phoneNumber: '000000000',
          role: 'ADMIN'
        });
        console.log('Administrador creado automáticamente.');
      }
    }
  }

}
