import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserProfilesService } from '../../services/user.service';
import { UserAuthService } from '../../../iam/services/authuser.service';

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

  updatePassword() {
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

    if (!this.data.userId) return;

    this.profileService.getById(this.data.userId).subscribe(profile => {
      const payload = {
        username: profile.email,
        password: this.newPassword
      };

      this.authService.changePassword(payload).subscribe({
        next: () => {
          alert('Contraseña actualizada correctamente.');
          this.dialogRef.close();
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar la contraseña.');
        }
      });
    });
  }
}
