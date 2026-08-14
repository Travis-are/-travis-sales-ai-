import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getFilePath(filename) {
  ensureDir();
  return path.join(DATA_DIR, filename);
}

export function readJson(filename, defaultValue = []) {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) return defaultValue;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return defaultValue;
  }
}

export function writeJson(filename, data) {
  const filePath = getFilePath(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function readConfig() {
  return readJson('config.json', {
    businessName: 'Travis Prompt AI',
    industry: 'professional',
    description: 'AI solutions for business growth',
    website: 'https://travispromptai.lovable.app',
    email: 'hello@travispromptai.com',
    phone: '',
    locations: [],
    hours: 'Mon-Fri 9AM-6PM',
    tone: 'professional',
    languages: ['English'],
    appointmentLink: '',
    escalationEmail: 'hello@travispromptai.com',
    services: [],
    faq: []
  });
}

export function saveConfig(config) {
  writeJson('config.json', config);
}

export function readLeads() {
  return readJson('leads.json', []);
}

export function saveLead(lead) {
  const leads = readLeads();
  leads.push(lead);
  writeJson('leads.json', leads);
  return lead;
}

export function updateLead(id, updates) {
  const leads = readLeads();
  const idx = leads.findIndex(l => l.id === id);
  if (idx >= 0) {
    leads[idx] = { ...leads[idx], ...updates };
    writeJson('leads.json', leads);
    return leads[idx];
  }
  return null;
}

export function readConversations() {
  return readJson('conversations.json', []);
}

export function saveConversation(conv) {
  const convs = readConversations();
  const existing = convs.findIndex(c => c.id === conv.id);
  if (existing >= 0) {
    convs[existing] = conv;
  } else {
    convs.push(conv);
  }
  writeJson('conversations.json', convs);
}
