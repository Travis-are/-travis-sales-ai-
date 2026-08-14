import { readConfig, saveConfig } from '../../lib/storage';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const config = readConfig();
    return res.status(200).json(config);
  }
  
  if (req.method === 'POST') {
    const config = req.body;
    saveConfig(config);
    return res.status(200).json({ success: true, config });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}
