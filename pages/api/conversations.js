import { readConversations, saveConversation } from '../../lib/storage';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const convs = readConversations();
    return res.status(200).json(convs);
  }
  
  if (req.method === 'POST') {
    const conv = req.body;
    saveConversation(conv);
    return res.status(200).json({ success: true });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}
