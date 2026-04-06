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
