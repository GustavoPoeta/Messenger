import './App.css'
import { useCallback, useEffect ,useState } from 'react';
import NavBar from './components/navBar/NavBar.jsx';
import Chat from './components/chat/Chat.jsx';
import Home from './components/home/Home.jsx';
import Options from './components/options/Options.jsx';
import Login from './components/login/Login.jsx';

function App() {

  const [userClicked, setUserClicked] = useState("");

  const [isInputFocused, setInputFocused] = useState(false);

  const [actualPage, setActualPage] = useState("0");

  const [userLogged, setUserLogged] = useState(""); // it should store the user's email
  

  const handleName = useCallback((name) => {
    setUserClicked(name);
  }, [setUserClicked]);


  const [keyTyped, setKeyTyped] = useState("");


  const handleKeyDown = useCallback((event) => {

    setKeyTyped((prev) => prev + event.key);

  }, [setKeyTyped]);



  useEffect(() => {

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };

  });


  useEffect(() => { // checks if userClicked is different than an empty string, if true: go to Chat component
    if (userClicked !== "") {
      setActualPage("1");
    } 
  }, [userClicked]);
  



  const handlePage = useCallback(() => { // returns the component based on the number in actualPage 

    switch (actualPage) {

      case "0": return <>
        <NavBar
        setUserClicked={handleName}
        setInputFocused={setInputFocused}
        setActualPage={setActualPage}/> 
        <Home />
      </>;
      

      case "1": return <>

      <NavBar
      setUserClicked={handleName}
      setInputFocused={setInputFocused}
      setActualPage={setActualPage}/> 

      <Chat userClicked={userClicked}
        keyTyped={keyTyped}
        actualPage={actualPage}
        isInputFocused={isInputFocused}
      />

    </>;


      case "2": return <>
        <NavBar
        setUserClicked={handleName}
        setInputFocused={setInputFocused}
        setActualPage={setActualPage}
        /> 
        <Options setInputFocused={setInputFocused} />;
      </>

      default: return null;
    }
  }, [actualPage, handleName, userClicked, keyTyped, isInputFocused]);
        


  return (
    <>
      <div id="app">
        {userLogged !== "" ?  
        handlePage()
        :
        <Login setUserLogged = {setUserLogged} userLogged={userLogged}/>} 
      </div>
    </>
  )
}

export default App;
