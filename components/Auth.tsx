import React, { useState } from 'react';
import { handleLogin, handleSignup } from '../services/firebaseService';
import Card from './common/Card';

interface AuthProps {
    setError: (error: string | null) => void;
}

const Auth: React.FC<AuthProps> = ({ setError }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isLogin) {
                await handleLogin(email, password);
            } else {
                await handleSignup(email, password);
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };
    
    const title = isLogin ? 'Welcome Back' : 'Create Your Account';
    const subtitle = isLogin ? 'Log in to access your saved business plan.' : 'Sign up to create and save your plan.';
    const buttonText = isLogin ? 'Login' : 'Sign Up';
    const toggleText = isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login";


    return (
        <Card>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-gray-400 mt-2">{subtitle}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                        autoCapitalize="none"
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
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : buttonText}
                    </button>
                </div>
            </form>
            <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                    <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="font-semibold text-yellow-400 hover:underline">
                        {toggleText}
                    </button>
                </p>
            </div>
        </Card>
    );
};

export default Auth;