import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [config, setConfig] = useState(null);
  const [leads, setLeads] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [configRes, leadsRes, convRes] = await Promise.all([
        fetch('/api/config'),
        fetch('/api/leads'),
        fetch('/api/conversations')
      ]);
      const configData = await configRes.json();
      const leadsData = await leadsRes.json();
      const convData = await convRes.json();
      setConfig(configData);
      setLeads(leadsData);
      setConversations(convData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalLeads: leads.length,
    hot: leads.filter(l => l.status === 'HOT').length,
    warm: leads.filter(l => l.status === 'WARM').length,
    cold: leads.filter(l => l.status === 'COLD').length,
    today: leads.filter(l => {
      const d = new Date(l.createdAt);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    }).length
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-text">Loading Travis AI Sales Assistant...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">TP</div>
          <div className="logo-text">Travis Prompt AI</div>
        </div>
        <nav className="nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <span>📊</span> Dashboard
          </button>
          <button className={`nav-item ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')}>
            <span>👥</span> Leads
          </button>
          <button className={`nav-item ${activeTab === 'conversations' ? 'active' : ''}`} onClick={() => setActiveTab('conversations')}>
            <span>💬</span> Conversations
          </button>
          <button className={`nav-item ${activeTab === 'config' ? 'active' : ''}`} onClick={() => setActiveTab('config')}>
            <span>⚙️</span> Configuration
          </button>
          <button className={`nav-item ${activeTab === 'embed' ? 'active' : ''}`} onClick={() => setActiveTab('embed')}>
            <span>🔗</span> Embed Code
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="status-badge">
            <span className="status-dot"></span>
            System Online
          </div>
        </div>
      </aside>

      <main className="main">
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <h1>Dashboard</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.totalLeads}</div>
                <div className="stat-label">Total Leads</div>
              </div>
              <div className="stat-card hot">
                <div className="stat-value">{stats.hot}</div>
                <div className="stat-label">Hot Leads</div>
              </div>
              <div className="stat-card warm">
                <div className="stat-value">{stats.warm}</div>
                <div className="stat-label">Warm Leads</div>
              </div>
              <div className="stat-card cold">
                <div className="stat-value">{stats.cold}</div>
                <div className="stat-label">Cold Leads</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.today}</div>
                <div className="stat-label">Today</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{conversations.length}</div>
                <div className="stat-label">Conversations</div>
              </div>
            </div>

            <div className="section">
              <h2>Recent Leads</h2>
              {leads.length === 0 ? (
                <div className="empty-state">
                  <p>No leads captured yet.</p>
                  <p>Share your embed code with clients to start collecting leads.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Goal</th>
                        <th>Status</th>
                        <th>Score</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.slice(-10).reverse().map((lead) => (
                        <tr key={lead.id}>
                          <td>{lead.name || 'Unknown'}</td>
                          <td>{lead.email || '-'}</td>
                          <td>{lead.goal || '-'}</td>
                          <td><span className={`badge ${lead.status?.toLowerCase()}`}>{lead.status || 'COLD'}</span></td>
                          <td>{lead.score || 0}</td>
                          <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="tab-content">
            <h1>All Leads</h1>
            {leads.length === 0 ? (
              <div className="empty-state">
                <p>No leads yet. Deploy your chatbot to start capturing leads.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Goal</th>
                      <th>Budget</th>
                      <th>Timeline</th>
                      <th>Status</th>
                      <th>Score</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.slice().reverse().map((lead) => (
                      <tr key={lead.id}>
                        <td>{lead.name || 'Unknown'}</td>
                        <td>{lead.email || lead.phone || '-'}</td>
                        <td>{lead.goal || '-'}</td>
                        <td>{lead.budget || '-'}</td>
                        <td>{lead.timeline || '-'}</td>
                        <td><span className={`badge ${lead.status?.toLowerCase()}`}>{lead.status || 'COLD'}</span></td>
                        <td>{lead.score || 0}</td>
                        <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'conversations' && (
          <div className="tab-content">
            <h1>Conversations</h1>
            <div className="empty-state">
              <p>Conversation review coming in the next update.</p>
              <p>Lead data is already being captured automatically.</p>
            </div>
          </div>
        )}

        {activeTab === 'config' && <ConfigPanel config={config} onSave={loadData} />}

        {activeTab === 'embed' && <EmbedPanel />}
      </main>

      <style jsx>{`
        .app {
          display: flex;
          min-height: 100vh;
          background: #0a0a0a;
          color: #f0f0f0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #0a0a0a;
          color: #888;
        }
        .loading-text {
          font-size: 18px;
        }

        .sidebar {
          width: 260px;
          background: #111;
          border-right: 1px solid #222;
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          z-index: 100;
        }
        @media (max-width: 768px) {
          .sidebar { display: none; }
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #222;
        }
        .logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #e8e8e8;
          color: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }
        .logo-text {
          font-size: 16px;
          font-weight: 600;
        }
        .nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
        }
        .nav-item:hover {
          background: #1a1a1a;
          color: #f0f0f0;
        }
        .nav-item.active {
          background: #1c1c1c;
          color: #f0f0f0;
          border: 1px solid #333;
        }
        .sidebar-footer {
          padding-top: 16px;
          border-top: 1px solid #222;
        }
        .status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #666;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #27ae60;
        }

        .main {
          flex: 1;
          margin-left: 260px;
          padding: 32px;
          max-width: calc(100vw - 260px);
        }
        @media (max-width: 768px) {
          .main { margin-left: 0; max-width: 100vw; padding: 20px; }
        }

        .tab-content h1 {
          font-size: 28px;
          margin-bottom: 24px;
          font-weight: 600;
        }
        .tab-content h2 {
          font-size: 18px;
          margin-bottom: 16px;
          color: #aaa;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .stat-card {
          background: #141414;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 20px;
        }
        .stat-card.hot { border-color: #e74c3c; }
        .stat-card.warm { border-color: #f39c12; }
        .stat-card.cold { border-color: #3498db; }
        .stat-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 13px;
          color: #888;
        }

        .section {
          margin-top: 32px;
        }
        .empty-state {
          background: #141414;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          color: #666;
        }
        .empty-state p {
          margin: 8px 0;
        }

        .table-container {
          overflow-x: auto;
          background: #141414;
          border: 1px solid #222;
          border-radius: 12px;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .data-table th {
          text-align: left;
          padding: 12px 16px;
          color: #888;
          font-weight: 500;
          border-bottom: 1px solid #222;
          white-space: nowrap;
        }
        .data-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #1a1a1a;
          color: #ccc;
        }
        .data-table tr:hover td {
          background: #1a1a1a;
        }
        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .badge.hot { background: rgba(231, 76, 60, 0.15); color: #e74c3c; }
        .badge.warm { background: rgba(243, 156, 18, 0.15); color: #f39c12; }
        .badge.cold { background: rgba(52, 152, 219, 0.15); color: #3498db; }
      `}</style>
    </div>
  );
}

function ConfigPanel({ config, onSave }) {
  const [form, setForm] = useState(config || {});
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setSaved(true);
    onSave();
    setTimeout(() => setSaved(false), 3000);
  };

  const industries = [
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'hospitality', label: 'Hotels & Hospitality' },
    { value: 'clinic', label: 'Clinic & Wellness' },
    { value: 'school', label: 'Schools & Training' },
    { value: 'ecommerce', label: 'E-Commerce' },
    { value: 'professional', label: 'Professional Services' }
  ];

  return (
    <div className="tab-content">
      <h1>Business Configuration</h1>
      
      <div className="form-card">
        <div className="form-grid">
          <div className="form-group">
            <label>Business Name</label>
            <input 
              type="text" 
              value={form.businessName || ''} 
              onChange={e => setForm({...form, businessName: e.target.value})}
              placeholder="Your Business Name"
            />
          </div>
          
          <div className="form-group">
            <label>Industry</label>
            <select 
              value={form.industry || 'professional'} 
              onChange={e => setForm({...form, industry: e.target.value})}
            >
              {industries.map(i => (
                <option key={i.value} value={i.value}>{i.label}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group full">
            <label>Description</label>
            <textarea 
              value={form.description || ''} 
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder="What does your business do?"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label>Website</label>
            <input 
              type="text" 
              value={form.website || ''} 
              onChange={e => setForm({...form, website: e.target.value})}
              placeholder="https://yoursite.com"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={form.email || ''} 
              onChange={e => setForm({...form, email: e.target.value})}
              placeholder="hello@yourbusiness.com"
            />
          </div>
          
          <div className="form-group">
            <label>Phone</label>
            <input 
              type="text" 
              value={form.phone || ''} 
              onChange={e => setForm({...form, phone: e.target.value})}
              placeholder="+1 234 567 890"
            />
          </div>
          
          <div className="form-group">
            <label>Business Hours</label>
            <input 
              type="text" 
              value={form.hours || ''} 
              onChange={e => setForm({...form, hours: e.target.value})}
              placeholder="Mon-Fri 9AM-6PM"
            />
          </div>
          
          <div className="form-group">
            <label>Escalation Email</label>
            <input 
              type="email" 
              value={form.escalationEmail || ''} 
              onChange={e => setForm({...form, escalationEmail: e.target.value})}
              placeholder="team@yourbusiness.com"
            />
          </div>
          
          <div className="form-group">
            <label>Appointment Booking Link</label>
            <input 
              type="text" 
              value={form.appointmentLink || ''} 
              onChange={e => setForm({...form, appointmentLink: e.target.value})}
              placeholder="https://calendly.com/your-link"
            />
          </div>
          
          <div className="form-group">
            <label>Tone</label>
            <select 
              value={form.tone || 'professional'} 
              onChange={e => setForm({...form, tone: e.target.value})}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="luxury">Luxury / Premium</option>
              <option value="casual">Casual</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button className="btn-primary" onClick={handleSave}>
            {saved ? '✓ Saved!' : 'Save Configuration'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .form-card {
          background: #141414;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 24px;
          max-width: 800px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr; }
        }
        .form-group.full {
          grid-column: 1 / -1;
        }
        .form-group label {
          display: block;
          font-size: 13px;
          color: #888;
          margin-bottom: 6px;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #333;
          background: #0a0a0a;
          color: #f0f0f0;
          font-size: 14px;
          font-family: inherit;
          outline: none;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #555;
        }
        .form-actions {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #222;
        }
        .btn-primary {
          padding: 10px 24px;
          border-radius: 8px;
          border: none;
          background: #e8e8e8;
          color: #0a0a0a;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-primary:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}

function EmbedPanel() {
  const [copied, setCopied] = useState(false);
  
  const embedCode = `<!-- Travis AI Sales Assistant -->
<iframe 
  src="${typeof window !== 'undefined' ? window.location.origin : ''}/embed" 
  width="100%" 
  height="600" 
  style="border:none;border-radius:16px;"
  title="AI Assistant"
></iframe>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="tab-content">
      <h1>Embed Code</h1>
      <p style={{color: '#888', marginBottom: '20px'}}>
        Copy this code and paste it into any website to add your AI sales assistant.
      </p>
      
      <div className="embed-card">
        <div className="embed-header">
          <span>HTML Embed Code</span>
          <button className="copy-btn" onClick={copyCode}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="embed-code">{embedCode}</pre>
      </div>
      
      <div style={{marginTop: '24px', color: '#888', fontSize: '14px'}}>
        <p><strong>Direct link:</strong> <a href="/embed" target="_blank" style={{color: '#aaa'}}>/embed</a></p>
        <p style={{marginTop: '8px'}}>Share this link with clients who want to test the chatbot.</p>
      </div>

      <style jsx>{`
        .embed-card {
          background: #141414;
          border: 1px solid #222;
          border-radius: 12px;
          overflow: hidden;
          max-width: 800px;
        }
        .embed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #1a1a1a;
          border-bottom: 1px solid #222;
          font-size: 13px;
          color: #888;
        }
        .copy-btn {
          padding: 6px 14px;
          border-radius: 6px;
          border: 1px solid #444;
          background: transparent;
          color: #aaa;
          font-size: 13px;
          cursor: pointer;
        }
        .copy-btn:hover {
          background: #2a2a2a;
          color: #f0f0f0;
        }
        .embed-code {
          padding: 16px;
          margin: 0;
          font-size: 13px;
          line-height: 1.6;
          color: #aaa;
          overflow-x: auto;
          font-family: monospace;
          white-space: pre-wrap;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}
