-- AlterTable
ALTER TABLE "Pets" ADD COLUMN     "apartmentAdaptability" TEXT NOT NULL DEFAULT 'Medium',
ADD COLUMN     "catsCompatibility" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "childrenCompatibility" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dogsCompatibility" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "energyLevel" TEXT NOT NULL DEFAULT 'Medium',
ADD COLUMN     "exerciseNeed" TEXT NOT NULL DEFAULT 'Medium',
ADD COLUMN     "sociability" TEXT NOT NULL DEFAULT 'Medium',
ADD COLUMN     "species" TEXT NOT NULL DEFAULT 'Dog',
ADD COLUMN     "temperament" TEXT NOT NULL DEFAULT 'Affectionate';
