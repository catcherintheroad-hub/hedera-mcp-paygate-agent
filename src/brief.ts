export type BriefInput = {
  topic: string;
  riskTolerance: "low" | "medium" | "high";
};

export function buildPremiumBrief(input: BriefInput): string {
  const tolerance = {
    low: "Use conservative wording, avoid autonomous transaction execution, and require human review before submitting bytes.",
    medium: "Allow bounded autonomous actions only after policy checks and explicit memo tagging.",
    high: "Allow broader automation, but keep spend limits, audit logs, and emergency stop hooks enabled.",
  }[input.riskTolerance];

  return [
    `Premium Hedera agent brief: ${input.topic}`,
    "",
    "Recommended architecture:",
    "1. Run Hedera Agent Kit MCP as the chain-tool server for account, token, and HCS actions.",
    "2. Put paid user-facing tools behind a 402-style HBAR gate with short-lived memos.",
    "3. Log accepted receipts and resulting agent decisions to an HCS topic for reviewer auditability.",
    "4. Keep RETURN_BYTE mode available for high-risk actions so users can inspect and sign.",
    "",
    `Risk posture: ${tolerance}`,
  ].join("\n");
}
