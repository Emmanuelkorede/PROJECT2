import React, { useState } from "react" ;
import axios from "axios";
import { Link, useNavigate } from "react-router";
type Payload = {
    name : string ; 
    password : string ;
    email :string
}


export default function Register() {
    const[name , setName] = useState("") ;
    const [password , setPassword] = useState("") ;
    const [email , setEmail] = useState('') ;
    const [loading , setLoading] = useState(false) ; 
    const [message , setMessage]  = useState("") ; 
    const [confirmPassowrd , setConfirmPassword] = useState("") ;
    const navigate = useNavigate() ;

    const handlesubmit = async ( e : React.SubmitEvent<HTMLFormElement> ) => {
        e.preventDefault() ;
        setMessage('') ; 
        if(name.trim() === "" || email.trim() === ""|| password.trim() === "") {
            setMessage('please fill out the required field') ; 
            return ;
        }
        if(confirmPassowrd !== password) {
            setMessage('passwords dont match')  
            return  ;
        }
        setLoading(true) ;
        const payload : Payload = {name , email , password} ; 
        try {
            const response = await axios.post('http://localhost:3000/auth/register' , payload) ; 
            setMessage(response.data.message) ;
            navigate('/login')
        } catch(error) {
            if(axios.isAxiosError(error)) {
                const errorMsg = error.response?.data?.message || error.response?.data?.error 
                setMessage(errorMsg || 'Registration failed');
                
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
                    <h1 className="text-2xl text-center font-extrabold text-slate-800">  Create An Account</h1>
                    <p className="text-slate-500">Sign up to get started</p>
                </div>
                <div className="flex flex-col gap-3">
                    <label htmlFor="name" className="font-semibold text-sm uppercase tracking-wider">Name  </label>
                    <input type="text" id="name" className="px-4 py-2 border-2 border-gray-100 outline-none focus:border-blue-200 rounded-lg" required value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="flex flex-col gap-3">
                    <label htmlFor="email" className="font-semibold text-sm uppercase tracking-wider">Email  </label>
                    <input type="email" id="email" className="px-4 py-2 border-2 border-gray-100 outline-none focus:border-blue-200 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="flex flex-col gap-3">
                    <label htmlFor="password" className="font-semibold text-sm uppercase tracking-wider" >Password  </label>
                    <input type="password" id="password" className="px-4 py-2 border-2 border-gray-100 outline-none focus:border-blue-200 rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div className="flex flex-col gap-3">
                    <label htmlFor="confirmPassword" className="font-semibold text-sm uppercase tracking-wider">Confirm Passowrd  </label>
                    <input type="password" id="confirmPassword" className="px-4 py-2 border-2 border-gray-100 outline-none focus:border-blue-200 rounded-lg" required value={confirmPassowrd} onChange={(e) => setConfirmPassword(e.target.value)}/>
                </div>
                {message && <p className="text-red-500">{message}</p>}
                <button type="submit" className="bg-blue-500 text-white font-bold w-full hover:bg-blue-800 px-4 py-2 rounded-lg mt-4" >{loading ? 'Submitting..' : 'Submit'}</button>
                <div className="text-center">
                    <p>Have an account already ? <Link to="/login" className="underline text-blue-500">Log in </Link></p>
                </div>
            </form>
        </div>
    )

}