import { Route, Routes } from 'react-router-dom'
import Home from './home/Home'
import Login from './Login'
import Register from './Register'
import Navbar from './Navbar'
import Profile from './Profile'
import NewPost from './NewPost'
import EditPost from './EditPost'
import EditUser from './EditUser'

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
        <Route path='/edit-post/:postId' element={<EditPost />} />
        <Route path='/settings' element={<EditUser />} />
      </Routes>
    </>
  )
}

export default App
