import { enum_Wallet_Currency } from '@prisma/client';

export const rate: Record<enum_Wallet_Currency, number> = {
  naira: 1,
  dollars: 800,
  pounds: 1000,
  yen: 500,
  cefa: 50,
  euro: 1200,
  rand: 44,
  cad: 200,
};
