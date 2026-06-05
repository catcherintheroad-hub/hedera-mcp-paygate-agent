# Hedera AI Agent Bounty Submission Notes

## Target bounty

- Week 3 theme: MCP or x402 Agent
- Prize: $1,000 in HBAR
- Deadline: 2026-06-07 23:59 UTC

## What this project demonstrates

- A custom MCP server with a premium tool gated behind a 402-style Hedera HBAR payment requirement.
- A separate live Hedera Agent Kit MCP server entry point using `@hashgraph/hedera-agent-kit-mcp`.
- A demo receipt verifier that can be replaced with Mirror Node transaction lookup for production.
- A premium agent brief tool that recommends Hedera Agent Kit MCP, RETURN_BYTE mode, and HCS audit logging.

## Public links

- GitHub repo: https://github.com/catcherintheroad-hub/hedera-mcp-paygate-agent
- CI proof: https://github.com/catcherintheroad-hub/hedera-mcp-paygate-agent/actions/runs/27016703654
- Feedback link: https://github.com/hashgraph/hedera-agent-kit-js/issues/894#issuecomment-4631822644
- Demo URL: https://github.com/catcherintheroad-hub/hedera-mcp-paygate-agent#quick-demo

## Demo commands

```bash
npm install
npm run check
npm run demo
```

Run the custom MCP paygate server:

```bash
npm run build
npm start
```

Run the official Hedera Agent Kit MCP server after setting `.env`:

```bash
cp .env.example .env
# set HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY
npm run start:hedera
```

## Feedback for Hedera Agent Kit

The kit has a clean MCP wrapper, but bounty builders would benefit from an official payment-gated MCP example that combines:

- `HederaMCPToolkit`
- a Mirror Node receipt verifier
- a 402/x402 payment requirement schema
- HCS audit logging for accepted paid tool calls

This project keeps that composition explicit so reviewers can see the missing production seam clearly.
