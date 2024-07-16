import { useState } from 'react';
import NavBar from './components/navBar/NavBar.jsx';
import Home from './components/home/Home.jsx';
import Chat from './components/chat/Chat.jsx';
import './App.css'

function App() {

  const {userClicked, setUserClicked} = useState();


  return (
    <>
      <div id="app">
        <NavBar setUserClicked = {setUserClicked}/>
        <Chat />
      </div>
    </>
  )
}

export default App;
