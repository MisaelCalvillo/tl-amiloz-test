/*
  Warnings:

  - You are about to drop the column `loanId` on the `offers` table. All the data in the column will be lost.
  - Added the required column `offerId` to the `loans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `loans` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "installments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loanId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "paidAmount" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "installments_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loans" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "installmentId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "paymentPlatform" TEXT NOT NULL,
    "platformPaymentId" TEXT,
    "paymentMethod" TEXT,
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "payments_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "installments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_loans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    "remainingAmount" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "loans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "loans_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_loans" ("id", "remainingAmount", "status", "totalAmount", "userId") SELECT "id", "remainingAmount", "status", "totalAmount", "userId" FROM "loans";
DROP TABLE "loans";
ALTER TABLE "new_loans" RENAME TO "loans";
CREATE UNIQUE INDEX "loans_offerId_key" ON "loans"("offerId");
CREATE TABLE "new_offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "interestRate" REAL NOT NULL,
    "termInDays" INTEGER NOT NULL,
    "installments" INTEGER NOT NULL,
    "installmentAmount" REAL NOT NULL,
    "totalAmount" REAL NOT NULL,
    "paymentFrequencyId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "offers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "offers_paymentFrequencyId_fkey" FOREIGN KEY ("paymentFrequencyId") REFERENCES "payment_frequencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_offers" ("amount", "createdAt", "id", "installmentAmount", "installments", "interestRate", "paymentFrequencyId", "status", "termInDays", "totalAmount", "updatedAt", "userId") SELECT "amount", "createdAt", "id", "installmentAmount", "installments", "interestRate", "paymentFrequencyId", "status", "termInDays", "totalAmount", "updatedAt", "userId" FROM "offers";
DROP TABLE "offers";
ALTER TABLE "new_offers" RENAME TO "offers";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
