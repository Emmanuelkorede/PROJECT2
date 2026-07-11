import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import FormComponent from "./formComponent"; // Importing your reusable component

type Payload = {
    name: string;
    password: string;
    email: string;
};

export default function Register() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [confirmPassowrd, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
            setMessage('please fill out the required field');
            return;
        }
        if (confirmPassowrd !== password) {
            setMessage('passwords dont match');
            return;
        }
        setLoading(true);
        const payload: Payload = { name, email, password };
        try {
            const response = await axios.post('http://localhost:3000/auth/register', payload);
            setMessage(response.data.message);
            navigate('/login');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMsg = error.response?.data?.message || error.response?.data?.error;
                setMessage(errorMsg || 'Registration failed');
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
                    <h1 className="text-2xl font-extrabold text-slate-800">Create An Account</h1>
                    <p className="text-slate-500">Sign up to get started</p>
                </div>

                {/* All the duplicated HTML fields replaced with your component */}
                <FormComponent 
                    id="name" 
                    label="Name" 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required={true} 
                />

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

                <FormComponent 
                    id="confirmPassword" 
                    label="Confirm Password" 
                    type="password" 
                    value={confirmPassowrd} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required={true} 
                />

                {message && <p className="text-red-500 text-sm font-medium">{message}</p>}
                
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white font-bold w-full hover:bg-blue-600 active:bg-blue-700 px-4 py-2 rounded-lg mt-2 transition-colors duration-200"
                    disabled={loading}
                >
                    {loading ? 'Submitting..' : 'Submit'}
                </button>

                <div className="text-center mt-2 text-sm text-slate-600">
                    <p>Have an account already? <Link to="/login" className="underline text-blue-500 hover:text-blue-600">Log in</Link></p>
                </div>
            </form>
        </div>
    );
}