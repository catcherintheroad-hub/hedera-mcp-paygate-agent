# Hedera MCP Paygate Agent

An MCP/x402-style paid agent demo for the Hedera AI Agent Bounty.

The project has two entry points:

- `npm start` runs a custom MCP server with a premium tool behind a 402-style HBAR payment requirement.
- `npm run start:hedera` runs the official `@hashgraph/hedera-agent-kit-mcp` toolkit with core account, token, and consensus plugins.

The custom MCP server exposes:

- `quote_access` - returns a Hedera payment requirement with payee, amount, memo, network, and expiry.
- `verify_demo_payment` - records a demo receipt for the memo. In production this becomes Mirror Node transaction verification.
- `premium_hbar_risk_brief` - a gated premium tool that returns Hedera agent architecture and risk guidance only after a receipt exists.

## Quick Demo

```bash
npm install
npm run check
npm run demo
```

CI proof:

- https://github.com/catcherintheroad-hub/hedera-mcp-paygate-agent/actions/runs/27016703654

Feedback link:

- https://github.com/hashgraph/hedera-agent-kit-js/issues/894#issuecomment-4631822644

Demo output:

```text
402 payment requirement:
{
  "scheme": "hedera-hbar-demo-x402",
  "network": "hedera-testnet",
  "payTo": "0.0.demo-payee",
  "amountUsd": "1.00",
  "amountHbar": "16.6667",
  "memo": "hpg:agent-treasury-risk-brie:<timestamp>",
  "expiresAt": "<10-minute expiry>"
}

Accepted receipt:
{
  "receiptId": "receipt_aHBnOmFnZW50LXRyZW",
  "memo": "hpg:agent-treasury-risk-brie:<timestamp>",
  "txId": "0.0.123@1780660000.000000001",
  "createdAt": "<timestamp>"
}

Unlocked premium brief:
Premium Hedera agent brief: agent treasury risk brief
```

## Live Hedera Tools

Create a `.env` file from `.env.example` and provide a Hedera testnet operator:

```bash
cp .env.example .env
```

Then run:

```bash
npm run build
npm run start:hedera
```

## Why This Fits The Bounty

The bounty asks for an MCP or x402 agent using Hedera Agent Kit. This project combines both ideas:

- MCP is the agent interface.
- Hedera Agent Kit MCP is wired as the chain-tool server.
- A 402-style HBAR gate controls premium user-facing tools.
- The architecture is ready for Mirror Node verification and HCS audit logging.

## Production Next Steps

- Replace `verify_demo_payment` with Mirror Node transaction lookup by memo and payee.
- Submit accepted paid tool calls to an HCS topic.
- Add signed x402 headers for HTTP transports.
- Switch high-risk actions to Hedera Agent Kit `RETURN_BYTE` mode.
