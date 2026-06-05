export type PaymentRequirement = {
  scheme: "hedera-hbar-demo-x402";
  network: "hedera-testnet" | "hedera-mainnet";
  payTo: string;
  amountUsd: string;
  amountHbar: string;
  memo: string;
  expiresAt: string;
};

export type GateDecision =
  | { allowed: true; receiptId: string }
  | { allowed: false; requirement: PaymentRequirement };

export type Receipt = {
  receiptId: string;
  memo: string;
  payer?: string;
  txId?: string;
  createdAt: string;
};

const HBAR_USD_FALLBACK = 0.06;

export class PaymentGate {
  private readonly receipts = new Map<string, Receipt>();

  constructor(
    private readonly payTo: string,
    private readonly priceUsd = 1,
    private readonly network: "hedera-testnet" | "hedera-mainnet" = "hedera-testnet",
  ) {}

  quote(agentTask: string, now = new Date()): PaymentRequirement {
    const memo = this.memoFor(agentTask, now);
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
    const amountHbar = (this.priceUsd / HBAR_USD_FALLBACK).toFixed(4);

    return {
      scheme: "hedera-hbar-demo-x402",
      network: this.network,
      payTo: this.payTo,
      amountUsd: this.priceUsd.toFixed(2),
      amountHbar,
      memo,
      expiresAt,
    };
  }

  verifyDemoPayment(input: { memo: string; txId?: string; payer?: string }): Receipt {
    if (!input.memo.startsWith("hpg:")) {
      throw new Error("Invalid payment memo. Expected memo returned by quote_access.");
    }

    const receipt: Receipt = {
      receiptId: `receipt_${Buffer.from(input.memo).toString("base64url").slice(0, 18)}`,
      memo: input.memo,
      payer: input.payer,
      txId: input.txId,
      createdAt: new Date().toISOString(),
    };

    this.receipts.set(receipt.receiptId, receipt);
    return receipt;
  }

  require(receiptId: string | undefined, agentTask: string): GateDecision {
    if (receiptId && this.receipts.has(receiptId)) {
      return { allowed: true, receiptId };
    }

    return { allowed: false, requirement: this.quote(agentTask) };
  }

  private memoFor(agentTask: string, now: Date): string {
    const slug = agentTask.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const stamp = now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 12);
    return `hpg:${slug.slice(0, 24)}:${stamp}`;
  }
}
