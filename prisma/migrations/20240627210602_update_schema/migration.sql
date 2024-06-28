/*
  Warnings:

  - You are about to drop the column `rate` on the `offers` table. All the data in the column will be lost.
  - You are about to drop the column `term` on the `offers` table. All the data in the column will be lost.
  - Added the required column `installmentAmount` to the `offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `installments` to the `offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interestRate` to the `offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentFrequencyId` to the `offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termInDays` to the `offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `offers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "payment_frequencies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "days" INTEGER NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "loanId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "offers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "offers_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loans" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "offers_paymentFrequencyId_fkey" FOREIGN KEY ("paymentFrequencyId") REFERENCES "payment_frequencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_offers" ("amount", "createdAt", "id", "loanId", "status", "updatedAt", "userId") SELECT "amount", "createdAt", "id", "loanId", "status", "updatedAt", "userId" FROM "offers";
DROP TABLE "offers";
ALTER TABLE "new_offers" RENAME TO "offers";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
