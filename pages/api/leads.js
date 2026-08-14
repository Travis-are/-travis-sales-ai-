import { readLeads, saveLead, updateLead } from '../../lib/storage';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const leads = readLeads();
    return res.status(200).json(leads);
  }
  
  if (req.method === 'POST') {
    const lead = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    saveLead(lead);
    return res.status(200).json({ success: true, lead });
  }
  
  if (req.method === 'PUT') {
    const { id, ...updates } = req.body;
    const lead = updateLead(id, updates);
    return res.status(200).json({ success: true, lead });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}
