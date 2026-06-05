import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createHederaMcpToolkit } from "./hedera.js";

const server = createHederaMcpToolkit();
const transport = new StdioServerTransport();
await server.connect(transport);
