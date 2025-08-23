// src/components/NotificationPrompt.jsx
import React, { useState, useEffect } from 'react';

export default function NotificationPrompt() {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  useEffect(() => {
    if (typeof Notification === 'undefined') setPermission('unsupported');
  }, []);

  async function handleEnable(e) {
    e.preventDefault();
    if (typeof Notification === 'undefined') {
      alert('This browser does not support Notifications.');
      return;
    }
    if (!window.isSecureContext) {
      alert('Notifications require HTTPS or localhost.');
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      console.log('Permission result:', perm); // check console
      setPermission(perm);

      if (perm === 'granted') {
        // optional immediate test notification
        new Notification('Thanks — Notifications enabled!');
      } else if (perm === 'denied') {
        alert('You denied notifications. Change site settings to re-enable.');
      } else {
        console.log('Permission dismissed (default).');
      }
    } catch (err) {
      console.error('requestPermission failed:', err);
    }
  }

  if (permission === 'unsupported') return <div>Notifications not supported.</div>;

  return (
    <div>
      {permission === 'default' && <button onClick={handleEnable}>Enable notifications</button>}
      {permission === 'granted' && <p>Notifications enabled ✅</p>}
      {permission === 'denied' && <button onClick={handleEnable}>Enable notification for better services.</button>}
    </div>
  );
}
