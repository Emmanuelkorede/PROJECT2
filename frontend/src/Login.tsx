import React, { useState } from "react";
import { useNavigate, Link } from "react-router"; // Imported Link just in case you want a signup link later
import axios from "axios";
import FormComponent from "./formComponent";

type PayloadObject = {
    email: string;
    password: string;
};

export function Login() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        if (email.trim() === "" || password.trim() === "") {
            setMessage('please fill out the required field');
            return;
        }
        setLoading(true);
        const payload: PayloadObject = { email, password };
        try {
            const response = await axios.post('http://localhost:3000/auth/login', payload);
            setMessage(response.data.message);
            const token = response.data.token;
            const user = response.data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            console.log(user);
            navigate('/dashboard');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message || 'Invalid credentials');
            } else {
                setMessage('something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-100 flex items-center justify-center min-h-screen p-4">
            <form onSubmit={handlesubmit} className="flex flex-col max-w-md w-full p-6 bg-white gap-4 rounded-2xl shadow-xl">
                
                <div className="text-center mb-2">
                    <h1 className="text-2xl font-extrabold text-slate-800">Log in to your account</h1>
                    <p className="text-slate-500">Log in to continue</p>
                </div>

                {/* Cleaned up using your reusable component */}
                <FormComponent 
                    id="email" 
                    label="Email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required={true}
                />
                
                <FormComponent 
                    id="password" 
                    label="Password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required={true}
                />

                {message && <p className="text-red-500 text-sm font-medium">{message}</p>}
                
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white font-bold w-full hover:bg-blue-600 active:bg-blue-700 px-4 py-2 rounded-lg mt-2 transition-colors duration-200"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Log in'}
                </button>

                <div className="text-center mt-2 text-sm text-slate-600">
                    <p>Don't have an account? <Link to="/" className="underline text-blue-500 hover:text-blue-600">Sign up</Link></p>
                </div>
            </form>
        </div>
    );
}