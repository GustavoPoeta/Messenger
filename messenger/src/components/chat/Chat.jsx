import "./Chat.css";
import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import insertMediaIcon from "../../assets/imageForInputFile.svg";
import emojiButton from "../../assets/emoji-sunglasses-fill.svg";
import Message from "./message/Message.jsx";
import axios from "axios";

function Chat(props) {


  // Refs to handle DOM elements
  const messagesDiv = useRef(null);
  const messageRef = useRef(null);
  const inputRef = useRef(null);


  // State to manage messages and matched user
  const [arrayOfMessages, setArrayMessage] = useState([]);
  const [matchedUser, setMatchedUser] = useState(null);

  const getMessages = useCallback(() => {
    setArrayMessage(() => []);

    axios.post('http://localhost:3500/getMessages', {
      userID: props.userLogged[0],
      friendID: props.userClicked
    })

      .then ((response) => {

        if (response.data[0] && response.data[0].messages !== "") {

          const messages = response.data[0].messages.split(' ');

          messages.forEach((message) => {
            const [content, owner, time] = message.split(',');

            if (owner == props.userLogged[0] && content !== undefined && owner !== undefined && time !== undefined) {
              
              const sentBy = props.userLogged[0];

              setArrayMessage(prev => [
  
                ...prev,
                {content, sentBy, time},
  
              ]);
            } 
            else if (owner == props.userClicked & content !== undefined & owner !== undefined & time !== undefined) {
              const sentBy = props.userClicked;

              setArrayMessage(prev => [
  
                ...prev,
                {content, sentBy, time},
  
              ]); 
            }
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [props.userClicked, props.userLogged]);

  // useEffect(() => {

  //   const interval = setInterval(() => {
  //     getMessages();
  //   }, 1000);

  //   return () => clearInterval(interval);

  // },[getMessages]);




  // Fetch the user data when a user is clicked
  useEffect(() => {
    if (props.userLogged && props.userClicked) {
      axios.post('http://localhost:3500/getFriends', {
        userID: props.userLogged[0]
      })
      .then((response) => {
        // Find the user that matches the clicked user
        const user = response.data.find(friend => friend.id === props.userClicked);
        setMatchedUser(user || null);
      })
      .catch(err => {
        console.error("Error fetching friends:", err);
      });
    }
  }, [props.userClicked, props.userLogged]);



  // Focus the input when a key is typed and the input is not already focused
  useEffect(() => {
    if (props.keyTyped && props.actualPage === "1" && !props.isInputFocused) {
      inputRef.current.focus();
    }
  }, [props]);




  // Add a new message to the array when Enter is pressed
  const enterTyped = useCallback((event) => {
    if (event.key === "Enter") {
      const newMessage = inputRef.current.value;

      if (newMessage.trim()) {

        const currentTime = getDate();
        setArrayMessage(prev => [
          ...prev,
          { content: newMessage, sentBy: props.userLogged[0], time: currentTime },
        ]);
        inputRef.current.value = "";
      }
    }
  }, [props.userLogged]);




  // Scroll to the bottom of the message list
  const scrollToBottom = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  };




  // Observe DOM mutations to scroll to the latest message
  useEffect(() => {
    const observerConfig = { attributes: false, childList: true, subtree: false };
    
    const mutationFn = (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
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



  // Get current time in HH:MM format
  const getDate = () => {
    const date = new Date();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${hour}:${minute}`;
  };

  
  const storeMessage = useCallback(() => {

    if (arrayOfMessages.length === 0) {

      return;

    } 
    else {

      const lastMessage = arrayOfMessages[arrayOfMessages.length - 1];
      
      if (lastMessage) {

        const message = `${lastMessage.content},${lastMessage.sentBy},${lastMessage.time} `
      
        axios.post('http://localhost:3500/addMessage', {
          userID: props.userLogged[0],
          friendID: props.userClicked,
          message: message
        })

        .then(response => {
          console.log(response);
        }
        )
        .catch (err => {
          {
            throw new Error(err);
        }
        });
      }
    }
  }, [arrayOfMessages, props.userClicked, props.userLogged] );

  useEffect(() => {

    storeMessage();

  }, [arrayOfMessages, storeMessage]);


  const renderMessage = (message, index) => {
    let ownerOfMessage;
  
    if (message.sentBy === props.userLogged[0]) {
      ownerOfMessage = "Self";
    } else if (message.sentBy === props.userClicked) {
      ownerOfMessage = "Friend";
    }
  
    return (
      <Message
        key={index}
        messageOwner={ownerOfMessage}
        messageContent={message.content}
        ref={messageRef}
        messageDate={message.time}
      />
    );
  };
  

  return (
    <>
      <div id="Chat">
        <header>
          <div id="headerInfoContainer">
            {matchedUser ? (
              <>
                <img
                  src={matchedUser.photo || "default-avatar.png"}
                  alt="profile icon"
                  id="pfp"
                />
                <h5 id="userName">{matchedUser.username}</h5>
              </>
            ) : null}
          </div>
        </header>

        <div id="messages" ref={messagesDiv}>

        {arrayOfMessages.map((message, index) => (
            renderMessage(message, index) // Return the rendered message
        ))}

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
          <input
            type="text"
            id="input"
            ref={inputRef}
            onKeyDown={enterTyped}
            maxLength="500"
          />
        </div>
      </div>
    </>
  );
}

Chat.propTypes = {
  userClicked: PropTypes.number.isRequired,
  keyTyped: PropTypes.string,
  actualPage: PropTypes.string.isRequired,
  isInputFocused: PropTypes.bool.isRequired,
  userLogged: PropTypes.array.isRequired
};

export default Chat;
