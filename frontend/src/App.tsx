import { Route , Routes } from 'react-router'
import Register from './Register' ;
import { Login } from './Login';
import Dashboard from './Dashboard';
import './App.css'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>

    </>
  )
}

export default App
