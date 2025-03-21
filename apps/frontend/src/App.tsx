import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import Navbar from './Navbar'
import Profile from './Profile'
import NewPost from './NewPost'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/user/:userId' element={<Profile />} />
        <Route path='/new-post' element={<NewPost />} />
      </Routes>
    </>
  )
}

export default App
