import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PropertyFilters, PropertyListing } from '../models/property.model';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<PropertyListing[]> {
    return this.http
      .get<PropertyListing[]>('/api/listings')
      .pipe(map((items) => [...items].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))));
  }

  search(filters: PropertyFilters): Observable<PropertyListing[]> {
    return this.getAll().pipe(
      map((all) =>
        all.filter((property) => {
          const byPurpose = filters.purpose === 'all' || property.purpose === filters.purpose;
          const propertyType = property.propertyType ?? 'apartment';
          const byType = filters.propertyType === 'all' || propertyType === filters.propertyType;
          const byArea = !filters.area || property.area.toLowerCase().includes(filters.area.toLowerCase().trim());
          const byBhk = filters.bhk === 'all' || property.bhk === filters.bhk;
          const byMin = filters.minBudget === undefined || property.price >= filters.minBudget;
          const byMax = filters.maxBudget === undefined || property.price <= filters.maxBudget;

          return byPurpose && byType && byArea && byBhk && byMin && byMax;
        })
      )
    );
  }

  add(listing: Omit<PropertyListing, 'id' | 'createdAt'>): Observable<PropertyListing> {
    return this.http.post<PropertyListing>('/api/listings', listing);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/listings/${id}`);
  }
}
