  import "./Chat.css";
  import { useState, useEffect, useRef, useCallback } from "react";
  import users from "../../assets/users.json";
  import PropTypes from "prop-types";
  import insertMediaIcon from "../../assets/imageForInputFile.svg";
  import emojiButton from "../../assets/emoji-sunglasses-fill.svg";
  import Message from "./message/Message.jsx";

  function Chat(props) {
    const messagesDiv = useRef(null);
    const messageRef = useRef(null);
    const inputRef = useRef(null);

    const [arrayOfMessages, setArrayMessage] = useState([]);

    // check if there's an user that shares the name of the contact that was clicked
    const headerHandler = () => {
      const matchedUser = users.users.find(
        (user) => user.name === props.userClicked
      );

      // if there's an user that shares the name, create the header with its information
      if (matchedUser) {
        return (
          <>
            <img
              src={matchedUser.profile_picture}
              alt="icone de perfil"
              id="pfp"
            />
            <h5 id="userName">{matchedUser.name}</h5>
          </>
        );
      }
    };

    // if the keyTyped prop isn't empty it makes the input focus
    useEffect(() => {
      if (props.keyTyped != "" && props.actualPage === "1" && props.isInputFocused === false) {
        inputRef.current.focus();
      }
    }, [props]);

    // checks if enter is pressed and if yes adds the input's value to the array of messages
    const enterTyped = useCallback((event) => {
      if (event.key === "Enter") {
        const newMessage = inputRef.current.value;

        if (newMessage.trim()) {
          const currentTime = getDate();

          setArrayMessage((prev) => [
            ...prev,
            { content: newMessage, owner: "Self", time: currentTime },
          ]);

          inputRef.current.value = "";
        }
      }
    }, [setArrayMessage])
  

    // function that scrolls the messageDiv to view the lastest message
    const scrollToBottom = () => {
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    };


    useEffect(() => {
      const observerConfig = { attributes: false, childList: true, subtree: false };
      
      const mutationFn = (mutationList) => {
        for (const mutation of mutationList) {
          // if it observes a new child node and its className corresponds to messageSelf it scrolls down to bottom
          if (mutation.type === "childList" && mutation.target.lastChild?.children[0]?.className === "messageContainer messageSelf") {
            scrollToBottom();
          }
        }
      };
  

      const observer = new MutationObserver(mutationFn);
  
      if (messagesDiv.current) {
        observer.observe(messagesDiv.current, observerConfig);
      }
  
      return () => {
        observer.disconnect();
      };
    }, []);

    const getDate = () => {
      const date = new Date();
      const hour = date.getHours().toString().padStart(2, '0'); // Format hour to 2 digits
      const minute = date.getMinutes().toString().padStart(2, '0'); // Format minute to 2 digits

      return `${hour}:${minute}`;
  };


  // const saveMessage = () => {
    
  // };

    return (
      <>
        <div id="Chat">
          <header>
            <div id="headerInfoContainer">{headerHandler()}</div>
          </header>

          <div id="messages" ref={messagesDiv}>
            {arrayOfMessages.map((message, index) => {
              return (
                // calls a map into arrayOfMessages which iterates and calls the message component for each message in the array
                <Message
                  key={index}
                  messageOwner={message.owner}
                  messageContent={message.content}
                  ref={messageRef}
                  messageDate = {message.time}
                />
              );
            })}
          </div>

          <div id="inputMessage">
            <div id="otherInputsContainer">
              <button id="emoteBtn">
                <img
                  src={emojiButton}
                  alt="icon for sending emojis"
                  id="emoteBtnIcon"
                />
              </button>

              <button id="inputMedia">
                <img
                  src={insertMediaIcon}
                  alt="icon for inserting media"
                  id="inputMediaIcon"
                />
              </button>
            </div>

            <input type="text" id="input" ref={inputRef} onKeyDown={enterTyped} maxLength="500" />
          </div>
        </div>
      </>
    );
  }

  Chat.propTypes = {
    userClicked: PropTypes.string.isRequired,
    keyTyped: PropTypes.string,
    actualPage: PropTypes.string.isRequired,
    isInputFocused: PropTypes.bool.isRequired
  };

  export default Chat;
