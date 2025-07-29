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

  // Allow both GET and POST for testing
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 返回测试数据
    const testData = {
      success: true,
      message: "API 服务器端函数工作正常！",
      timestamp: new Date().toISOString(),
      method: req.method,
      body: req.body || null,
      headers: req.headers
    };

    console.log('Test API called successfully');
    res.status(200).json(testData);
  } catch (error) {
    console.error('Test API error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}