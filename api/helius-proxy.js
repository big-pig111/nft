export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tokenAddress } = req.body;

    if (!tokenAddress) {
      return res.status(400).json({ error: 'Token address is required' });
    }

    const heliusUrl = "https://api.helius.xyz/v0/transactions/search?api-key=17d82c3f-fbe0-451c-a882-70de20ad4162";

    const body = {
      jsonrpc: "2.0",
      id: "getTokenTransactions",
      method: "searchTransactions",
      params: {
        "query": {
          "rawTokenTransfers": {
            "mint": tokenAddress
          }
        },
        "options": {
          "limit": 20,
          "sort": "desc"
        }
      }
    };

    const response = await fetch(heliusUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
}