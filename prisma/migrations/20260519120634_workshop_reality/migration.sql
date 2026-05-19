-- AlterTable
ALTER TABLE "Tool" ADD COLUMN "location" TEXT;
ALTER TABLE "Tool" ADD COLUMN "maintenanceReason" TEXT;
ALTER TABLE "Tool" ADD COLUMN "maintenanceStartedAt" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Checkout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "toolId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "checkedOutAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" DATETIME,
    "checkoutNote" TEXT,
    "returnNote" TEXT,
    "returnCondition" TEXT,
    "damageReported" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Checkout_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Checkout_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Checkout" ("checkedOutAt", "checkoutNote", "id", "memberId", "returnCondition", "returnNote", "returnedAt", "toolId") SELECT "checkedOutAt", "checkoutNote", "id", "memberId", "returnCondition", "returnNote", "returnedAt", "toolId" FROM "Checkout";
DROP TABLE "Checkout";
ALTER TABLE "new_Checkout" RENAME TO "Checkout";
CREATE INDEX "Checkout_toolId_idx" ON "Checkout"("toolId");
CREATE INDEX "Checkout_memberId_idx" ON "Checkout"("memberId");
CREATE INDEX "Checkout_returnedAt_idx" ON "Checkout"("returnedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
