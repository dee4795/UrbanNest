import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BHKType, ListingPurpose, PropertyType } from '../../models/property.model';
import { AuthService } from '../../services/auth.service';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-list-property',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-property.component.html',
  styleUrl: './list-property.component.css'
})
export class ListPropertyComponent {
  model: {
    purpose: ListingPurpose;
    propertyType: PropertyType;
    title: string;
    area: string;
    bhk: BHKType;
    price: number | null;
    address: string;
    parking: string;
    carpetAreaSqft: number | null;
    builtUpAreaSqft: number | null;
    propertyAge: number | null;
    builderName: string;
    contactName: string;
    contactPhone: string;
    amenitiesText: string;
  } = {
    purpose: 'rent',
    propertyType: 'apartment',
    title: '',
    area: '',
    bhk: 1,
    price: null,
    address: '',
    parking: '',
    carpetAreaSqft: null,
    builtUpAreaSqft: null,
    propertyAge: null,
    builderName: '',
    contactName: '',
    contactPhone: '',
    amenitiesText: ''
  };

  imageDataUrls: string[] = [];
  statusMessage = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private propertyService: PropertyService,
    private router: Router
  ) {}

  async onImageChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    this.imageDataUrls = await Promise.all(files.map((file) => this.toDataUrl(file)));
  }

  submit(form: NgForm): void {
    this.statusMessage = '';
    this.errorMessage = '';
    if (!form.valid || this.model.price === null) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    const ownerEmail = this.authService.currentUserEmail;
    if (!ownerEmail) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.isSubmitting = true;
    this.propertyService
      .add({
        ownerEmail,
        purpose: this.model.purpose,
        propertyType: this.model.propertyType,
        title: this.model.title,
        area: this.model.area,
        bhk: this.model.bhk,
        price: this.model.price,
        address: this.model.address,
        parking: this.model.parking || undefined,
        carpetAreaSqft: this.model.carpetAreaSqft ?? undefined,
        builtUpAreaSqft: this.model.builtUpAreaSqft ?? undefined,
        propertyAge: this.model.propertyAge ?? undefined,
        builderName: this.model.builderName || undefined,
        amenities: this.model.amenitiesText
          ? this.model.amenitiesText
              .split(',')
              .map((text) => text.trim())
              .filter(Boolean)
          : undefined,
        contactName: this.model.contactName,
        contactPhone: this.model.contactPhone,
        imageDataUrls: this.imageDataUrls
      })
      .subscribe({
        next: () => {
          form.resetForm({
            purpose: 'rent',
            propertyType: 'apartment',
            bhk: 1
          });
          this.imageDataUrls = [];
          this.statusMessage = 'Property listed successfully. It is now visible in search results.';
        },
        error: (err) => {
          this.errorMessage = err?.error?.message ?? 'Unable to list property.';
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }

  private toDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    });
  }
}
