
import { useState } from 'react';
import NavBar from './components/navBar/NavBar.jsx';
import Chat from './components/chat/Chat.jsx';
import './App.css'

function App() {

  const [userClicked, setUserClicked] = useState("");

  const handleName = (name) => {
    setUserClicked(name);
  }

  return (
    <>
      <div id="app">
        <NavBar setUserClicked = {handleName}/>
        <Chat userClicked = {userClicked}/>
      </div>
    </>
  )
}

export default App;
