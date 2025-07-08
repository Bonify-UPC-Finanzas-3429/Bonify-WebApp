import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserProfilesService } from '../../services/user.service';
import {UserAuthService} from '../../../iam/services/authuser.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditPasswordComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private dialogRef: MatDialogRef<EditPasswordComponent>,
    private authService: UserAuthService,
    private profileService: UserProfilesService,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }
  ) {}

  async updatePassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    const errors: string[] = [];

    if (this.newPassword.length < 8) {
      errors.push('Debe tener al menos 8 caracteres.');
    }
    if (!/[A-Z]/.test(this.newPassword)) {
      errors.push('Debe contener al menos una letra mayúscula.');
    }
    if (!/[a-z]/.test(this.newPassword)) {
      errors.push('Debe contener al menos una letra minúscula.');
    }
    if (!/\d/.test(this.newPassword)) {
      errors.push('Debe contener al menos un número.');
    }
    if (!/[\W_]/.test(this.newPassword)) {
      errors.push('Debe contener al menos un símbolo especial.');
    }

    if (errors.length > 0) {
      alert('La nueva contraseña no cumple con los siguientes requisitos:\n- ' + errors.join('\n- '));
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    if (this.newPassword === this.currentPassword) {
      alert('La nueva contraseña no puede ser igual a la actual.');
      return;
    }

    const email = localStorage.getItem('userEmail');
    if (!email) {
      alert('No se encontró el correo del usuario.');
      return;
    }

    const loginResponse = await this.authService.signInUser(email, this.currentPassword);
    if (loginResponse.status !== 200 ) {
      alert('La contraseña actual es incorrecta.');
      return;
    }

    const changeResponse = await this.authService.changePassword({
      username: email,
      password: this.newPassword
    });

    if (changeResponse.status === 200) {
      alert('Contraseña actualizada exitosamente.');
      this.dialogRef.close();
    } else {
      alert('Error al actualizar la contraseña.');
    }
  }

}
