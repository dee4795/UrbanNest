import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PropertyFilters, PropertyListing } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-home-search',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './home-search.component.html',
  styleUrl: './home-search.component.css'
})
export class HomeSearchComponent {
  readonly pageSize = 10;
  filters: PropertyFilters = {
    purpose: 'all',
    propertyType: 'all',
    minBudget: undefined,
    maxBudget: undefined,
    area: '',
    bhk: 'all'
  };
  properties: PropertyListing[] = [];
  currentPage = 1;
  isLoading = false;
  selectedListing: PropertyListing | null = null;

  readonly defaultCardImages = [
    'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1617098474202-0d0d7f60f97c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80'
  ];

  constructor(private propertyService: PropertyService) {
    this.reloadAll();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.properties.length / this.pageSize));
  }

  get pagedProperties(): PropertyListing[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.properties.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  applyFilters(): void {
    this.isLoading = true;
    this.propertyService.search(this.filters).subscribe({
      next: (items) => {
        this.properties = items;
        this.currentPage = 1;
      },
      error: () => {
        this.properties = [];
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  clearFilters(): void {
    this.filters = {
      purpose: 'all',
      propertyType: 'all',
      minBudget: undefined,
      maxBudget: undefined,
      area: '',
      bhk: 'all'
    };
    this.reloadAll();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }

  openDetails(item: PropertyListing): void {
    this.selectedListing = item;
  }

  closeDetails(): void {
    this.selectedListing = null;
  }

  getCardImage(item: PropertyListing, index: number): string {
    const photos = item.imageDataUrls ?? [];
    if (photos.length > 0) {
      return photos[index % photos.length];
    }

    const fallbackIndex = this.hashString(`${item.id}-${item.title}-${item.area}`) % this.defaultCardImages.length;
    return this.defaultCardImages[fallbackIndex];
  }

  private hashString(value: string): number {
    return Array.from(value).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 0);
  }

  private reloadAll(): void {
    this.isLoading = true;
    this.propertyService.getAll().subscribe({
      next: (items) => {
        this.properties = items;
        this.currentPage = 1;
      },
      error: () => {
        this.properties = [];
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
