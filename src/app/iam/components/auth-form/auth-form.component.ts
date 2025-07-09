import { Component, Input, OnInit, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { UserAuthService } from '../../services/authuser.service';
import {UserProfilesService} from '../../../profile/services/user.service';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [NgIf],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roleService = inject(RoleService);
  private authService = inject(UserAuthService);

  roleFromUrl: string = 'USER';
  @Input() mode: 'login' | 'register' | 'reset' = 'login';
  errorMessage: string = '';
  private userProfilesService = inject(UserProfilesService);


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['role']) this.roleFromUrl = params['role'];
    });

    this.autoRegisterAdmin();
  }

  async autoRegisterAdmin() {
    try {
      await firstValueFrom(this.userProfilesService.getByEmail('admin@gmail.com'));
      // Si no lanza error, ya existe
      return;
    } catch (error: any) {
      // Solo continuamos si es un error 404 (usuario no encontrado)
      if (error?.status !== 404 && error?.status !== 403) {
        console.error('Error al verificar si admin existe:', error);
        return;
      }
    }

    const adminUser = {
      email: 'admin@gmail.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'Bonify',
      dni: '12345678',
      phone: '999999999',
      role: 'ADMIN'
    };

    try {
      await this.authService.signUp(adminUser);
      console.log('Usuario admin creado automáticamente');
    } catch (error) {
      console.error('Error al registrar admin:', error);
    }
  }



  async onSubmit(event: Event) {
    event.preventDefault();
    this.errorMessage = '';

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    if (this.mode === 'register') {
      const password = formData.get('password') as string;
      const repeatPassword = formData.get('repeatPassword') as string;

      if (password !== repeatPassword) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        return;
      }
      try {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const repeatPassword = formData.get('repeatPassword') as string;

        if (password !== repeatPassword) {
          this.errorMessage = 'Las contraseñas no coinciden.';
          return;
        }

        try {
          const existingUser = await firstValueFrom(this.userProfilesService.getByEmail(decodeURIComponent(email)));
          if (existingUser) {
            this.errorMessage = 'Este correo ya está registrado.';
            return;
          }
        } catch (err: any) {
          if (err?.status !== 404 && err?.status !== 403) {
            console.error('Error al verificar correo:', err);
            this.errorMessage = 'Error al verificar el correo.';
            return;
          }
        }


        const user = {
          email,
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          phoneNumber: formData.get('phone'),
          password,
          role: this.roleFromUrl
        };

        await this.authService.signUp(user);

        const loginResponse = await this.authService.signInUser(email, password);

        if (loginResponse.status === 200 && loginResponse.data) {
          await this.storeSessionData({token: loginResponse.data}, email);
          await this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Inicio de Sesión fallido después del registro.';
        }

      } catch (err: any) {
        console.error('Error al registrar:', err);
        this.errorMessage = err?.response?.data?.message || 'Error durante el registro.';
      }
    }
    if (this.mode === 'login') {
      try {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        console.log('Datos enviados al backend (login):', {email, password});

        const response = await this.authService.signInUser(
          email as string,
          password as string
        );

        if (response.status === 200) {
          await this.storeSessionData({token: response.data}, email);
          await this.router.navigate(['/home']);

        } else {
          this.errorMessage = 'Inicio de Sesion Fallido. Por favor revise sus datos e intente nuevamente.';
        }
      } catch (err: any) {
        console.error('Error al iniciar sesión:', err);
        this.errorMessage = err?.response?.data?.message || 'Error during login.';
      }
    }
    if (this.mode === 'reset') {
      const email = formData.get('email') as string;
      const newPassword = formData.get('password') as string;
      const repeatPassword = formData.get('repeatPassword') as string;

      if (newPassword !== repeatPassword) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        return;
      }

      const errors: string[] = [];

      if (newPassword.length < 8) {
        errors.push('Debe tener al menos 8 caracteres.');
      }
      if (!/[A-Z]/.test(newPassword)) {
        errors.push('Debe contener al menos una letra mayúscula.');
      }
      if (!/[a-z]/.test(newPassword)) {
        errors.push('Debe contener al menos una letra minúscula.');
      }
      if (!/\d/.test(newPassword)) {
        errors.push('Debe contener al menos un número.');
      }
      if (!/[\W_]/.test(newPassword)) {
        errors.push('Debe contener al menos un símbolo especial.');
      }

      if (errors.length > 0) {
        this.errorMessage = 'La nueva contraseña no cumple con:\n- ' + errors.join('\n- ');
        return;
      }

      try {
        // Verificamos si la contraseña ingresada es la actual
        const loginResponse = await this.authService.signInUser(email, newPassword);

        if (loginResponse.status === 200) {
          this.errorMessage = 'La nueva contraseña no puede ser igual a la anterior.';
          return;
        }

        // Continuar con el cambio de contraseña
        const changeResponse = await this.authService.changePassword({
          username: email,
          password: newPassword
        });

        if (changeResponse.status === 200) {
          alert('Contraseña restablecida exitosamente.');
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = changeResponse.data?.message || 'Error al restablecer la contraseña.';
        }
      } catch (err: any) {
        console.error('Error al restablecer:', err);
        this.errorMessage = err?.response?.data?.message || 'Error inesperado.';
      }
    }
  }

  private async storeSessionData(data: any,email: string) {
    localStorage.setItem('authToken', data.token);
    try {
      const existingUser = await firstValueFrom(this.userProfilesService.getByEmail(email));

      localStorage.setItem('userEmail', existingUser.email);
      localStorage.setItem('userId', existingUser.id.toString());
      localStorage.setItem('userRole', existingUser.role);

      const role = existingUser.role === 'ADMIN' ? 'admin' : 'user';
      this.roleService.setRole(role);

      console.log('Usuario cargado por email y guardado:', existingUser);

    } catch (err) {
      console.error('Error al obtener usuario por email:', err);
      this.errorMessage = 'No se pudo obtener los datos del usuario.';
    }
  }
}
