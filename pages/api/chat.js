import { readConfig } from '../../lib/storage';
import { detectIntent, scoreLead, getIndustryConfig } from '../../lib/industries';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, sessionId } = req.body;
    const config = readConfig();
    const apiKey = process.env.GEMINI_API_KEY;
    const industry = getIndustryConfig(config.industry || 'professional');

    if (!apiKey) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const history = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const systemPrompt = buildSystemPrompt(config, industry);

    const requestBody = {
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood. I am ready to assist as a professional sales AI.' }] },
        ...history
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 400,
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error('Gemini error:', data.error);
      return res.status(500).json({ 
        reply: "I'm having trouble connecting right now. Please leave your email and I'll have a team member reach out within 24 hours.",
        error: true
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I'm having trouble right now. Please share your email or WhatsApp so our team can reach you directly.";

    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const intent = lastUserMessage ? detectIntent(lastUserMessage.content, config.industry) : { primary: 'general', needsHuman: false };

    const leadData = extractLeadData(messages, reply);
    const leadScore = scoreLead(leadData);

    res.status(200).json({ 
      reply, 
      intent,
      leadData,
      leadScore,
      sessionId
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      reply: "I'm experiencing a brief technical issue. Please share your contact details and our team will reach out directly.",
      error: true
    });
  }
}

function buildSystemPrompt(config, industry) {
  const services = config.services?.map(s => `- ${s.name}: ${s.description} (${s.price || 'Price on request'})`).join('\n') || 'Contact us for service details.';
  const faq = config.faq?.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n') || '';
  
  return `You are the AI Sales Assistant for ${config.businessName}.

BUSINESS INFO:
- Name: ${config.businessName}
- Industry: ${industry.name}
- Description: ${config.description}
- Website: ${config.website}
- Email: ${config.email}
- Phone: ${config.phone || 'Not provided'}
- Hours: ${config.hours}
- Locations: ${config.locations?.join(', ') || 'Contact for locations'}

SERVICES:
${services}

APPROVED FAQ:
${faq}

YOUR ROLE:
- Qualify leads by understanding their needs, budget, timeline, and contact info
- Answer questions using ONLY the approved business info above
- Never invent prices, policies, guarantees, or availability
- If you don't know something, say: "I don't have a confirmed answer for that. I can pass your question to a team member."
- Ask ONE question at a time
- Keep responses concise (2-3 sentences max)
- Be ${config.tone || 'professional'} and helpful
- Offer to connect with a human at any time
- Never pretend to be human
- Never claim a sale, booking, or approval is complete

CONVERSATION FLOW:
1. Greet warmly
2. Understand their intent (information, pricing, booking, complaint)
3. Ask qualifying questions one at a time
4. Capture: name, contact, need, budget, timeline
5. Score the lead (hot/warm/cold)
6. Offer next steps (appointment, human handoff, resources)

HUMAN HANDOFF TRIGGERS:
- Visitor asks for human
- Complaint or anger detected
- Legal, medical, financial, or contractual question
- Negotiation or special exception request
- Information not in approved knowledge base

APPOINTMENT BOOKING:
- Only offer booking if appointment link is configured
- Confirm details before suggesting a booking
- Use this link if available: ${config.appointmentLink || '[booking link not configured]'}

ESCALATION EMAIL: ${config.escalationEmail || config.email}

LANGUAGES: ${config.languages?.join(', ') || 'English'}

IMPORTANT: End every response with a question or clear next step until the conversation is complete.`;
}

function extractLeadData(messages, lastReply) {
  const fullText = messages.map(m => m.content).join(' ') + ' ' + lastReply;
  const text = fullText.toLowerCase();
  
  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = fullText.match(/[\+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}/);
  
  let name = null;
  const nameMatch = fullText.match(/(?:my name is|i'm|i am|call me|this is)\s+([A-Z][a-zA-Z\s]{1,30})/i);
  if (nameMatch) name = nameMatch[1].trim();
  
  let budget = null;
  const budgetMatch = fullText.match(/(?:budget|around|about|spending|looking to spend)\s*[\$]?\s*([0-9,]+[KkMm]?|[0-9]+\s*(thousand|million|k|m)?)/i);
  if (budgetMatch) budget = budgetMatch[0];
  
  let timeline = null;
  if (text.includes('immediately') || text.includes('asap') || text.includes('right now')) timeline = 'Immediately';
  else if (text.includes('1 month') || text.includes('this month') || text.includes('within a month')) timeline = 'Within 1 month';
  else if (text.includes('3 month') || text.includes('few months')) timeline = '1-3 months';
  else if (text.includes('6 month') || text.includes('half year')) timeline = '3-6 months';
  else if (text.includes('just looking') || text.includes('exploring') || text.includes('research')) timeline = 'Just exploring';
  
  let goal = null;
  if (text.includes('buy') || text.includes('purchase')) goal = 'Buy';
  else if (text.includes('rent') || text.includes('lease')) goal = 'Rent';
  else if (text.includes('invest')) goal = 'Invest';
  else if (text.includes('sell')) goal = 'Sell';
  else if (text.includes('book') || text.includes('appointment') || text.includes('viewing')) goal = 'Book appointment';
  else if (text.includes('price') || text.includes('cost') || text.includes('quote')) goal = 'Pricing inquiry';
  
  return {
    name,
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    budget,
    timeline,
    goal,
    appointmentRequested: text.includes('book') || text.includes('appointment') || text.includes('viewing') || text.includes('schedule'),
    humanRequested: text.includes('human') || text.includes('person') || text.includes('speak to') || text.includes('talk to') || text.includes('call me')
  };
}
