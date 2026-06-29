import { Route , Routes } from 'react-router'
import Register from './Register' ;
import { Login } from './Login';
import './App.css'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/dashboard' element={<div> welcome</div>} />
    </Routes>

    </>
  )
}

export default App
