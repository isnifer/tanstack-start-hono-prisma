/*
  Warnings:

  - You are about to drop the `WalletTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "wallet_transaction_type" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'WAGER', 'PAYOUT', 'BONUS', 'FEE', 'REFUND', 'ADJUSTMENT', 'CASHBACK', 'TRANSFER', 'REVERSAL', 'PENALTY', 'AFFILIATE_PAYOUT');

-- DropForeignKey
ALTER TABLE "WalletTransaction" DROP CONSTRAINT "WalletTransaction_userId_fkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "balance" DROP DEFAULT;

-- DropTable
DROP TABLE "WalletTransaction";

-- DropEnum
DROP TYPE "WalletTransactionType";

-- CreateTable
CREATE TABLE "wallet_transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "wallet_transaction_type" NOT NULL,
    "amount" BIGINT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wallet_transaction_userId_createdAt_idx" ON "wallet_transaction"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "wallet_transaction" ADD CONSTRAINT "wallet_transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
