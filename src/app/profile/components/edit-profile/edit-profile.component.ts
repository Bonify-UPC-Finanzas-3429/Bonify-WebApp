import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import { UserProfilesService } from '../../services/user.service';
import { UserProfile } from '../../models/user.entity';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditPasswordComponent } from '../edit-password/edit-password.component';
import { MatDialog } from '@angular/material/dialog';
import { CloudinaryService } from '../../../shared/services/cloudinary.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogTitle]
})
export class EditProfileComponent implements OnInit {
  profile: UserProfile = {
    id: 0,
    userId: 0,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    profileImage: '',
    role: ''
  };

  constructor(
    private userProfilesService: UserProfilesService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private cloudinaryService: CloudinaryService
  ) {}

  ngOnInit(): void {
    if (!this.data.userId) return;

    this.userProfilesService.getById(this.data.userId).subscribe(data => {
      this.profile = data;
    });
  }

  openPasswordModal() {
    this.dialog.open(EditPasswordComponent, {
      width: '400px',
      data: { userId: this.data.userId }
    });
  }

  saveProfile() {
    if (!this.profile.firstName || !this.profile.lastName || !this.profile.email || !this.profile.phoneNumber) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{9}$/;

    const errors: string[] = [];

    if (!emailRegex.test(this.profile.email)) {
      errors.push('El correo electrónico no tiene un formato válido.');
    }

    if (!phoneRegex.test(this.profile.phoneNumber)) {
      errors.push('El número telefónico debe tener exactamente 9 dígitos.');
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    const userId = this.data.userId;
    if (!userId) return;

    this.userProfilesService.update(userId, this.profile).subscribe({
      next: () => {
        alert('Perfil actualizado correctamente.');
        this.dialogRef.close(true);
      },
      error: () => alert('Error al guardar los cambios.')
    });
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      try {
        const result = await this.cloudinaryService.uploadImage(file);
        console.log('Cloudinary result:', result);
        this.profile.profileImage = result.secure_url;

        setTimeout(() => {}, 0);

        alert('Imagen subida correctamente.');
      } catch (err) {
        console.error(err);
        alert('Error al subir la imagen de perfil.');
      }
    }
  }
}
