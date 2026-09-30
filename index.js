#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";



function calculateValuation(domain) {
  const clean = domain.trim().toLowerCase();
  const parts = clean.split('.');
  if (parts.length < 2) return { error: 'Invalid domain name format.' };
  const sld = parts[0];
  const tld = parts.slice(1).join('.');
  
  let baseScore = 50;
  if (sld.length <= 3) baseScore += 45;
  else if (sld.length <= 5) baseScore += 30;
  else if (sld.length <= 8) baseScore += 15;
  else if (sld.length > 15) baseScore -= 20;

  if (sld.includes('-')) baseScore -= 25;
  if (/\d/.test(sld)) baseScore -= 15;

  const tldWeights = { com: 1.0, ai: 0.85, io: 0.6, net: 0.35, org: 0.4, xyz: 0.25, co: 0.35, tech: 0.2 };
  const weight = tldWeights[tld] || 0.15;
  const finalScore = Math.max(5, Math.min(100, Math.round(baseScore * weight)));

  let wholesaleFloor = Math.round(Math.pow(finalScore, 2.1) * weight);
  let enterpriseVal = wholesaleFloor * 4.5;

  return {
    domain: clean,
    valuation_score: finalScore,
    tld_tier: tld === 'com' ? 'Tier 1 (Global Gold Standard)' : tld === 'ai' ? 'Tier 1 (High AI Premium)' : 'Tier 2/3 Generic',
    estimated_wholesale_floor_usd: wholesaleFloor,
    estimated_enterprise_retail_usd: Math.round(enterpriseVal),
    liquidity_rating: finalScore > 70 ? 'High' : finalScore > 40 ? 'Moderate' : 'Speculative',
    recommendation: finalScore > 65 ? 'Core Investment Grade' : 'Hold / Selective Outbound'
  };
}

function getMultipliers(tld) {
  const cleanTld = tld.replace(/^\./, '').toLowerCase();
  const table = {
    com: { multiplier: '1.0x (Baseline)', liquidity: 'Very High', secondaryMarketShare: '70%+', notes: 'Universal trust and lowest friction for global enterprise buyers.' },
    ai: { multiplier: '0.85x', liquidity: 'Surging', secondaryMarketShare: '15%', notes: 'Strong premium driven by tech startups and venture capital.' },
    io: { multiplier: '0.60x', liquidity: 'Stable', secondaryMarketShare: '5%', notes: 'Developer ecosystem favourite, slight geopolitical tail-risk.' },
    net: { multiplier: '0.35x', liquidity: 'Moderate', secondaryMarketShare: '3%', notes: 'Legacy infrastructure fallback.' },
    org: { multiplier: '0.40x', liquidity: 'Moderate', secondaryMarketShare: '3%', notes: 'Best suited for non-profits, foundations, and community projects.' }
  };
  return table[cleanTld] || { multiplier: '0.15x', liquidity: 'Low', secondaryMarketShare: '<1%', notes: 'Niche or alternative gTLD.' };
}


const server = new Server(
  {
    name: "mcp-server-domain-valuation",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const TOOLS = [
      {
            "name": "calculate_domain_valuation",
            "description": "Calculates deep financial valuation model for a domain name based on TLD tier, character length, commercial liquid floor, and enterprise upside.",
            "inputSchema": {
                  "type": "object",
                  "properties": {
                        "domain": {
                              "type": "string",
                              "description": "The domain name to evaluate (e.g. cloudcompute.com)"
                        }
                  },
                  "required": [
                        "domain"
                  ]
            }
      },
      {
            "name": "compare_sales_multipliers",
            "description": "Returns market valuation multiples across top TLDs (.com, .ai, .io, .org, ccTLDs) based on historical secondary market liquidity.",
            "inputSchema": {
                  "type": "object",
                  "properties": {
                        "tld": {
                              "type": "string",
                              "description": "The top-level domain without dot (e.g. com, ai, io)"
                        }
                  },
                  "required": [
                        "tld"
                  ]
            }
      }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {

    if (name === 'calculate_domain_valuation') {
      const res = calculateValuation(args.domain);
      return { content: [{ type: 'text', text: JSON.stringify(res, null, 2) }] };
    }

    if (name === 'compare_sales_multipliers') {
      const res = getMultipliers(args.tld);
      return { content: [{ type: 'text', text: JSON.stringify(res, null, 2) }] };
    }
    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Error: ${error.message}` }],
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch((err) => {
  process.exit(1);
});
