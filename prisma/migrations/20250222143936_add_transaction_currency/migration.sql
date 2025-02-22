-- CreateEnum
CREATE TYPE "wallet_transaction_currency" AS ENUM ('PHP', 'INR', 'BRL', 'PLN', 'RON', 'VND', 'USD');

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "balance" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "wallet_transaction" ADD COLUMN     "currency" "wallet_transaction_currency" NOT NULL DEFAULT 'USD';
