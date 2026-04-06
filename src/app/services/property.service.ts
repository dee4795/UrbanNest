import { Injectable } from '@angular/core';
import { PropertyFilters, PropertyListing } from '../models/property.model';

const PROPERTIES_KEY = 'homefinder_properties';
const DEMO_TARGET_COUNT = 100;

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private properties: PropertyListing[] = this.loadProperties();

  getAll(): PropertyListing[] {
    return [...this.properties].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  search(filters: PropertyFilters): PropertyListing[] {
    return this.getAll().filter((property) => {
      const byPurpose = filters.purpose === 'all' || property.purpose === filters.purpose;
      const propertyType = property.propertyType ?? 'apartment';
      const byType = filters.propertyType === 'all' || propertyType === filters.propertyType;
      const byArea = !filters.area || property.area.toLowerCase().includes(filters.area.toLowerCase().trim());
      const byBhk = filters.bhk === 'all' || property.bhk === filters.bhk;
      const byMin = filters.minBudget === undefined || property.price >= filters.minBudget;
      const byMax = filters.maxBudget === undefined || property.price <= filters.maxBudget;

      return byPurpose && byType && byArea && byBhk && byMin && byMax;
    });
  }

  add(listing: Omit<PropertyListing, 'id' | 'createdAt'>): PropertyListing {
    const newItem: PropertyListing = {
      ...listing,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };

    this.properties.push(newItem);
    this.saveProperties();
    return newItem;
  }

  private loadProperties(): PropertyListing[] {
    const raw = localStorage.getItem(PROPERTIES_KEY);
    if (!raw) {
      const seeded = this.seedListings();
      localStorage.setItem(PROPERTIES_KEY, JSON.stringify(seeded));
      return seeded;
    }

    try {
      const parsed = JSON.parse(raw) as PropertyListing[];
      if (!Array.isArray(parsed)) {
        return [];
      }

      const normalized = parsed.map((item) => ({
        ...item,
        propertyType: item.propertyType ?? 'apartment'
      }));
      const merged = this.ensureDemoListings(normalized);
      const mergedRaw = JSON.stringify(merged);
      if (mergedRaw !== raw) {
        localStorage.setItem(PROPERTIES_KEY, mergedRaw);
      }
      return merged;
    } catch {
      return [];
    }
  }

  private saveProperties(): void {
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(this.properties));
  }

  private seedListings(): PropertyListing[] {
    return this.createDemoListings();
  }

  private ensureDemoListings(existing: PropertyListing[]): PropertyListing[] {
    const userListings = existing.filter((item) => !item.id.startsWith('demo-'));
    if (userListings.length >= DEMO_TARGET_COUNT) {
      return existing;
    }

    return [...userListings, ...this.createDemoListings()];
  }

  private createDemoListings(): PropertyListing[] {
    const cityLocalities: Array<{ city: string; locality: string }> = [
      { city: 'Mumbai', locality: 'Andheri' },
      { city: 'Delhi', locality: 'Dwarka' },
      { city: 'Bengaluru', locality: 'Whitefield' },
      { city: 'Hyderabad', locality: 'Gachibowli' },
      { city: 'Chennai', locality: 'Velachery' },
      { city: 'Pune', locality: 'Kothrud' },
      { city: 'Kolkata', locality: 'Salt Lake' },
      { city: 'Ahmedabad', locality: 'Prahlad Nagar' },
      { city: 'Jaipur', locality: 'Malviya Nagar' },
      { city: 'Lucknow', locality: 'Gomti Nagar' },
      { city: 'Chandigarh', locality: 'Sector 35' },
      { city: 'Kochi', locality: 'Kakkanad' },
      { city: 'Indore', locality: 'Vijay Nagar' },
      { city: 'Surat', locality: 'Vesu' },
      { city: 'Noida', locality: 'Sector 62' }
    ];
    const titles = [
      'Modern Flat with Balcony',
      'Sunlit Family Apartment',
      'Premium High-Rise Home',
      'Cozy Apartment Near Metro',
      'Spacious House with Parking',
      'Newly Renovated Flat',
      'Calm Residential Tower Flat',
      'Bright Home in Prime Area'
    ];
    const firstNames = [
      'Aarav',
      'Ishaan',
      'Vihaan',
      'Aditya',
      'Riya',
      'Ananya',
      'Kavya',
      'Meera',
      'Nikhil',
      'Saanvi',
      'Arjun',
      'Rohan',
      'Pooja',
      'Sneha',
      'Rahul',
      'Diya'
    ];
    const lastNames = [
      'Sharma',
      'Verma',
      'Nair',
      'Iyer',
      'Gupta',
      'Patel',
      'Singh',
      'Reddy',
      'Mehta',
      'Joshi',
      'Kapoor',
      'Kulkarni',
      'Bose',
      'Choudhary',
      'Malhotra',
      'Das'
    ];
    const photos = [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1472224371017-08207f84aaae?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1464890100898-a385f744067f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1630699144867-37acec97df5a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600563438938-a9a27216b93d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80'
    ];

    return Array.from({ length: DEMO_TARGET_COUNT }, (_, index) => {
      const purpose = index % 2 === 0 ? 'rent' : 'buy';
      const location = cityLocalities[index % cityLocalities.length];
      const area = `${location.locality}, ${location.city}`;
      const title = titles[index % titles.length];
      const bhk = ((index % 4) + 1) as 1 | 2 | 3 | 4;
      const propertyType = index % 5 === 0 ? 'row-house' : 'apartment';
      const baseRent = 14000 + (index % 12) * 1500;
      const baseBuy = 4200000 + (index % 20) * 250000;
      const bhkPremium = (bhk - 1) * (purpose === 'rent' ? 3500 : 500000);
      const typePremium = propertyType === 'row-house' ? (purpose === 'rent' ? 8000 : 1200000) : 0;
      const price = (purpose === 'rent' ? baseRent : baseBuy) + bhkPremium + typePremium;
      const firstName = firstNames[index % firstNames.length];
      const lastName = lastNames[(index * 3) % lastNames.length];
      const phone = `98${(76543210 + index).toString().slice(-8)}`;
      const firstPhoto = photos[(index * 7) % photos.length];
      const secondPhoto = photos[(index * 11 + 5) % photos.length];
      const createdAt = new Date(Date.now() - index * 3600 * 1000 * 6).toISOString();

      return {
        id: `demo-${index + 1}`,
        ownerEmail: 'owner@demo.com',
        purpose,
        propertyType,
        title: propertyType === 'row-house' ? `${bhk}BHK ${title} Row House` : `${bhk}BHK ${title}`,
        area,
        bhk,
        price,
        address: `${10 + (index % 80)}, ${location.locality} Main Road, ${location.city}`,
        contactName: `${firstName} ${lastName}`,
        contactPhone: phone,
        imageDataUrls: [firstPhoto, secondPhoto],
        createdAt
      };
    });
  }
}
