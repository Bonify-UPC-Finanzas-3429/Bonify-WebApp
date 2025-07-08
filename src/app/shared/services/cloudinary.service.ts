// src/app/shared/services/cloudinary.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private cloudName = 'dynfr1idx';
  private uploadPreset = 'peaceapppresset';
  private url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  async uploadImage(file: File): Promise<{ secure_url: string; public_id: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const response = await axios.post(this.url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    console.log('Cloudinary response:', response.data);
    return {
      secure_url: response.data.secure_url,
      public_id: response.data.public_id,
    };
  }
}
