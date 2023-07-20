/*
  Warnings:

  - Added the required column `transactionId` to the `Debits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Debits" ADD COLUMN     "transactionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Debits" ADD CONSTRAINT "Debits_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transactions"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
