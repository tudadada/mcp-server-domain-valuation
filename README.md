# mcp-server-domain-valuation

[![npm version](https://img.shields.io/npm/v/mcp-server-domain-valuation.svg)](https://www.npmjs.com/package/mcp-server-domain-valuation)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Protocol-blue)](https://modelcontextprotocol.io)

Model Context Protocol (MCP) server for enterprise domain valuation, liquid value modeling, and market multiple analytics.

---

## ⚡ Features & Tools

- **`calculate_domain_valuation`**: Calculates deep financial valuation model for a domain name based on TLD tier, character length, commercial liquid floor, and enterprise upside.
- **`compare_sales_multipliers`**: Returns market valuation multiples across top TLDs (.com, .ai, .io, .org, ccTLDs) based on historical secondary market liquidity.

---

## 🚀 Quick Start (Running with AI Clients)

### Claude Desktop Integration

Add this snippet to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "domain-valuation": {
      "command": "npx",
      "args": ["-y", "mcp-server-domain-valuation"]
    }
  }
}
```

### Cursor IDE / Windsurf Integration

Under MCP Settings, add a new stdio transport:
- **Command:** `npx -y mcp-server-domain-valuation`

---

## 📦 Local Installation & Development

```bash
npm install -g mcp-server-domain-valuation
```

Or run directly via stdio:
```bash
npx mcp-server-domain-valuation
```

---

## 📄 License

MIT License. Developed for the global AI agent and domain ecosystem.
