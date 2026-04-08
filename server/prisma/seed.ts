import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';

const prisma = new PrismaClient();

// Marathi names for Marathi regions (English transliteration)
const marathiNames = [
  'Raj Kulkarni', 'Priya Sharma', 'Amit Dixit', 'Neeta Joshi', 'Vijay Kamat',
  'Arti Khosla', 'Sanjay Chavan', 'Pooja Gokhale', 'Rahul Patil', 'Diksha Jadhav',
  'Nikhil Deshmukh', 'Anjali Pawar', 'Mohan Konde', 'Sumita Bhogle', 'Rohit King',
  'Pratibha Kulkarni', 'Aditya Shinde', 'Seema Gholap', 'Vikas Naik', 'Ritu Joshi',
  'Santosh Savant', 'Lakshmi Kamble', 'Rajesh More', 'Varsha Savant', 'Kiran Meshram',
  'Arjun Kadam', 'Sudhir Bhagwat', 'Meera Vadvaliker', 'Pramod Nayak', 'Rudraksha Parade',
];

// Hindi/North Indian names (English transliteration)
const hindiNames = [
  'Abhishek Sharma', 'Anjali Verma', 'Raj Kumar', 'Priya Singh', 'Vikram Patel',
  'Nisha Gupta', 'Sanjay Tripathi', 'Pooja Sharma', 'Rahul Verma', 'Diksha Singh',
  'Nikhil Gupta', 'Anjali Sharma', 'Mohan Singh', 'Sumita Singh', 'Rohit Kumar',
  'Pratibha Verma', 'Aditya Sharma', 'Seema Kumari', 'Vikas Singh', 'Ritu Sharma',
];

// South Indian names (English transliteration)
const southIndianNames = [
  'Raj Kumar', 'Priya Sharma', 'Vikram Singh', 'Divya Sharma', 'Arjun Patel',
  'Nisha Kumar', 'Sanjay Verma', 'Pooja Kumari', 'Rahul Sharma', 'Diksha Patel',
  'Sahil Khan', 'Anita Sharma', 'Abhay Patel', 'Sita Verma', 'Raj Kumari',
];

// Bengali names (English transliteration)
const bengaliNames = [
  'Raj Kiran', 'Nisha Das', 'Anil Bose', 'Priya Majumdar', 'Vijay Bhattacharya',
  'Anjali Gulati', 'Sanjay Thakur', 'Parul Sen', 'Rahul Chatterjee', 'Diksha Bose',
];

// English names for USA users
const englishNames = [
  'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson',
  'Jessica Martinez', 'James Anderson', 'Michelle Taylor', 'Robert Thomas', 'Lisa White',
  'Christopher Jackson', 'Karen Harris', 'Daniel Martin', 'Nancy Thompson', 'Matthew Garcia',
  'Susan Martinez', 'Anthony Robinson', 'Margaret Clark', 'Mark Rodriguez', 'Dorothy Lewis',
  'Donald Lee', 'Brenda Walker', 'Steven Hall', 'Sandra Young', 'Paul Hernandez',
  'Kimberly King', 'Andrew Wright', 'Carolyn Lopez', 'Joshua Hill', 'Janet Scott',
  'Kenneth Green', 'Maria Adams', 'Kevin Nelson', 'Diane Carter', 'Brian Roberts',
  'Kathleen Phillips', 'George Campbell', 'Judith Parker', 'Edward Evans', 'Christine Edwards',
];

function getIndianNameForCity(city: string): string {
  const maharashtraCities = [
    'Mumbai', 'Pune', 'Pimpri-Chinchwad', 'Nashik', 'Aurangabad', 'Nagpur', 'Thane',
    'Kalyan-Dombivali', 'Vasai-Virar', 'Navi Mumbai'
  ];
  
  const delhiRegionCities = [
    'Delhi', 'Noida', 'Greater Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad'
  ];

  const southCities = [
    'Bangalore', 'Hyderabad', 'Chennai', 'Kochi', 'Thiruvananthapuram', 'Coimbatore',
    'Madurai', 'Salem', 'Velachery', 'Vijayawada'
  ];

  const bengalCities = [
    'Kolkata', 'Howrah', 'Siliguri', 'Darjeeling', 'Jalpaiguri', 'Cooch Behar'
  ];

  if (maharashtraCities.includes(city)) {
    return marathiNames[Math.floor(Math.random() * marathiNames.length)];
  } else if (delhiRegionCities.includes(city)) {
    return hindiNames[Math.floor(Math.random() * hindiNames.length)];
  } else if (southCities.includes(city)) {
    return southIndianNames[Math.floor(Math.random() * southIndianNames.length)];
  } else if (bengalCities.includes(city)) {
    return bengaliNames[Math.floor(Math.random() * bengaliNames.length)];
  } else {
    return hindiNames[Math.floor(Math.random() * hindiNames.length)];
  }
}

