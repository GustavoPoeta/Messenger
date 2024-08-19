import "./App.css";
import { useCallback, useEffect, useState } from "react";
import NavBar from "./components/navBar/NavBar.jsx";
import Chat from "./components/chat/Chat.jsx";
import Home from "./components/home/Home.jsx";
import Options from "./components/options/Options.jsx";
import Login from "./components/login/Login.jsx";
import axios from "axios";

function App() {
  const [userClicked, setUserClicked] = useState("");
  const [isInputFocused, setInputFocused] = useState(false);
  const [actualPage, setActualPage] = useState("0");
  const [userLogged, setUserLogged] = useState([]); // it should store the user's email and id
  const [inputValues, setInputValues] = useState({
    name: '',
    email: ''
  });
  const [keyTyped, setKeyTyped] = useState("");

  const handleName = useCallback(
    (name) => {
      setUserClicked(name);
    },
    [setUserClicked]
  );

  const handleKeyDown = useCallback(
    (event) => {
      setKeyTyped((prev) => prev + event.key);
    },
    [setKeyTyped]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (userClicked !== "") {
      setActualPage("1");
    }
  }, [userClicked]);

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
