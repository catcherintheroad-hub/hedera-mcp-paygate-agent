import { Client, PrivateKey } from "@hiero-ledger/sdk";
import { HederaMCPToolkit } from "@hashgraph/hedera-agent-kit-mcp";
import {
  coreAccountPlugin,
  coreConsensusPlugin,
  coreTokenPlugin,
} from "@hashgraph/hedera-agent-kit/plugins";
import { loadConfig } from "./config.js";

export function createHederaClientFromEnv(): Client {
  const config = loadConfig();
  if (!config.hederaAccountId || !config.hederaPrivateKey) {
    throw new Error("Set HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY to enable live Hedera MCP tools.");
  }

  const client = config.hederaNetwork === "mainnet" ? Client.forMainnet() : Client.forTestnet();
  client.setOperator(config.hederaAccountId, PrivateKey.fromString(config.hederaPrivateKey));
  return client;
}

export function createHederaMcpToolkit(): HederaMCPToolkit {
  return new HederaMCPToolkit({
    client: createHederaClientFromEnv(),
    configuration: {
      plugins: [coreAccountPlugin, coreConsensusPlugin, coreTokenPlugin],
    },
  });
}
