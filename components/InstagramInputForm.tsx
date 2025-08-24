
import React, { useState } from 'react';
import Card from './common/Card';

interface InstagramInputFormProps {
  onSubmit: (url: string) => void;
}

const InstagramInputForm: React.FC<InstagramInputFormProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <Card>
      <div className="text-center">
        <h2 className="text-3xl font-black text-white">Get Your Free AI Business Report</h2>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
          Enter your business Instagram profile link. Our AI will analyze it to create a custom mini-report to help you grow.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 max-w-lg mx-auto">
        <div>
          <label htmlFor="instagram-url" className="sr-only">Instagram Profile URL</label>
          <input
            id="instagram-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.instagram.com/yourusername"
            required
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-gray-200 text-center text-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
          />
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-400"
          >
            Analyze My Instagram
          </button>
        </div>
         <p className="text-xs text-gray-500 text-center mt-4">
            We use AI to understand your business from your public profile. We don't store your data or post anything.
        </p>
      </form>
    </Card>
  );
};

export default InstagramInputForm;
