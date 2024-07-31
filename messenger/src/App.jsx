
import { useEffect ,useState } from 'react';
import NavBar from './components/navBar/NavBar.jsx';
import Chat from './components/chat/Chat.jsx';
import './App.css'
import Home from './components/home/Home.jsx';

function App() {

  const [firstTime, setFirstTime] = useState(false);
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
  
  const homeOrChat = () => {
    if (userClicked === "") {
      return (
        <Home />
      );
    } else if (userClicked != "") {
      return (
        <Chat userClicked = {userClicked} keyTyped = {keyTyped}/>
      );
    }
  }
 
  return (
    <>
      <div id="app">
        <NavBar setUserClicked = {handleName}/>
        {homeOrChat()}
      </div>
    </>
  )
}

export default App;
