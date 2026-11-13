-- Check existing references before changing anything so deployments with old
-- orphan rows fail without partially applying the migration.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Adoptions" a LEFT JOIN "Adopters" d ON d."id"=a."adopterId" LEFT JOIN "Pets" p ON p."id"=a."animalId" WHERE d."id" IS NULL OR p."id" IS NULL) THEN
        RAISE EXCEPTION 'Orphan references exist in Adoptions; repair them before this migration';
    END IF;
    IF EXISTS (SELECT 1 FROM "AdoptionRequests" r LEFT JOIN "Adopters" d ON d."id"=r."adopterId" LEFT JOIN "Pets" p ON p."id"=r."animalId" WHERE d."id" IS NULL OR p."id" IS NULL) THEN
        RAISE EXCEPTION 'Orphan references exist in AdoptionRequests; repair them before this migration';
    END IF;
    IF EXISTS (SELECT 1 FROM "Recommendations" r LEFT JOIN "Adopters" d ON d."id"=r."adopterId" LEFT JOIN "Pets" p ON p."id"=r."animalId" WHERE d."id" IS NULL OR p."id" IS NULL) THEN
        RAISE EXCEPTION 'Orphan references exist in Recommendations; repair them before this migration';
    END IF;
    IF EXISTS (SELECT 1 FROM "Pets" GROUP BY "rganimal" HAVING COUNT(*) > 1) THEN
        RAISE EXCEPTION 'Duplicate Pets.rganimal values exist; repair them before this migration';
    END IF;
END $$;

ALTER TABLE "Adopters" ADD COLUMN "userId" INTEGER;
UPDATE "Adopters" AS adopter SET "userId"=account."id" FROM "Users" AS account WHERE adopter."email"=account."email";
CREATE UNIQUE INDEX "Adopters_userId_key" ON "Adopters"("userId");
CREATE UNIQUE INDEX "Pets_rganimal_key" ON "Pets"("rganimal");

ALTER TABLE "Adopters" ADD CONSTRAINT "Adopters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Adoptions" ADD CONSTRAINT "Adoptions_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "Adopters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Adoptions" ADD CONSTRAINT "Adoptions_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AdoptionRequests" ADD CONSTRAINT "AdoptionRequests_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "Adopters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AdoptionRequests" ADD CONSTRAINT "AdoptionRequests_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Recommendations" ADD CONSTRAINT "Recommendations_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "Adopters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Recommendations" ADD CONSTRAINT "Recommendations_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
