import { useEffect, useState } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router";

type PayloadObject  = {
    title : string ; 
    content? : string ; 
    category : string
}

type NotePayload = {
    id: number;          
    user_id: number;
    title: string; 
    content?: string; 
    category: string;
    is_completed: boolean; 
    created_at: string;
}

type UpdatePayload = Pick<NotePayload , "title" | "content" |"is_completed">

export default function Dashboard() {
    const userString  = localStorage.getItem('user') ;
    const storedstring = JSON.parse(userString || '{}') ; 
    const name = storedstring.name
    const [openModal , setOpenModal] = useState(false) ;
    const[title , setTitle] = useState('') ; 
    const[content , setContent] = useState('') ; 
    const[category , setCategoryy] = useState('') ; 
    const [loading , setLoading] = useState(false) ;
    const [message , setMessage] = useState('') ;
    const[todos , setTodos] = useState<NotePayload[]>([]) ;
    const [editingId , setEditingId] = useState<number | null >(null); 
    const [editedT ,     setEditedT] = useState('') ;
    const [editedC , setEditedC] = useState('') ;
    const[eIs_com , setEIs_com] = useState(false) ;
    const navigate = useNavigate() ; 

    const[statusQuery , setStatusQuery] = useState('') ;
    const[stateQuery , setStateQuery] = useState('') ;

    const getAuthHeader =  () => {
        const token = localStorage.getItem('token') ; 
        return { headers: { Authorization: `Bearer ${token}` } };
    }

    const getNote = async () => {
        try {
            const params = new URLSearchParams ;
            if(stateQuery) params.append('is_completed' , stateQuery) ;
            if(statusQuery) params.append('category' , statusQuery) ;

            const url  = `http://localhost:3000/todo/?${params.toString()}`

            const response = await axios.get(url, getAuthHeader());
            setTodos(response.data.result || []) ;
        }  catch(error) {
            if(axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message) ; 
            } else {
                setMessage('something went wrong')
            }
        } finally {
            setLoading(false)
        }
    }

    const createTodo = async () => {
        setMessage('') ; 
        if(title.trim() === "") {
            setMessage('please input your title') ; 
            return
        }

        if(category === "") {
            setMessage('Please select a category') ;
            return ;
        }
        
        setLoading(true) ; 
        const payload : PayloadObject = {title , content , category} ;
        try {
            const response = await axios.post('http://localhost:3000/todo/' ,  payload , getAuthHeader() ) ;
            setMessage(response.data.message) ;
            getNote() ;
        } catch(error) {
            if(axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message) ; 
            } else {
                setMessage('something went wrong')
            }
        } finally {
            setLoading(false) ;
            setTitle('') ;
            setContent('')
            setMessage('') ;
        }
    }

    const deleteTodo = async ( id : number) => {
        try {
            const response = await axios.delete( `http://localhost:3000/todo/${id}`, getAuthHeader()) ; 
            setMessage( response.data.message) ; 
            getNote()
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

    useEffect(() => {
        getNote()
    } , [stateQuery , statusQuery]) ; 

    const markASComplete = async (id : number , is_completed : boolean) => {
        try {
            const response = await axios.patch( `http://localhost:3000/todo/${id}`, {is_completed}, getAuthHeader()) ; 
            setMessage(response.data.message) ; 
            getNote()
        } catch(error) {
            if(axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message) ; 
            } else {
                setMessage('something went wrong')
            }
        } finally {
            setLoading(false) ;
        }
    }

    const saveEdited = async (id : number) => {
        const payload : UpdatePayload = {title : editedT ,content :  editedC , is_completed : eIs_com}
        try {
            const response = await axios.put(`http://localhost:3000/todo/${id}`, payload , getAuthHeader()) ;
            setMessage( response.data.message) ; 
            getNote() ; 
            setEditingId(null)
        } catch(error) {
            if(axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message) ; 
            } else {
                setMessage('something went wrong')
            }
        } finally {
            setLoading(false) ; 
        }
    }

    const startEditing = (todo : NotePayload) => {
        setEditingId(todo.id) ;
        setEditedT(todo.title);
        setEditedC(todo.content || '');
        setEIs_com(todo.is_completed)
    }
    
    return (
        <div className="bg-slate-100 min-h-screen">
            <header className="flex w-full justify-between items-center bg-white shadow-sm p-4 px-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Welcome {name}</h2>
                </div>
                <button 
                    onClick={() => setOpenModal(true)} 
                    className="px-5 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors duration-200"
                >
                    Log out 
                </button>
            </header>

            <main className="flex flex-col md:flex-row gap-6 m-6 items-start justify-center">
                <div className="bg-white max-w-md w-full rounded-2xl shadow-xl py-8 px-7 flex flex-col gap-5">
                    <h3 className="text-xl font-bold text-slate-800 text-center mb-2">Create A Todo</h3>
                    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="title" className="uppercase text-xs text-slate-500 tracking-wider font-bold">Title</label>
                        <input className="px-4 py-2 border-2 border-gray-100 outline-none focus:border-blue-200 rounded-lg" type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="content" className="uppercase text-xs text-slate-500 tracking-wider font-bold">Content</label>
                        <input type="text" className="px-4 py-2 border-2 border-gray-100 outline-none focus:border-blue-200 rounded-lg" id="content" value={content} onChange={(e) => setContent(e.target.value)} />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="options" className="uppercase text-xs text-slate-500 tracking-wider font-bold">Choose a category</label>
                        <select className="px-4 py-2 border-2 border-gray-100 outline-none focus:border-blue-200 rounded-lg bg-white" id="options" value={category} onChange={(e) => setCategoryy(e.target.value)} required>
                            <option value="">Please choose a category</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Shopping">Shopping</option>
                        </select>
                    </div>
                    
                    {message && <p className="text-red-500 text-sm font-medium">{message}</p>}
                    
                    <button 
                        className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200 font-bold w-full rounded-lg mt-2"  
                        onClick={createTodo}
                    >
                        {loading ? 'Creating...' : 'Create Todo'}
                    </button>
                </div>

                <div className="bg-white flex-1 rounded-2xl shadow-xl py-8 px-7 flex flex-col gap-6 w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h3 className="text-xl font-bold text-slate-800">Your Todos</h3>
                        <div className="flex gap-3">
                            <select className="px-3 py-1.5 border-2 border-gray-100 outline-none focus:border-blue-200 rounded-lg bg-white text-sm font-medium" value={statusQuery} onChange={(e) => setStatusQuery(e.target.value)} required>
                                <option value="">All Categories</option>
                                <option value="Work">Work</option>
                                <option value="Personal">Personal</option>
                                <option value="Shopping">Shopping</option>
                            </select>

                            <select className="px-3 py-1.5 border-2 border-gray-100 outline-none focus:border-blue-200 rounded-lg bg-white text-sm font-medium" value={stateQuery} onChange={(e) => setStateQuery(e.target.value)} required>
                                <option value="">All Statuses</option>
                                <option value="true">Completed</option>
                                <option value="false">Incomplete</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"> 
                        {todos.map((todo) => (
                            <div key={todo.id} className="flex flex-col gap-3 bg-slate-50 border border-slate-100 rounded-xl p-5 shadow-sm">
                                {editingId === todo.id ? (
                                    <>
                                        <span className="self-end rounded-full text-[10px] py-1 px-3 text-blue-800 bg-blue-100 font-bold uppercase tracking-wider">Editing</span>
                                        
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="title" className="uppercase text-[10px] text-slate-500 tracking-wider font-bold">Title</label>
                                            <input className="px-3 py-1.5 border-2 border-gray-200 outline-none focus:border-blue-300 rounded-md bg-white text-sm" type="text" id="title" value={editedT} onChange={(e) => setEditedT(e.target.value)} />
                                        </div>
                                        
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="content" className="uppercase text-[10px] text-slate-500 tracking-wider font-bold">Content</label>
                                            <input type="text" className="px-3 py-1.5 border-2 border-gray-200 outline-none focus:border-blue-300 rounded-md bg-white text-sm" id="content" value={editedC} onChange={(e) => setEditedC(e.target.value)} />
                                        </div>
                                        
                                        <button onClick={() => {
                                            if(eIs_com === true) {
                                                setEIs_com(false)
                                            } else {
                                                setEIs_com(true)
                                            }
                                        }} className={`px-3 py-2 text-white ${eIs_com === true ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} transition-colors duration-200 text-sm font-bold w-full rounded-md mt-2`}>
                                            Mark as {eIs_com === true ? 'Incomplete' : 'Completed'} 
                                        </button>
                                        
                                        <div className="flex gap-2 mt-2">
                                            <button className="px-3 py-2 text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200 text-sm font-bold w-full rounded-md" onClick={() => saveEdited(todo.id)}>Save</button>
                                            <button className="px-3 py-2 text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors duration-200 text-sm font-bold w-full rounded-md" onClick={() => setEditingId(null)}>Cancel</button>
                                        </div>
                                    </> 
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="rounded-full text-[10px] py-1 px-3 text-slate-700 bg-slate-200 font-bold uppercase tracking-wider">{todo.category}</span>
                                            <button className={`rounded-full text-[10px] py-1 px-3 transition-colors duration-200 font-bold uppercase tracking-wider ${ todo.is_completed === true ? 'text-green-800 bg-green-100 hover:bg-green-200' : 'text-amber-800 bg-amber-100 hover:bg-amber-200'}`} onClick={() => markASComplete(todo.id , todo.is_completed)}>
                                                {todo.is_completed === true ? 'Completed' : 'Incomplete'}
                                            </button>
                                        </div>
                                        
                                        <div>
                                            <h1 className={`text-lg font-bold ${todo.is_completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{todo.title}</h1>
                                            <p className={`mt-1 text-sm ${todo.is_completed ? 'text-slate-400' : 'text-slate-600'}`}>{todo.content}</p>
                                        </div>
                                        
                                        <div className="flex gap-2 mt-auto pt-4">
                                            <button className="px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 text-sm font-bold w-full rounded-md" onClick={() => startEditing(todo) }>Edit</button>
                                            <button className="px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-200 text-sm font-bold w-full rounded-md" onClick={() => deleteTodo(todo.id)}>Delete</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {openModal === true && 
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="flex flex-col p-8 bg-white shadow-2xl rounded-2xl items-center justify-center text-center max-w-sm w-full relative">
                        <button className="absolute top-4 right-5 font-extrabold text-slate-400 hover:text-slate-600 transition-colors" onClick={() => setOpenModal(false)}>✕</button>
                        <div className="mb-6 mt-2">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Log out of your account?</h3> 
                            <p className="text-sm text-slate-500">This will clear your current session and you will need to log in again.</p>
                        </div>
                        <div className="w-full flex gap-3">
                            <button className="w-full px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 font-bold rounded-lg transition-colors duration-200" onClick={() => setOpenModal(false)}>Cancel</button>
                            
                            {/* ADDED navigate('/login') and closing the modal here */}
                            <button 
                                className="w-full px-4 py-2 text-white bg-red-500 hover:bg-red-600 font-bold rounded-lg transition-colors duration-200" 
                                onClick={() => {
                                    localStorage.clear();
                                    setOpenModal(false);
                                    navigate('/login');
                                }}
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}