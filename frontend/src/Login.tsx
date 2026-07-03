import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

type PayloadObject = {
    email : string ; 
    password : string ; 
}

export function Login() {
    const [password , setPassword] = useState("") ;
    const [email , setEmail] = useState('') ;
    const [loading , setLoading] = useState(false) ; 
    const [message , setMessage]  = useState("") ; 
    const navigate = useNavigate() ;

    const handlesubmit = async (e : React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault() ;
        setMessage('') ;
        if(email.trim() === ""|| password.trim() === "") {
            setMessage('please fill out the required field') ; 
            return ;
        }
        setLoading(true) ; 
        const payload  : PayloadObject = { email , password} ; 
        try {
            const response = await axios.post('http://localhost:3000/auth/login' , payload) ; 
            setMessage(response.data.message) ;
            const token = response.data.token ; 
            const user = response.data.user ;
            localStorage.setItem('token' , token) ;
            localStorage.setItem('user' , JSON.stringify(user)) ;
            console.log(user)
            navigate('/dashboard')
        } catch(error) {
            if(axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message) ; 
            } else {
                setMessage('something went wrong')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-slate-100 flex items-center justify-center min-h-screen p-4">
            <form  onSubmit={handlesubmit} className="flex flex-col max-w-md w-full p-6 bg-white gap-4 rounded-2xl shadow-xl ">
                <div className="text-center mb-2"> 
                    <h1 className="text-2xl text-center font-extrabold text-slate-800">  Log in to your account</h1>
                    <p className="text-slate-500">Log in to continue</p>
                </div>

                <div className="flex flex-col gap-3">
                    <label htmlFor="email" className="font-semibold text-sm uppercase tracking-wider">Email  </label>
                    <input type="email" id="email" className="px-4 py-2 border-2 border-gray-100 outline-none focus:border-blue-200 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="flex flex-col gap-3">
                    <label htmlFor="password" className="font-semibold text-sm uppercase tracking-wider" >Password  </label>
                    <input type="password" id="password" className="px-4 py-2 border-2 border-gray-100 outline-none focus:border-blue-200 rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>

                {message && <p className="text-red-500">{message}</p>}
                <button type="submit" className="bg-blue-500 text-white font-bold w-full hover:bg-blue-800 px-4 py-2 rounded-lg mt-4" >{loading ? 'Loggin..' : 'Log in'}</button>
            </form>
        </div>
    )
}