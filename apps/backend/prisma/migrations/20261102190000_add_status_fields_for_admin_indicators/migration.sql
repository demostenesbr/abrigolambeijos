-- AlterTable
ALTER TABLE "Rescues" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'triage';

-- AlterTable
ALTER TABLE "Donations" ADD COLUMN     "method" TEXT NOT NULL DEFAULT 'pix',
ADD COLUMN     "plan" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'confirmed',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'one_time';

-- AlterTable
ALTER TABLE "Partners" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- Registros de resgate já existentes são histórico concluído
UPDATE "Rescues" SET "status" = 'recovered';

-- CreateIndex
CREATE INDEX "Rescues_status_idx" ON "Rescues"("status");

-- CreateIndex
CREATE INDEX "Donations_status_idx" ON "Donations"("status");

-- CreateIndex
CREATE INDEX "Donations_createdAt_idx" ON "Donations"("createdAt");

-- CreateIndex
CREATE INDEX "Partners_status_idx" ON "Partners"("status");
