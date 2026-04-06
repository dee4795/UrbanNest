import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@urbannest.com';
  const existing = await prisma.user.findUnique({
    where: { email }
  });
  const user =
    existing ??
    (await prisma.user.create({
      data: {
        name: 'Demo User',
        email,
        passwordHash: await bcrypt.hash('demo12345', 10)
      }
    }));

  await prisma.listing.deleteMany({ where: { ownerId: user.id } });

  const cities = [
    ['Mumbai', 'Andheri West'],
    ['Delhi', 'Dwarka'],
    ['Bengaluru', 'Whitefield'],
    ['Hyderabad', 'Gachibowli'],
    ['Chennai', 'Velachery'],
    ['Pune', 'Baner'],
    ['Kolkata', 'Salt Lake'],
    ['Ahmedabad', 'Prahlad Nagar'],
    ['Jaipur', 'Malviya Nagar'],
    ['Lucknow', 'Gomti Nagar'],
    ['Noida', 'Sector 62'],
    ['Gurugram', 'DLF Phase 3'],
    ['Chandigarh', 'Sector 35'],
    ['Kochi', 'Kakkanad'],
    ['Indore', 'Vijay Nagar'],
    ['Surat', 'Vesu'],
    ['Nagpur', 'Dharampeth'],
    ['Bhopal', 'Arera Colony'],
    ['Patna', 'Boring Road'],
    ['Visakhapatnam', 'MVP Colony']
  ] as const;

  const firstNames = ['Aarav', 'Ishaan', 'Riya', 'Ananya', 'Rahul', 'Sneha', 'Arjun', 'Diya', 'Kabir', 'Meera', 'Vikram', 'Priya', 'Akshay', 'Samantha', 'Rohan', 'Neha', 'Aditya', 'Pooja', 'Nikhil', 'Anjali', 'Varun', 'Shreya', 'Harsh', 'Divya', 'Rishabh', 'Kriti', 'Sanjay', 'Nisha', 'Karan', 'Sana'];
  const lastNames = ['Sharma', 'Verma', 'Nair', 'Iyer', 'Patel', 'Singh', 'Reddy', 'Mehta', 'Kapoor', 'Das', 'Gupta', 'Bhat', 'Trivedi', 'Joshi', 'Desai', 'Chopra', 'Malhotra', 'Rao', 'Yadav', 'Kumar', 'Pandey', 'Mishra', 'Saxena', 'Agarwal', 'Bansal', 'Arora', 'Grover', 'Khanna', 'Sinha', 'Tiwari'];
  const titles = [
    'Modern Family Apartment',
    'Spacious Corner Home',
    'Premium View Residence',
    'Well Ventilated Flat',
    'Ready to Move Property',
    'Gated Community Home',
    'Luxury Penthouse',
    'Newly Renovated Flat',
    'Bright & Airy Apartment',
    'Contemporary Living Space',
    'Premium Location Home',
    'Garden Facing Apartment',
    'High-Rise Residence',
    'Peaceful Community Living',
    'Modern Architecture Home'
  ];
  const amenitiesPool = [
    'Lift',
    'Power Backup',
    'Gym',
    'Swimming Pool',
    'Club House',
    'CCTV',
    'Children Play Area',
    'Security',
    'Garden',
    'EV Charging',
    'Tennis Court',
    'Basketball Court',
    'Yoga Studio',
    'Library',
    'Community Center',
    'Visitor Parking',
    'Central Heating',
    'Air Conditioning',
    'Water Purification',
    'Waste Management'
  ];
  const photos = [
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1617098474202-0d0d7f60f97c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7d7a28?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505693314967-2738d961ca0d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607689620-8446fda00d23?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600571485063-e58bdbf0b20f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154405-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502005229762-cf1202da7d12?auto=format&fit=crop&w=1200&q=80'
  ];

  const listings = Array.from({ length: 100 }, (_, i) => {
    const [city, locality] = cities[i % cities.length];
    const bhk = ((i % 4) + 1) as 1 | 2 | 3 | 4;
    const purpose = i % 2 === 0 ? 'rent' : 'buy';
    const propertyType = i % 5 === 0 ? 'row-house' : 'apartment';
    const basePrice = purpose === 'rent' ? 18000 + (i % 11) * 2200 : 4500000 + (i % 17) * 350000;
    const builder = ['Lodha', 'Godrej', 'Prestige', 'Brigade', 'Sobha', 'DLF'][i % 6];
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[(i * 7) % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const amenities = [
      amenitiesPool[i % amenitiesPool.length],
      amenitiesPool[(i + 2) % amenitiesPool.length],
      amenitiesPool[(i + 5) % amenitiesPool.length]
    ];
    
    // Ensure varied image selection
    const photoIndex1 = (i * 3) % photos.length;
    const photoIndex2 = (i * 5 + 7) % photos.length;

    return {
      ownerId: user.id,
      ownerEmail: user.email,
      purpose,
      propertyType,
      title: `${bhk}BHK ${titles[(i * 2) % titles.length]}`,
      area: `${locality}, ${city}`,
      bhk,
      price: basePrice,
      address: `${10 + (i % 120)}, ${locality.split(',')[0]} Main Road, ${city}`,
      contactName: name,
      contactPhone: `9${(810000000 + i * 137).toString().slice(-9)}`,
      imageDataUrls: [photos[photoIndex1], photos[photoIndex2]],
      parking: i % 3 === 0 ? 'Covered Parking' : i % 3 === 1 ? 'Open Parking' : 'No Parking',
      carpetAreaSqft: 550 + bhk * 180 + (i % 7) * 20,
      builtUpAreaSqft: 700 + bhk * 230 + (i % 9) * 25,
      amenities,
      propertyAge: i % 16,
      builderName: `${builder} Developers`
    };
  });

  await prisma.listing.createMany({ data: listings });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
