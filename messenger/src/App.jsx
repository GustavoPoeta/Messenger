import "./App.css";
import { useCallback, useEffect, useState } from "react";
import NavBar from "./components/navBar/NavBar.jsx";
import Chat from "./components/chat/Chat.jsx";
import Home from "./components/home/Home.jsx";
import Options from "./components/options/Options.jsx";
import Login from "./components/login/Login.jsx";
import axios from "axios";

function App() {
  // State to manage the currently clicked user, input focus, and page view
  const [userClicked, setUserClicked] = useState("");
  const [isInputFocused, setInputFocused] = useState(false);
  const [actualPage, setActualPage] = useState("0"); // "0": Home, "1": Chat, "2": Options
  const [userLogged, setUserLogged] = useState([]); // Stores the user's email and ID
  const [inputValues, setInputValues] = useState({
    name: '',
    email: ''
  });
  const [keyTyped, setKeyTyped] = useState("");

  // Update the clicked user name
  const handleName = useCallback(
    (name) => {
      setUserClicked(name);
    },
    [setUserClicked]
  );

  // Update the keyTyped state on key down
  const handleKeyDown = useCallback(
    (event) => {
      setKeyTyped((prev) => prev + event.key);
    },
    [setKeyTyped]
  );

  // Set up and clean up the keydown event listener
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Switch to the chat page when a user is clicked
  useEffect(() => {
    if (userClicked !== "") {
      setActualPage("1");
    }
  }, [userClicked]);

  // Fetch user information when the page changes to "Options"
  const getInfo = useCallback(() => {
    axios.post("http://localhost:3500/getInfo", {
      email: userLogged[1],
    })
    .then((response) => {
      console.log(response);
      setInputValues({
        name: response.data[0]?.username || "",
        email: userLogged[1],
      });
    });
  }, [userLogged]);

  useEffect(() => {
    if (actualPage === "2") {
      getInfo();
    }
  }, [actualPage, getInfo]);

  // Render different components based on the current page
  const handlePage = () => {
    switch (actualPage) {
      case "0":
        return (
          <>
            <NavBar
              setUserClicked={handleName}
              setInputFocused={setInputFocused}
              setActualPage={setActualPage}
              userLogged={userLogged}
            />
            <Home />
          </>
        );

      case "1":
        return (
          <>
            <NavBar
              setUserClicked={handleName}
              setInputFocused={setInputFocused}
              setActualPage={setActualPage}
              userLogged={userLogged}
            />

            <Chat
              userClicked={userClicked}
              keyTyped={keyTyped}
              actualPage={actualPage}
              isInputFocused={isInputFocused}
              userLogged={userLogged}
            />
          </>
        );

      case "2":
        return (
          <>
            <NavBar
              setUserClicked={handleName}
              setInputFocused={setInputFocused}
              setActualPage={setActualPage}
              userLogged={userLogged}
            />
            <Options
              setInputFocused={setInputFocused}
              userLogged={userLogged}
              setInputValues={setInputValues}
              inputValues={inputValues}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div id="app">
        {userLogged.length !== 0 ? (
          handlePage()
        ) : (
          <Login setUserLogged={setUserLogged} userLogged={userLogged} />
        )}
      </div>
    </>
  );
}

export default App;
