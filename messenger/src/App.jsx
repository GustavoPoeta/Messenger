import "./App.css";
import { useCallback, useEffect, useState } from "react";
import NavBar from "./components/navBar/NavBar.jsx";
import Chat from "./components/chat/Chat.jsx";
import Home from "./components/home/Home.jsx";
import Options from "./components/options/Options.jsx";
import Login from "./components/login/Login.jsx";
import axios from "axios";

function App() {
<<<<<<< HEAD
  
=======
>>>>>>> 0c2bf16465d9780fc8f5d47f77ac7414dca5ce12
  const [userClicked, setUserClicked] = useState("");
  const [isInputFocused, setInputFocused] = useState(false);
  const [actualPage, setActualPage] = useState("0");
<<<<<<< HEAD

  const [userLogged, setUserLogged] = useState([]); // it should store the user's email and id

=======
  const [userLogged, setUserLogged] = useState(""); // it should store the user's email
>>>>>>> 0c2bf16465d9780fc8f5d47f77ac7414dca5ce12
  const [inputValues, setInputValues] = useState({
    name: '',
    email: ''
  });
<<<<<<< HEAD

=======
>>>>>>> 0c2bf16465d9780fc8f5d47f77ac7414dca5ce12
  const [keyTyped, setKeyTyped] = useState("");

  const handleName = useCallback(
    (name) => {
      setUserClicked(name);
    },
    [setUserClicked]
  );

<<<<<<< HEAD
  const handleName = useCallback(
    (name) => {
      setUserClicked(name);
    },
    [setUserClicked]
  );



=======
>>>>>>> 0c2bf16465d9780fc8f5d47f77ac7414dca5ce12
  const handleKeyDown = useCallback(
    (event) => {
      setKeyTyped((prev) => prev + event.key);
    },
    [setKeyTyped]
  );
<<<<<<< HEAD


=======
>>>>>>> 0c2bf16465d9780fc8f5d47f77ac7414dca5ce12

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

<<<<<<< HEAD


=======
>>>>>>> 0c2bf16465d9780fc8f5d47f77ac7414dca5ce12
  useEffect(() => {
    if (userClicked !== "") {
      setActualPage("1");
    }
  }, [userClicked]);

  const getInfo = useCallback(() => {
    axios.post("http://localhost:3500/getInfo", {
      email: userLogged,
    })
    .then((response) => {
      console.log(response);
      setInputValues({
        name: response.data[0]?.username || "",
        email: userLogged,
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
            />

            <Chat
              userClicked={userClicked}
              keyTyped={keyTyped}
              actualPage={actualPage}
              isInputFocused={isInputFocused}
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
<<<<<<< HEAD
        {userLogged.length !== 0 ? (
=======
        {userLogged !== "" ? (
>>>>>>> 0c2bf16465d9780fc8f5d47f77ac7414dca5ce12
          handlePage()
        ) : (
          <Login setUserLogged={setUserLogged} userLogged={userLogged} />
        )}
      </div>
    </>
  );
}

export default App;
