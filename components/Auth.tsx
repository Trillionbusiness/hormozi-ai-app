import React, { useState } from 'react';
import Card from './common/Card';

interface AuthProps {
    onLogin: (username: string, password: string) => boolean;
    onSwitchToSignup: () => void;
    setError: (error: string | null) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSwitchToSignup, setError }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const success = onLogin(username, password);
        if (!success) {
            setLoading(false);
        }
    };
    
    return (
        <Card>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                <p className="text-gray-400 mt-2">Log in to access your saved business plan.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                        autoComplete="username"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                        autoComplete="current-password"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>
            <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                    <button onClick={onSwitchToSignup} className="font-semibold text-yellow-400 hover:underline">
                        Don't have an account? Sign Up & Create a Plan
                    </button>
                </p>
            </div>
        </Card>
    );
};

export default Auth;