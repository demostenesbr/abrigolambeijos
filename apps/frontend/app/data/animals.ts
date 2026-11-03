import realPets from "./real-pets.json";

export type AnimalStatus = "adotar" | "perdido" | "encontrado";
export type AnimalSize = "pequeno" | "medio" | "grande";

export interface Animal {
  id: string;
  name: string;
  breed: string;
  size: AnimalSize;
  status: AnimalStatus;
  gender?: string;
  birthDate?: string;
  ageLabel?: string;
  city?: string;
  img?: string;
  details: string[];
  neutered?: boolean;
  microchipped?: boolean;
  vaccinated?: boolean;
  // Registro de teste, sem correspondência no cadastro real do abrigo.
  synthetic: boolean;
}

interface RealPet {
  id: string;
  photo: string | null;
  breed: string;
  gender: string;
  size: AnimalSize;
  birthDate: string;
  color: string;
  coat: string;
  signs: string;
  behavior: string;
  health: string;
  neutered: boolean;
  microchipped: boolean;
}

// Fonte: apps/ml/datasets/raw/real_pets.csv (npm run generate:pets).
// Todos os cães do cadastro estão abrigados e disponíveis para adoção.
const adoptableAnimals: Animal[] = (realPets as RealPet[]).map((pet) => ({
  id: pet.id,
  name: `Cão ${pet.color.toLowerCase()}`,
  breed: pet.breed,
  size: pet.size,
  status: "adotar",
  gender: pet.gender,
  img: pet.photo ? `/pets/${pet.photo}` : undefined,
  birthDate: pet.birthDate,
  details: [
    pet.behavior,
    pet.health && `Saúde: ${pet.health}`,
    pet.coat && `Pelagem: ${pet.coat.toLowerCase()}`,
    pet.signs,
  ].filter((item): item is string => Boolean(item)),
  neutered: pet.neutered,
  microchipped: pet.microchipped,
  synthetic: false,
}));

// O cadastro real ainda não tem animais perdidos/encontrados: dados de teste.
const syntheticAnimals: Animal[] = [
  {
    id: "synthetic-1",
    name: "Thor",
    breed: "Labrador mix",
    ageLabel: "4 anos",
    size: "grande",
    status: "perdido",
    city: "Guarulhos, SP",
    img: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&h=420&fit=crop&auto=format",
    details: [],
    neutered: true,
    microchipped: true,
    vaccinated: true,
    synthetic: true,
  },
  {
    id: "synthetic-2",
    name: "Duke",
    breed: "Beagle",
    ageLabel: "2 anos",
    size: "medio",
    status: "perdido",
    city: "Santo André, SP",
    img: "https://images.unsplash.com/photo-1612195583950-b8fd34c87093?w=500&h=420&fit=crop&auto=format",
    details: [],
    vaccinated: true,
    synthetic: true,
  },
  {
    id: "synthetic-3",
    name: "Toby",
    breed: "Vira-lata",
    ageLabel: "5 anos",
    size: "medio",
    status: "encontrado",
    city: "Osasco, SP",
    img: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=500&h=420&fit=crop&auto=format",
    details: [],
    synthetic: true,
  },
];

export const allAnimals: Animal[] = [...adoptableAnimals, ...syntheticAnimals];

export function formatAge(animal: Animal, today = new Date()): string {
  if (animal.ageLabel) return animal.ageLabel;
  if (!animal.birthDate) return "Idade não informada";
  const birth = new Date(`${animal.birthDate}T00:00:00`);
  let months =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    today.getMonth() -
    birth.getMonth();
  if (today.getDate() < birth.getDate()) months -= 1;
  months = Math.max(months, 0);
  if (months < 12) return months <= 1 ? "1 mês" : `${months} meses`;
  const years = Math.floor(months / 12);
  return years === 1 ? "1 ano" : `${years} anos`;
}
