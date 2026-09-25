import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL ?? '';

if (!connectionString) {
  throw new Error('DATABASE_URL is not set.');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedUsers() {
  const passwordHash = await bcrypt.hash('changeme123', 10);
  await prisma.users.createMany({
    data: [
      {
        email: 'admin@abrigolambeijos.com.br',
        name: 'Admin',
        password: passwordHash,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
      {
        email: 'adopter@abrigolambeijos.com.br',
        name: 'Adopter',
        password: passwordHash,
        role: UserRole.ADOPTER,
        status: UserStatus.ACTIVE,
      },
      {
        email: 'partner@abrigolambeijos.com.br',
        name: 'Partner',
        password: passwordHash,
        role: UserRole.PARTNER,
        status: UserStatus.ACTIVE,
      },
      {
        email: 'protector@abrigolambeijos.com.br',
        name: 'Protector',
        password: passwordHash,
        role: UserRole.PROTECTOR,
        status: UserStatus.ACTIVE,
      },
      {
        email: 'contact@abrigolambeijos.com.br',
        name: 'User',
        password: passwordHash,
        role: UserRole.ADOPTER,
        status: UserStatus.ACTIVE,
      },
      {
        email: 'contato@abrigolambeijos.com.br',
        name: 'Contato',
        password: passwordHash,
        role: UserRole.PARTNER,
        status: UserStatus.INACTIVE,
      },
      {
        email: 'email@abrigolambeijos.com.br',
        name: 'Email',
        password: passwordHash,
        role: UserRole.PARTNER,
        status: UserStatus.INACTIVE,
      },
    ],
    skipDuplicates: true,
  });
  console.log('Users seeded successfully.');
}

async function seedPets() {
  await prisma.pets.createMany({
    data: [
      {
        animalname: 'Buddy',
        rganimal: 'RG-0001',
        dateentry: new Date(),
        name: 'Buddy',
        race: 'Golden Retriever',
        gender: 'Male',
        microchipped: false,
        castrated: true,
        coattypecoloration: 'Curto, dourado',
        predominantcoatcolor: 'Dourado',
        signsanddistinctive: 'Mancha branca no peito',
        estimatedchronologicalage: 3,
        birthdate: new Date('2023-01-01'),
        size: 'Large',
      },
      {
        animalname: 'Whiskers',
        rganimal: 'RG-0002',
        dateentry: new Date(),
        name: 'Whiskers',
        race: 'Bulldog',
        gender: 'Female',
        microchipped: false,
        castrated: true,
        coattypecoloration: 'Curto, branco e marrom',
        predominantcoatcolor: 'Branco',
        signsanddistinctive: 'Orelha caída',
        estimatedchronologicalage: 2,
        birthdate: new Date('2024-01-01'),
        size: 'Small',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Pets seeded successfully.');
}

async function seedAdopters() {
  await prisma.adopters.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '987-654-3210',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Adopters seeded successfully.');
}

async function seedAdoptions() {
  await prisma.adoptions.createMany({
    data: [
      {
        adopterId: 1,
        animalId: 1,
        adoptionDate: new Date(),
      },
      {
        adopterId: 2,
        animalId: 2,
        adoptionDate: new Date(),
      },
    ],
    skipDuplicates: true,
  });
  console.log('Adoptions seeded successfully.');
}

async function seedAdoptionRequests() {
  await prisma.adoptionRequests.createMany({
    data: [
      {
        adopterId: 1,
        animalId: 1,
        requestDate: new Date(),
        petName: 'Buddy',
        userName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        address: '123 Main St, São Paulo, SP',
        experience:
          'I have experience with dogs and can provide a loving home.',
        home: 'I have a spacious backyard and a safe environment for pets.',
        status: 'pending',
      },
      {
        adopterId: 2,
        animalId: 2,
        requestDate: new Date(),
        petName: 'Whiskers',
        userName: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '987-654-3210',
        address: '456 Elm St, Rio de Janeiro, RJ',
        experience:
          'I have experience with cats and can provide a loving home.',
        home: 'I have a cozy apartment and a safe environment for pets.',
        status: 'pending',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Adoption Requests seeded successfully.');
}

async function seedRecommendations() {
  await prisma.recommendations.createMany({
    data: [
      {
        adopterId: 1,
        animalId: 1,
        recommendationText: 'Buddy is a great dog for families with children.',
      },
      {
        adopterId: 2,
        animalId: 2,
        recommendationText: 'Whiskers is a friendly cat that loves attention.',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Recommendations seeded successfully.');
}

async function seedDonations() {
  await prisma.donations.createMany({
    data: [
      {
        donorName: 'John Donor',
        amount: 100.0,
      },
      {
        donorName: 'Jane Donor',
        amount: 50.0,
      },
    ],
    skipDuplicates: true,
  });
  console.log('Donations seeded successfully.');
}

async function seedRescues() {
  await prisma.rescues.createMany({
    data: [
      {
        name: 'Buddy Rescue',
        location: 'São Paulo, SP',
      },
      {
        name: 'Whiskers Rescue',
        location: 'Rio de Janeiro, RJ',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Rescues seeded successfully.');
}

async function main() {
  await seedUsers();
  await seedPets();
  await seedAdopters();
  await seedAdoptions();
  await seedAdoptionRequests();
  await seedRecommendations();
  await seedDonations();
  await seedRescues();
  console.log('Main function executed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
