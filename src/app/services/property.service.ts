import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PropertyFilters, PropertyListing } from '../models/property.model';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<PropertyListing[]> {
    return this.http
      .get<any>('/api/listings')
      .pipe(
        map((response) => {
          // Handle both array format and paginated format
          const items = Array.isArray(response) ? response : response.data || response;
          return [...items].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        })
      );
  }

  search(filters: PropertyFilters): Observable<PropertyListing[]> {
    return this.getAll().pipe(
      map((all) => {
        console.log('🔎 Searching in', all.length, 'listings with filters:', filters);
        const filtered = all.filter((property) => {
          const byPurpose = filters.purpose === 'all' || property.purpose === filters.purpose;
          const propertyType = property.propertyType ?? 'apartment';
          const byType = filters.propertyType === 'all' || propertyType === filters.propertyType;
          
          // Area filter: check if search term is in area field or title (for USA/India searches)
          let byArea = true;
          if (filters.area) {
            const searchTerm = filters.area.toLowerCase().trim();
            // Check area name or check in title (for special keywords: USA or India)
            byArea = 
              property.area.toLowerCase().includes(searchTerm) ||
              (searchTerm.includes('usa') && property.title.includes('USA')) ||
              (searchTerm.includes('india') && !property.title.includes('USA')) ||
              property.title.toLowerCase().includes(searchTerm);
          }
          
          // BHK can be 'all' or a number
          const byBhk = filters.bhk === 'all' || property.bhk === filters.bhk;
          const byMin = filters.minBudget === undefined || property.price >= filters.minBudget;
          const byMax = filters.maxBudget === undefined || property.price <= filters.maxBudget;

          return byPurpose && byType && byArea && byBhk && byMin && byMax;
        });
        console.log('📊 Filter results:', filtered.length, 'items');
        return filtered;
      })
    );
  }

  add(listing: Omit<PropertyListing, 'id' | 'createdAt'>): Observable<PropertyListing> {
    return this.http.post<PropertyListing>('/api/listings', listing);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/listings/${id}`);
  }
}
