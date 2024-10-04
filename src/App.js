import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch('/toys.html')
      .then(response => response.text())
      .then(data => setHtmlContent(data))
      .catch(error => console.error('Error fetching toys.html:', error));
  }, []);

  return (
    <div className="App">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}

export default App;
