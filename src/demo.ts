import { buildPremiumBrief } from "./brief.js";
import { PaymentGate } from "./paymentGate.js";

const gate = new PaymentGate("0.0.demo-payee", 1, "hedera-testnet");
const quote = gate.quote("agent treasury risk brief");
const receipt = gate.verifyDemoPayment({ memo: quote.memo, txId: "0.0.123@1780660000.000000001" });

console.log("402 payment requirement:");
console.log(JSON.stringify(quote, null, 2));
console.log("\nAccepted receipt:");
console.log(JSON.stringify(receipt, null, 2));
console.log("\nUnlocked premium brief:");
console.log(buildPremiumBrief({ topic: "agent treasury risk brief", riskTolerance: "medium" }));
