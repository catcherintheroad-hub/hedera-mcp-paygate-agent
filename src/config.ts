import "dotenv/config";

export type AppConfig = {
  hederaNetwork: "testnet" | "mainnet";
  hederaAccountId?: string;
  hederaPrivateKey?: string;
  paymentAccountId: string;
  accessPriceUsd: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const hederaNetwork = env.HEDERA_NETWORK === "mainnet" ? "mainnet" : "testnet";
  const accessPriceUsd = Number(env.ACCESS_PRICE_USD ?? "1");

  if (!Number.isFinite(accessPriceUsd) || accessPriceUsd <= 0) {
    throw new Error("ACCESS_PRICE_USD must be a positive number.");
  }

  return {
    hederaNetwork,
    hederaAccountId: env.HEDERA_ACCOUNT_ID,
    hederaPrivateKey: env.HEDERA_PRIVATE_KEY,
    paymentAccountId: env.PAYMENT_ACCOUNT_ID ?? env.HEDERA_ACCOUNT_ID ?? "0.0.demo-payee",
    accessPriceUsd,
  };
}
