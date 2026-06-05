import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { buildPremiumBrief } from "./brief.js";
import { loadConfig } from "./config.js";
import { PaymentGate } from "./paymentGate.js";

export function createPaygateServer() {
  const config = loadConfig();
  const gate = new PaymentGate(
    config.paymentAccountId,
    config.accessPriceUsd,
    config.hederaNetwork === "mainnet" ? "hedera-mainnet" : "hedera-testnet",
  );

  const server = new McpServer({
    name: "hedera-mcp-paygate-agent",
    version: "0.1.0",
  });

  server.tool(
    "quote_access",
    "Return a 402-style Hedera HBAR payment requirement for a premium MCP tool.",
    {
      agentTask: z.string().min(3).describe("The premium task the caller wants to unlock."),
    },
    async ({ agentTask }) => ({
      content: [{ type: "text", text: JSON.stringify(gate.quote(agentTask), null, 2) }],
    }),
  );

  server.tool(
    "verify_demo_payment",
    "Record a demo Hedera payment receipt. Replace this with Mirror Node verification for production.",
    {
      memo: z.string().describe("Memo from quote_access."),
      txId: z.string().optional().describe("Optional Hedera transaction id."),
      payer: z.string().optional().describe("Optional payer account id."),
    },
    async (input) => ({
      content: [{ type: "text", text: JSON.stringify(gate.verifyDemoPayment(input), null, 2) }],
    }),
  );

  server.tool(
    "premium_hbar_risk_brief",
    "Generate a gated architecture/risk brief for a Hedera agent workflow.",
    {
      receiptId: z.string().optional(),
      topic: z.string().min(3),
      riskTolerance: z.enum(["low", "medium", "high"]).default("medium"),
    },
    async ({ receiptId, topic, riskTolerance }) => {
      const decision = gate.require(receiptId, topic);
      if (!decision.allowed) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  status: 402,
                  message: "Payment required before running premium_hbar_risk_brief.",
                  payment: decision.requirement,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      return {
        content: [{ type: "text", text: buildPremiumBrief({ topic, riskTolerance }) }],
      };
    },
  );

  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = createPaygateServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
