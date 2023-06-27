import Users from './components/users/Users'
import './App.css';
import {  Route, Routes } from 'react-router-dom';
import UserPosts from './components/userPosts/UserPosts';

function App() {
  return (
    <Routes>
      <Route  path="/" Component={Users} />
      <Route  path="/users/:userId/posts" Component={UserPosts} />
    </Routes>
  );
}

export default App;