function getIndianPhone(): string {
  const operators = ['98', '99', '97', '96', '95', '94', '93', '92', '91', '90'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  const remaining = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `+91${operator}${remaining}`;
}
const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Indore', 'Surat', 'Vadodara',
  'Nagpur', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot',
  'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad',
  'Dhanbad', 'Amritsar', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore',
  'Jabalpur', 'Guwahati', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur',
  'Kota', 'Navi Mumbai', 'Thane', 'Bhiwandi', 'Velachery', 'Salem', 'Gurgaon',
  'Noida', 'Greater Noida', 'Faridabad', 'Ghaziabad', 'Gautam Buddha Nagar',
  'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kannur', 'Alappuzha',
  'Pathanamthitta', 'Kottayam', 'Ernakulam', 'Malappuram', 'Wayanad', 'Idukki',
  'Kasaragod', 'Palakkad', 'Kollam', 'Jamshedpur', 'Durgapur', 'Asansol',
  'Siliguri', 'Darjeeling', 'Jalpaiguri', 'Cooch Behar', 'Kurseong', 'Kalimpong',
  'Dehradun', 'Haridwar', 'Rishikesh', 'Uttarkashi', 'Almora', 'Nainital',
  'Udham Singh Nagar', 'Chamoli', 'Pithoragarh', 'Bageshwar', 'Champawat',
  'Guwahati', 'Silchar', 'Dibrugarh', 'Tinsukia', 'Jorhat', 'Nagaon',
  'Barpeta', 'Kamrup', 'Marigaon', 'Sonitpur', 'Darrang', 'Udalguri',
  'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Biratnagar', 'Janakpur',
  'Birganj', 'Bhairahawa', 'Nepalgunj', 'Dharan', 'Itahari', 'Narayanganj',
];

// Major US cities
const usCities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
  'Memphis', 'Boston', 'Nashville', 'Baltimore', 'Louisville', 'Portland',
  'Las Vegas', 'Milwaukee', 'Albuquerque', 'Tucson', 'Miami', 'Oakland',
  'Cleveland', 'Tulsa', 'Arlington', 'New Orleans', 'Wichita', 'Bakersfield',
  'Tampa', 'Aurora', 'Anaheim', 'Santa Ana', 'Corpus Christi', 'Lexington',
  'Henderson', 'Riverside', 'Stockton', 'Cincinnati', 'Saint Paul', 'Greensboro',
];

// Property types and purposes
const propertyTypes = ['apartment', 'row-house'];
const purposes = ['rent', 'buy'];
const amenities = [
  'Gym', 'Swimming Pool', 'Parking', 'Security', 'Playground', 'Garden',
  'Balcony', 'Air Conditioning', 'Heating', 'Internet', 'TV Cable',
  'Water Supply', 'Power Backup', 'Elevator', 'Intercom', 'CCTV',
];

