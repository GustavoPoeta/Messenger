
import { useEffect ,useState } from 'react';
import NavBar from './components/navBar/NavBar.jsx';
import Chat from './components/chat/Chat.jsx';
import './App.css'

function App() {

  const [userClicked, setUserClicked] = useState("");
  
  const handleName = (name) => {
    setUserClicked(name);
  }

  const [keyTyped, setKeyTyped] = useState("");

  useEffect(() => {
    
    const handleKeyDown = (event) => {
      setKeyTyped((prev) => prev + event.key);
    };
    
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };

  }, []);
  

  return (
    <>
      <div id="app">
        <NavBar setUserClicked = {handleName}/>
        <Chat userClicked = {userClicked} keyTyped = {keyTyped}/>
      </div>
    </>
  )
}

export default App;
