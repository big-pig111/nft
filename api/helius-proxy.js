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

    console.log('Processing request for token:', tokenAddress);

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

    console.log('Sending request to Helius API...');

    // 使用 node-fetch 或确保 fetch 可用
    let response;
    try {
      response = await fetch(heliusUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "User-Agent": "Vercel-Serverless-Function/1.0"
        },
        body: JSON.stringify(body)
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return res.status(500).json({ 
        error: 'Failed to connect to Helius API',
        details: fetchError.message 
      });
    }

    console.log('Helius API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Helius API error response:', errorText);
      throw new Error(`Helius API error: ${response.status} - ${response.statusText}. Response: ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully received data from Helius API');
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}