import React, { useState } from 'react';

const PasswordModal = ({ onClose, onSubmit, episode }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.toUpperCase() === episode.requiredPassword) {
      onSubmit();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm z-[100]">
      <div className="bg-gray-800/90 p-6 rounded-xl border border-gray-700/50 w-80 text-center font-cairo">
        <h2 className="text-xl font-bold text-white mb-2">
          Section {episode.number} Locked
        </h2>
        <p className="text-sm text-gray-300 mb-6">
          Enter password to unlock it
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full bg-gray-900/50 text-white px-4 py-2 rounded-lg border ${
              error ? 'border-red-500' : 'border-gray-700'
            } focus:outline-none focus:border-indigo-500 text-center uppercase`}
            placeholder="Enter Password"
            autoFocus
          />
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm transition-colors duration-200"
            >
              Unlock
            </button>
          </div>
        </form>

        {error && (
          <p className="text-red-500 text-sm mt-4 animate-fade-in">
            Incorrect password. Try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default PasswordModal; 