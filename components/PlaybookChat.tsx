
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import Card from './common/Card';
import MarkdownRenderer from './common/MarkdownRenderer';

interface PlaybookChatProps {
    history: ChatMessage[];
    isLoading: boolean;
    onSendMessage: (message: string) => void;
}

const TypingIndicator: React.FC = () => (
    <>
        <style>
            {`
                .typing-indicator span {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: #f6e05e; /* yellow-300 */
                    animation: blink 1.4s infinite both;
                    margin: 0 2px;
                }
                .typing-indicator span:nth-child(2) {
                    animation-delay: 0.2s;
                }
                .typing-indicator span:nth-child(3) {
                    animation-delay: 0.4s;
                }
                @keyframes blink {
                    0% { opacity: 0.2; }
                    20% { opacity: 1; }
                    100% { opacity: 0.2; }
                }
            `}
        </style>
        <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </>
);

const SuggestionChip: React.FC<{ text: string, onClick: () => void }> = ({ text, onClick }) => (
    <button
        onClick={onClick}
        className="px-3 py-1 bg-gray-600/50 border border-gray-500 text-gray-300 rounded-full text-sm hover:bg-gray-600 hover:border-yellow-400 transition-colors"
    >
        {text}
    </button>
);

const PlaybookChat: React.FC<PlaybookChatProps> = ({ history, isLoading, onSendMessage }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [history]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSendMessage(input);
        setInput('');
    };
    
    const suggestions = [
        "Make my offer guarantee stronger.",
        "Give me another marketing idea for TikTok.",
        "Explain the 'money model' like I'm 5.",
        "Rewrite the 'sales funnel' to be more aggressive."
    ];

    return (
        <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
            <h2 className="text-3xl font-black text-white tracking-tight text-center">
                <span className="text-yellow-400">AI</span> Command Center
            </h2>
            <p className="text-gray-400 text-center mt-2 mb-6">This is where your plan becomes perfect. Talk to your AI helper to refine it.</p>
            
            <div className="h-96 bg-gray-900/70 rounded-lg p-4 flex flex-col space-y-4 overflow-y-auto border border-gray-700">
                {history.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                            <MarkdownRenderer content={msg.content} theme="dark" />
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-xl p-3 rounded-lg bg-gray-700 text-gray-200 flex items-center">
                            <TypingIndicator />
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-4">
                 <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    {suggestions.map(s => <SuggestionChip key={s} text={s} onClick={() => onSendMessage(s)} />)}
                 </div>
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me to improve your plan..."
                        disabled={isLoading}
                        className="flex-grow w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition disabled:opacity-50"
                    />
                    <button 
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </Card>
    );
};

export default PlaybookChat;
