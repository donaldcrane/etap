-- CreateEnum
CREATE TYPE "enum_Transactions_status" AS ENUM ('pending', 'success', 'failed');

-- CreateEnum
CREATE TYPE "enum_Transactions_type" AS ENUM ('walletTransfer', 'fundAccount');

-- CreateEnum
CREATE TYPE "enum_Users_role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "enum_Wallet_Currency" AS ENUM ('dollars', 'naira', 'pounds', 'euro', 'yen', 'cefa', 'rand', 'cad');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "enum_Users_role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallets" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "currency" "enum_Wallet_Currency" NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "status" "enum_Transactions_status" NOT NULL DEFAULT 'pending',
    "type" "enum_Transactions_type" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "enum_Wallet_Currency" NOT NULL,
    "userId" INTEGER NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "reference" VARCHAR(255),
    "saveCard" BOOLEAN NOT NULL DEFAULT false,
    "cardId" INTEGER,
    "walletId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Debits" (
    "id" SERIAL NOT NULL,
    "status" "enum_Transactions_status" NOT NULL DEFAULT 'pending',
    "type" "enum_Transactions_type" NOT NULL DEFAULT 'walletTransfer',
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "enum_Wallet_Currency" NOT NULL,
    "userId" INTEGER NOT NULL,
    "confirmed" BOOLEAN DEFAULT false,
    "reference" VARCHAR(255) NOT NULL,
    "exchangeRate" INTEGER NOT NULL,
    "walletId" INTEGER NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Debits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "cardType" TEXT NOT NULL,
    "expirationMonth" TEXT NOT NULL,
    "expirationYear" TEXT NOT NULL,
    "last4" TEXT NOT NULL,
    "authorizationCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Wallets_userId_currency_key" ON "Wallets"("userId", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_reference_key" ON "Transactions"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Debits_reference_key" ON "Debits"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Debits_transactionId_key" ON "Debits"("transactionId");

-- AddForeignKey
ALTER TABLE "Wallets" ADD CONSTRAINT "Wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallets"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Debits" ADD CONSTRAINT "Debits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Debits" ADD CONSTRAINT "Debits_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallets"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Debits" ADD CONSTRAINT "Debits_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transactions"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