async function generateRandomPassword(): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Shuffle array function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function seed() {
  try {
    console.log('🌱 Starting seed with mixed Indian/US data...');
    
    // Clear existing data
    await prisma.listing.deleteMany({});
    await prisma.user.deleteMany({});

    const credentials: any[] = [];
    const users = [];

    // Create 158 users - 120 Indian, 38 English
    console.log('👥 Creating 158 users (120 Indian + 38 English)...');
    for (let i = 0; i < 158; i++) {
      let name: string;
      if (i < 120) {
        // Indian names for first 120
        name = getIndianNameForCity(indianCities[i % indianCities.length]);
      } else {
        // English names for US users (38)
        name = englishNames[(i - 120) % englishNames.length];
      }
      
      const email = `user${i + 1}@urbannest.com`;
      const plainPassword = await generateRandomPassword();
      const passwordHash = await bcrypt.hash(plainPassword, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
      });

      users.push(user);
      credentials.push({
        userId: user.id,
        name,
        email,
        password: plainPassword,
      });

      if ((i + 1) % 20 === 0) {
        console.log(`  ✓ Created ${i + 1}/158 users`);
      }
    }

    console.log('🏠 Creating 158 listings (mixed order - USA first for pagination)...');
    
    // Create a mixed array of all listings
    const allListingsData: any[] = [];

    // Create 120 Indian listings data
    for (let i = 0; i < 120; i++) {
      const user = users[i];
      const city = indianCities[i % indianCities.length];
      const selectedAmenities = amenities
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 6) + 3);
      const bhk = Math.floor(Math.random() * 5) + 1;
      const price = Math.floor(Math.random() * 8000000) + 2000000;
      const carpetArea = Math.floor(Math.random() * 2600) + 400;
      const builtUpArea = Math.floor(carpetArea * 1.3);

      const contactName = getIndianNameForCity(city);
      const contactPhone = getIndianPhone();
      const propertyType = propertyTypes[Math.floor(Math.random() * 2)];
      const purpose = purposes[Math.floor(Math.random() * 2)];
      
      const titles = [
        `Beautiful ${bhk} BHK ${propertyType}`,
        `Spacious ${bhk} bedroom ${propertyType}`,
        `Modern ${bhk} BHK home`,
        `Cozy ${bhk} BHK property`,
        `Luxurious ${bhk} BHK`,
      ];
      const title = titles[Math.floor(Math.random() * titles.length)];

      allListingsData.push({
        ownerId: user.id,
        ownerEmail: user.email,
        purpose,
        propertyType,
        title: `${title} in ${city}`,
        area: city,
        bhk,
        price: BigInt(price),
        address: `${Math.floor(Math.random() * 900) + 100} ${['Street', 'Road', 'Lane', 'Avenue'][Math.floor(Math.random() * 4)]}, ${city}`,
        contactName,
        contactPhone,
        imageDataUrls: [],
        parking: Math.random() > 0.3 ? `${Math.floor(Math.random() * 3) + 1} slots` : undefined,
        carpetAreaSqft: carpetArea,
        builtUpAreaSqft: builtUpArea,
        amenities: selectedAmenities,
        propertyAge: Math.random() > 0.4 ? Math.floor(Math.random() * 30) : undefined,
        builderName: Math.random() > 0.5 ? ['Godrej', 'Lodha', 'Oberoi', 'Brigade', 'Prestige'][Math.floor(Math.random() * 5)] : undefined,
      });
    }

    // Create 38 US listings data
    for (let i = 0; i < 38; i++) {
      const userIndex = 120 + i;
      const user = users[userIndex];
      const city = usCities[i % usCities.length];
      const selectedAmenities = amenities
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 6) + 3);
      const bhk = Math.floor(Math.random() * 5) + 1;
      const price = Math.floor(Math.random() * 1300000) + 200000;
      const carpetArea = Math.floor(Math.random() * 4200) + 800;
      const builtUpArea = Math.floor(carpetArea * 1.2);
      const propertyType = propertyTypes[Math.floor(Math.random() * 2)];
      const purpose = purposes[Math.floor(Math.random() * 2)];

      allListingsData.push({
        ownerId: user.id,
        ownerEmail: user.email,
        purpose,
        propertyType,
        title: `Stunning ${bhk} BHK ${propertyType} in ${city}, USA`,
        area: city,
        bhk,
        price: BigInt(price),
        address: `${Math.floor(Math.random() * 9900) + 100} ${['Street', 'Road', 'Avenue', 'Boulevard'][Math.floor(Math.random() * 4)]}, ${city}, USA`,
        contactName: user.name,
        contactPhone: `+1${Math.floor(Math.random() * 8000000000) + 2000000000}`,
        imageDataUrls: [],
        parking: Math.random() > 0.3 ? `${Math.floor(Math.random() * 4) + 1} spaces` : undefined,
        carpetAreaSqft: carpetArea,
        builtUpAreaSqft: builtUpArea,
        amenities: selectedAmenities,
        propertyAge: Math.random() > 0.4 ? Math.floor(Math.random() * 50) : undefined,
        builderName: Math.random() > 0.5 ? ['Meritage', 'Toll', 'PulteGroup', 'Lennar', 'Beazer'][Math.floor(Math.random() * 5)] : undefined,
      });
    }

    // Shuffle all listings randomly to mix USA and Indian throughout
    const shuffledListings = shuffleArray(allListingsData);

    // Insert all listings in shuffled random order
    for (let i = 0; i < shuffledListings.length; i++) {
      await prisma.listing.create({ data: shuffledListings[i] });
      if ((i + 1) % 20 === 0) {
        console.log(`  ✓ Created ${i + 1}/158 listings`);
      }
    }

    // Save credentials to CSV
    let csvContent = '"User ID","Name","Email","Password"\n';
    credentials.forEach((cred, idx) => {
      csvContent += `"${idx + 1}","${cred.name}","${cred.email}","${cred.password}"\n`;
    });

    fs.writeFileSync('/home/dee/Urban/UrbanNest/USER_CREDENTIALS.csv', csvContent);

    // Also save as TXT
    const txtContent = credentials
      .map((cred, idx) => `${idx + 1}. Name: ${cred.name} | Email: ${cred.email} | Password: ${cred.password}`)
      .join('\n');

    fs.writeFileSync(
      '/home/dee/Urban/UrbanNest/USER_CREDENTIALS.txt',
      `URBANNEST USER CREDENTIALS\n${'='.repeat(80)}\n\n${txtContent}`
    );

    console.log('\n✅ Seed completed successfully!');
    console.log('📊 Summary:');
    console.log('  • Created 158 users (120 Indian names + 38 English names)');
    console.log('  • Created 120 Indian listings with Indian contact names');
    console.log('  • Created 38 US listings with English contact names');
    console.log('  • Listings shuffled randomly - USA & India mixed throughout ALL pages');
    console.log('\n📝 Updated files:');
    console.log('  • USER_CREDENTIALS.csv');
    console.log('  • USER_CREDENTIALS.txt');
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
