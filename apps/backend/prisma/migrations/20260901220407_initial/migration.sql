-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "rules" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adopters" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Adopters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adoptions" (
    "id" SERIAL NOT NULL,
    "adopterId" INTEGER NOT NULL,
    "animalId" INTEGER NOT NULL,
    "adoptionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Adoptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdoptionRequests" (
    "id" SERIAL NOT NULL,
    "adopterId" INTEGER NOT NULL,
    "animalId" INTEGER NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "petName" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "home" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdoptionRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rescues" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rescues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donations" (
    "id" SERIAL NOT NULL,
    "donorName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendations" (
    "id" SERIAL NOT NULL,
    "adopterId" INTEGER NOT NULL,
    "animalId" INTEGER NOT NULL,
    "recommendationText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partners" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_email_idx" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Pets_name_idx" ON "Pets"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Adopters_email_key" ON "Adopters"("email");

-- CreateIndex
CREATE INDEX "Adopters_email_idx" ON "Adopters"("email");

-- CreateIndex
CREATE INDEX "Adoptions_adopterId_idx" ON "Adoptions"("adopterId");

-- CreateIndex
CREATE INDEX "Adoptions_animalId_idx" ON "Adoptions"("animalId");

-- CreateIndex
CREATE INDEX "AdoptionRequests_adopterId_idx" ON "AdoptionRequests"("adopterId");

-- CreateIndex
CREATE INDEX "AdoptionRequests_animalId_idx" ON "AdoptionRequests"("animalId");

-- CreateIndex
CREATE INDEX "Rescues_name_idx" ON "Rescues"("name");

-- CreateIndex
CREATE INDEX "Donations_donorName_idx" ON "Donations"("donorName");

-- CreateIndex
CREATE INDEX "Recommendations_adopterId_idx" ON "Recommendations"("adopterId");

-- CreateIndex
CREATE INDEX "Recommendations_animalId_idx" ON "Recommendations"("animalId");

-- CreateIndex
CREATE INDEX "Partners_name_idx" ON "Partners"("name");
