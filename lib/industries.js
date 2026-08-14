export const INDUSTRIES = {
  real_estate: {
    name: 'Real Estate',
    greeting: "Hello, I'm the AI assistant for {businessName}. I can help you find properties, answer questions, schedule viewings, and connect you with our team. What can I help you with today?",
    quickReplies: [
      'Property availability',
      'Price request',
      'Book a viewing',
      'Location info',
      'Speak to a human'
    ],
    intentKeywords: {
      pricing: ['price', 'cost', 'how much', 'budget', 'afford', 'expensive', 'cheap', 'fee', 'payment'],
      viewing: ['viewing', 'tour', 'see', 'visit', 'show me', 'look at', 'inspect'],
      availability: ['available', 'in stock', 'ready', 'when can', 'is there', 'do you have'],
      location: ['where', 'location', 'area', 'city', 'address', 'near', 'close to'],
      financing: ['mortgage', 'loan', 'finance', 'payment plan', 'installment', 'bank'],
      human: ['human', 'person', 'agent', 'consultant', 'call me', 'speak to', 'talk to', 'manager']
    },
    appointmentTypes: [
      { name: 'Property Viewing', duration: '30 min' },
      { name: 'Investment Consultation', duration: '45 min' },
      { name: 'Virtual Tour', duration: '20 min' }
    ]
  },
  hospitality: {
    name: 'Hotels & Hospitality',
    greeting: "Welcome! I'm the AI assistant for {businessName}. I can help with room availability, bookings, amenities, and special requests. How may I assist you today?",
    quickReplies: [
      'Room availability',
      'Book a room',
      'Check-in info',
      'Amenities',
      'Group booking',
      'Speak to front desk'
    ],
    intentKeywords: {
      pricing: ['price', 'rate', 'cost', 'per night', 'discount', 'offer', 'deal'],
      booking: ['book', 'reserve', 'availability', 'check in', 'check out', 'dates'],
      amenities: ['wifi', 'pool', 'gym', 'restaurant', 'breakfast', 'parking', 'spa'],
      group: ['group', 'event', 'conference', 'wedding', 'party', 'corporate'],
      human: ['human', 'manager', 'front desk', 'reception', 'call', 'speak to']
    },
    appointmentTypes: [
      { name: 'Room Reservation', duration: 'N/A' },
      { name: 'Event Consultation', duration: '30 min' },
      { name: 'VIP Tour', duration: '20 min' }
    ]
  },
  clinic: {
    name: 'Clinic & Wellness',
    greeting: "Hello, I'm the AI assistant for {businessName}. I can help with service information, appointment scheduling, and general questions. For medical emergencies, please call our urgent line. How can I help you today?",
    quickReplies: [
      'Service info',
      'Book appointment',
      'Opening hours',
      'Insurance/payment',
      'Urgent issue',
      'Speak to staff'
    ],
    intentKeywords: {
      pricing: ['price', 'cost', 'fee', 'covered', 'insurance', 'payment', 'charge'],
      appointment: ['appointment', 'book', 'schedule', 'consultation', 'session', 'visit'],
      service: ['treatment', 'therapy', 'procedure', 'checkup', 'exam', 'test', 'vaccine'],
      hours: ['hours', 'open', 'close', 'when', 'time', 'schedule', 'available'],
      urgent: ['urgent', 'emergency', 'pain', 'severe', 'bleeding', 'accident', 'now'],
      human: ['human', 'doctor', 'nurse', 'practitioner', 'speak to', 'call']
    },
    appointmentTypes: [
      { name: 'Initial Consultation', duration: '30 min' },
      { name: 'Follow-up Visit', duration: '15 min' },
      { name: 'Treatment Session', duration: '60 min' }
    ]
  },
  school: {
    name: 'Schools & Training',
    greeting: "Hi there! I'm the AI assistant for {businessName}. I can help with course information, admissions, fees, and enrollment appointments. What would you like to know?",
    quickReplies: [
      'Course info',
      'Fees & admission',
      'Book enrollment appointment',
      'Requirements',
      'Speak to admissions'
    ],
    intentKeywords: {
      pricing: ['fee', 'tuition', 'cost', 'price', 'payment', 'scholarship', 'financial aid'],
      course: ['course', 'program', 'class', 'training', 'curriculum', 'subject', 'module'],
      admission: ['admission', 'enroll', 'apply', 'register', 'sign up', 'join', 'intake'],
      requirements: ['requirement', 'prerequisite', 'qualification', 'eligible', 'criteria', 'need'],
      human: ['human', 'advisor', 'counselor', 'teacher', 'speak to', 'call']
    },
    appointmentTypes: [
      { name: 'Campus Tour', duration: '45 min' },
      { name: 'Admission Interview', duration: '30 min' },
      { name: 'Course Consultation', duration: '20 min' }
    ]
  },
  ecommerce: {
    name: 'E-Commerce',
    greeting: "Hello! I'm the AI assistant for {businessName}. I can help you find products, check availability, answer questions about orders, and connect you with our team. What are you looking for today?",
    quickReplies: [
      'Product availability',
      'Price & delivery',
      'Order support',
      'Return/refund',
      'Product recommendation',
      'Speak to support'
    ],
    intentKeywords: {
      pricing: ['price', 'cost', 'discount', 'offer', 'deal', 'sale', 'promo', 'cheap'],
      availability: ['available', 'in stock', 'ready', 'ship', 'delivery', 'when'],
      order: ['order', 'track', 'status', 'shipping', 'delivery', 'package', 'parcel'],
      return: ['return', 'refund', 'exchange', 'cancel', 'wrong', 'damaged', 'defective'],
      recommendation: ['recommend', 'suggest', 'best', 'top', 'popular', 'similar', 'compare'],
      human: ['human', 'agent', 'support', 'representative', 'speak to', 'call']
    },
    appointmentTypes: [
      { name: 'Product Demo', duration: '15 min' },
      { name: 'Bulk Order Consultation', duration: '30 min' }
    ]
  },
  professional: {
    name: 'Professional Services',
    greeting: "Hello, I'm the AI assistant for {businessName}. I can help you learn about our services, request a consultation, get a quote, and answer your questions. What brings you here today?",
    quickReplies: [
      'Service inquiry',
      'Request consultation',
      'Get a quote',
      'Project scope',
      'Speak to a consultant'
    ],
    intentKeywords: {
      pricing: ['price', 'cost', 'quote', 'fee', 'rate', 'budget', 'estimate', 'proposal'],
      consultation: ['consultation', 'meeting', 'call', 'discuss', 'talk', 'advice'],
      service: ['service', 'solution', 'help', 'support', 'assist', 'implement'],
      project: ['project', 'scope', 'requirement', 'deliverable', 'timeline', 'milestone'],
      human: ['human', 'consultant', 'expert', 'partner', 'director', 'speak to']
    },
    appointmentTypes: [
      { name: 'Discovery Call', duration: '30 min' },
      { name: 'Strategy Session', duration: '60 min' },
      { name: 'Project Review', duration: '45 min' }
    ]
  }
};

