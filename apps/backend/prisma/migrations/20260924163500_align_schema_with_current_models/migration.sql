/*
  Warnings:

  - You are about to drop the column `age` on the `Pets` table. All the data in the column will be lost.
  - You are about to drop the column `breed` on the `Pets` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Pets` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Pets` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Pets` table. All the data in the column will be lost.
  - You are about to drop the column `species` on the `Pets` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Pets` table. All the data in the column will be lost.
  - You are about to drop the column `rules` on the `Users` table. All the data in the column will be lost.
  - Added the required column `animalname` to the `Pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthdate` to the `Pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `castrated` to the `Pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coattypecoloration` to the `Pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateentry` to the `Pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedchronologicalage` to the `Pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `microchipped` to the `Pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `predominantcoatcolor` to the `Pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `race` to the `Pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rganimal` to the `Pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signsanddistinctive` to the `Pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADOPTER', 'PROTECTOR', 'PARTNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- DropIndex
DROP INDEX "Pets_name_idx";

-- AlterTable
ALTER TABLE "Pets" DROP COLUMN "age",
DROP COLUMN "breed",
DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "location",
DROP COLUMN "species",
DROP COLUMN "type",
ADD COLUMN     "animalname" TEXT NOT NULL,
ADD COLUMN     "behavioralprofile" TEXT,
ADD COLUMN     "birthdate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "castrated" BOOLEAN NOT NULL,
ADD COLUMN     "coattypecoloration" TEXT NOT NULL,
ADD COLUMN     "dateentry" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "estimatedchronologicalage" INTEGER NOT NULL,
ADD COLUMN     "healthcondition" TEXT,
ADD COLUMN     "microchipnumber" TEXT,
ADD COLUMN     "microchipped" BOOLEAN NOT NULL,
ADD COLUMN     "petphoto" TEXT,
ADD COLUMN     "predominantcoatcolor" TEXT NOT NULL,
ADD COLUMN     "race" TEXT NOT NULL,
ADD COLUMN     "redemptioncondition" TEXT,
ADD COLUMN     "rganimal" TEXT NOT NULL,
ADD COLUMN     "signsanddistinctive" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "rules",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'ADOPTER',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE INDEX "Pets_animalname_idx" ON "Pets"("animalname");

-- CreateIndex
CREATE INDEX "Users_username_idx" ON "Users"("username");

-- CreateIndex
CREATE INDEX "Users_role_idx" ON "Users"("role");

-- CreateIndex
CREATE INDEX "Users_status_idx" ON "Users"("status");
