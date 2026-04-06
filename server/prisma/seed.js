import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
    const email = 'demo@urbannest.com';
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return;
    }
    const user = await prisma.user.create({
        data: {
            name: 'Demo User',
            email,
            passwordHash: await bcrypt.hash('demo12345', 10)
        }
    });
    await prisma.listing.create({
        data: {
            ownerId: user.id,
            ownerEmail: user.email,
            purpose: 'rent',
            propertyType: 'apartment',
            title: '2BHK Demo Listing',
            area: 'Kothrud, Pune',
            bhk: 2,
            price: 25000,
            address: '12, Main Street, Kothrud, Pune',
            contactName: 'Demo User',
            contactPhone: '9876543210',
            imageDataUrls: ['https://placehold.co/600x300?text=Demo+Listing']
        }
    });
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
