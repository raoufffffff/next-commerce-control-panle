import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './Components/Header'

function App() {

  return (
    <div className="w-full min-h-full">
      <Header />
      <Outlet />
    </div>
  )
}

export default App
