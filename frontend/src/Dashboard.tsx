import { useEffect, useState } from "react";
import axios from "axios" ; 
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
    const[category , setCategoryy] = useState('Work') ; 
    const [loading , setLoading] = useState(false) ;
    const [message , setMessage] = useState('') ;
    const[todos , setTodos] = useState<NotePayload[]>([]) ;
    const [editingId , setEditingId] = useState<number | null >(null); 
    const [editedT ,     setEditedT] = useState('') ;
    const [editedC , setEditedC] = useState('') ;
    const[eIs_com , setEIs_com] = useState(false) ;
    const navigate = useNavigate() ; 


    const getAuthHeader =  () => {
        const token = localStorage.getItem('token') ; 
      return   {headers: {  Authorization: `Bearer ${token}` } };
    }

    const getNote = async () => {
        try {
            const response = await axios.get('http://localhost:3000/todo/' , getAuthHeader());
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
            setLoading(false)
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
    } , []) ; 

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
            setLoading(false)
        }
    }

    const startEditing = (todo : NotePayload) => {
        setEditingId(todo.id) ;
        setEditedT(todo.title);
        setEditedC(todo.content || '');
        setEIs_com(todo.is_completed)
    }
    
    return (
        <div className="bg-slate-100 min-h-screen  ">
        <header className="flex w-full justity-between  items-center border-b-2  border-gray-300 p-2">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">Welcome {name}</h2>
            </div>
            <button onClick={() => {setOpenModal(true) ;  navigate('/login') }} className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-800 font-semibold">Log out </button>
        </header>
        <main className="flex  gap-4 m-6 items-center justify-center" >
            <div className="bg-white max-w-md w-full rounded-xl shadow-md py-8 px-7 flex flex-col gap-4">
                <h3 className="text-xl font-bold text-slate-800 text-center mb-4">Create  A todo</h3>
                <div className="flex flex-col gap-2">
                    <label htmlFor="title" className="uppercase text-slate-600 tracking-wider font-semibold ">Title</label>
                    <input className="px-4 py-2 border border-gray-200 outline-none focus:border-blue-500" type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="content" className="uppercase text-slate-600 tracking-wider font-semibold ">Content</label>
                    <input type="text" className="px-4 py-2 border border-gray-200 outline-none focus:border-blue-500" id="content" value={content} onChange={(e) => setContent(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="options" className="uppercase text-slate-600 tracking-wider font-semibold " >Choose a category</label>
                    <select id="options" value={category} onChange={(e) => setCategoryy(e.target.value)}>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Shopping">Shopping</option>
                    </select>
                </div>
                {message && <p>{message}</p>}
                <button className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-800 font-semibold w-full rounded-lg mt-4"  onClick={createTodo} >{loading ? 'Creating...' : 'Create Todo' }</button>
            </div>
            <div className="bg-white flex-1 rounded-xl shadow-md py-4 px-7 flex flex-col gap-4">
                <h3 className="text-xl font-bold text-slate-800 text-center mb-4">Your Todos</h3>
                <div className=" grid grid-cols-2 gap-2"> 
                    {todos.map((todo) => (
                        <div key={todo.id} className="flex flex-col gap-2 bg-slate-100 rounded-lg p-2">
                            {editingId === todo.id ?
                             <>
                            <span className="ml-auto rounded-2xl text-xs py-1 px-3 text-blue-800 bg-blue-500 font-semibold">editing</span>
                            
                            <div className="flex flex-col gap-2">
                                <label htmlFor="title" className="uppercase text-slate-600 tracking-wider font-semibold ">Title</label>
                                <input className="px-4 py-2 border border-gray-200 outline-none focus:border-blue-500 rounded-lg bg-white" type="text" id="title" value={editedT} onChange={(e) => setEditedT(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="content" className="uppercase text-slate-600 tracking-wider font-semibold ">Content</label>
                                <input type="text" className="px-4 py-2 border border-gray-200 outline-none focus:border-blue-500 rounded-lg bg-white" id="content" value={editedC} onChange={(e) => setEditedC(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-2 ">
                                <button onClick={() => {
                                    if(eIs_com === true) {
                                        setEIs_com(false)
                                    } else {
                                        setEIs_com(true)
                                    }
                                }} className={`px-3 py-2 text-white ${eIs_com === true ? 'bg-red-500' : 'bg-blue-500'}  font-semibold w-full rounded-lg mt-4`}>Mark as {eIs_com === true ? 'in complete' : 'Completed'} </button>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-2 text-white bg-blue-500 hover:bg-blue-800 font-semibold w-full rounded-lg mt-4" onClick={() => saveEdited(todo.id)}>Save</button>
                            <button className="px-3 py-2 text-white bg-red-500 hover:bg-red-600 font-semibold w-full rounded-lg mt-4" onClick={() => setEditingId(null)}>Cancel</button>
                            </div>
                             </> 
                             : 
                             <>
                            <span className="ml-auto rounded-2xl text-xs py-1 px-3 text-blue-800 bg-blue-500 font-semibold">{todo.category}</span>
                            
                            <h1 className="text-md font-semibold text-slate-800">{todo.title}</h1>
                            <p className="bg-white rounded-lg p-2 font-medium text-slate-500">{todo.content}</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-2 text-white bg-blue-500 hover:bg-blue-800 font-semibold w-full rounded-lg mt-4" onClick={() => startEditing(todo) }>Update</button>
                            <button className="px-3 py-2 text-white bg-red-500 hover:bg-red-600 font-semibold w-full rounded-lg mt-4" onClick={() => deleteTodo(todo.id)}>Delete</button>
                            </div>
                             </>
                             }

                        </div>
                    ))}
                </div>

            </div>
        </main>
            {openModal === true && 
            <div className="fixed inset-0 backdrop-blur-md z-40">
                <div className="flex flex-col p-6 bg-white shadow-md rounded-lg  items-center justify-center text-center">
                    <button className="font-extrabold text-xl" onClick={() => setOpenModal(false)}>X</button>
                    <div>
                    <h3 className="text-md font-semibold"> Are you sure you want to log out</h3> 
                    <p className="text-slate-500"> You will clear out this session</p>
                    </div>
                    <div>
                        <button className="w-full px-4 py-2 text-white bg-red-500 hover:bg-red-600 font-semibold rounded-lg" onClick={() => localStorage.clear()}>Log out</button>
                    </div>
                </div>
            </div>
        }

        </div>
    )
}