export function getIndustryConfig(industryKey) {
  return INDUSTRIES[industryKey] || INDUSTRIES.professional;
}

export function detectIntent(message, industryKey) {
  const text = message.toLowerCase();
  const industry = getIndustryConfig(industryKey);
  const keywords = industry.intentKeywords || {};
  
  const scores = {};
  for (const [intent, words] of Object.entries(keywords)) {
    scores[intent] = words.filter(w => text.includes(w)).length;
  }
  
  if (text.includes('human') || text.includes('person') || text.includes('speak to') || 
      text.includes('talk to') || text.includes('call me') || text.includes('agent') ||
      text.includes('manager') || text.includes('staff')) {
    scores.human = (scores.human || 0) + 5;
  }
  
  if (text.includes('buy') || text.includes('purchase') || text.includes('order') ||
      text.includes('get this') || text.includes('ready to') || text.includes('how do i pay')) {
    scores.buying = (scores.buying || 0) + 3;
  }
  
  if (text.includes('angry') || text.includes('frustrated') || text.includes('complaint') ||
      text.includes('terrible') || text.includes('awful') || text.includes('worst') ||
      text.includes('nobody') || text.includes('never') || text.includes('ridiculous')) {
    scores.complaint = (scores.complaint || 0) + 5;
  }
  
  if (text.includes('urgent') || text.includes('emergency') || text.includes('asap') ||
      text.includes('immediately') || text.includes('right now')) {
    scores.urgent = (scores.urgent || 0) + 4;
  }
  
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topIntent = sorted[0] && sorted[0][1] > 0 ? sorted[0][0] : 'general';
  
  return {
    primary: topIntent,
    scores,
    sentiment: text.includes('thank') || text.includes('great') || text.includes('good') ? 'positive' :
               text.includes('bad') || text.includes('hate') || text.includes('terrible') ? 'negative' : 'neutral',
    hasBuyingSignal: (scores.buying || 0) > 0,
    needsHuman: (scores.human || 0) > 0 || (scores.complaint || 0) > 0 || (scores.urgent || 0) > 0
  };
}

export function scoreLead(leadData) {
  let score = 0;
  let signals = [];
  
  if (leadData.email || leadData.phone) { score += 20; signals.push('contact_provided'); }
  if (leadData.budget && leadData.budget !== 'Prefer not to say') { score += 25; signals.push('budget_shared'); }
  if (leadData.timeline && (leadData.timeline.includes('Immediately') || leadData.timeline.includes('1 month'))) { score += 30; signals.push('urgent_timeline'); }
  if (leadData.timeline && leadData.timeline.includes('3 months')) { score += 15; signals.push('medium_timeline'); }
  if (leadData.goal && (leadData.goal.includes('buy') || leadData.goal.includes('invest') || leadData.goal.includes('book'))) { score += 20; signals.push('strong_intent'); }
  if (leadData.appointmentRequested) { score += 25; signals.push('appointment_requested'); }
  if (leadData.humanRequested) { score += 10; signals.push('human_requested'); }
  
  let status = 'COLD';
  if (score >= 60) status = 'HOT';
  else if (score >= 30) status = 'WARM';
  
  return { score, status, signals };
}
