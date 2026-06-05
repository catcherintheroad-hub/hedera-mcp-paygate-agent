import assert from "node:assert/strict";
import test from "node:test";
import { buildPremiumBrief } from "../src/brief.js";
import { PaymentGate } from "../src/paymentGate.js";

test("quote_access returns a Hedera 402-style requirement", () => {
  const gate = new PaymentGate("0.0.777", 2, "hedera-testnet");
  const quote = gate.quote("premium report", new Date("2026-06-05T00:00:00.000Z"));

  assert.equal(quote.scheme, "hedera-hbar-demo-x402");
  assert.equal(quote.network, "hedera-testnet");
  assert.equal(quote.payTo, "0.0.777");
  assert.equal(quote.amountUsd, "2.00");
  assert.match(quote.memo, /^hpg:premium-report:/);
});

test("premium tool is blocked until a receipt exists", () => {
  const gate = new PaymentGate("0.0.777");
  const decision = gate.require(undefined, "premium report");

  assert.equal(decision.allowed, false);
  if (!decision.allowed) {
    assert.equal(decision.requirement.payTo, "0.0.777");
  }
});

test("demo verifier unlocks the premium path", () => {
  const gate = new PaymentGate("0.0.777");
  const quote = gate.quote("premium report");
  const receipt = gate.verifyDemoPayment({ memo: quote.memo, payer: "0.0.888" });
  const decision = gate.require(receipt.receiptId, "premium report");

  assert.deepEqual(decision, { allowed: true, receiptId: receipt.receiptId });
});

test("premium brief includes Hedera Agent Kit MCP guidance", () => {
  const brief = buildPremiumBrief({ topic: "paid token analyst", riskTolerance: "low" });

  assert.match(brief, /Hedera Agent Kit MCP/);
  assert.match(brief, /RETURN_BYTE/);
  assert.match(brief, /HCS topic/);
});
