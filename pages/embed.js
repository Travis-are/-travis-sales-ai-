import ChatWidget from '../components/ChatWidget';
import { useEffect, useState } from 'react';

export default function Embed() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: '#0a0a0a',
        color: '#888'
      }}>
        Loading AI Assistant...
      </div>
    );
  }

  return (
    <div style={{ background: '#0a0a0a', height: '100vh' }}>
      <ChatWidget 
        embedded={true}
        businessName={config?.businessName || 'Travis Prompt AI'}
        industry={config?.industry || 'professional'}
        greeting={config?.greeting}
        config={config}
      />
    </div>
  );
}
