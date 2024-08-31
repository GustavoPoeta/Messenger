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
  const [time, setTime] = useState('');

  const getMessages = useCallback(() => {
    axios
      .post("http://localhost:3500/getMessages", {
        userID: props.userLogged[0],
        friendID: props.userClicked,
      })
      .then((response) => {
        setArrayMessage(response.data);
      })
      .catch((err) => console.error("Error fetching messages:", err));
  }, [props.userClicked, props.userLogged]);

  useEffect(() => {
    const interval = setInterval(() => {
      getMessages();
    }, 200);

    return () => clearInterval(interval);
  }, [getMessages]);

  // Get current time in HH:MM format
  const getDate = () => {
    const date = new Date();

    const timestamp = date.toISOString().slice(0, 19).replace('T', ' '); // 'YYYY-MM-DD HH:MM:SS'
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");

    setTime(timestamp);

    return `${hour}:${minute}`;
  };

  // Fetch the user data when a user is clicked
  useEffect(() => {
    if (props.userLogged && props.userClicked) {
      axios
        .post("http://localhost:3500/getFriends", {
          userID: props.userLogged[0],
        })
        .then((response) => {
          const user = response.data.find(
            (friend) => friend.id === props.userClicked
          );
          setMatchedUser(user || null);
        })
        .catch((err) => {
          console.error("Error fetching friends:", err);
        });
    }
  }, [props.userClicked, props.userLogged]);

  // Focus the input when a key is typed and the input is not already focused
  useEffect(() => {
    if (props.keyTyped && props.actualPage === "1" && !props.isInputFocused) {
      inputRef.current.focus();
    }
  }, [props.keyTyped, props.actualPage, props.isInputFocused]);

  // Add a new message to the array when Enter is pressed
  const enterTyped = useCallback(
    (event) => {
      if (event.key === "Enter") {
        const newMessage = inputRef.current.value;

        if (newMessage.trim()) {
          const currentTime = getDate();

          setArrayMessage((prev) => [
            ...prev,
            { content: newMessage, sentBy: props.userLogged[0], time: currentTime },
          ]);

          inputRef.current.value = "";
        }
      }
    },
    [props.userLogged]
  );

  // Scroll to the bottom of the message list
  const scrollToBottom = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Observe DOM mutations to scroll to the latest message
  useEffect(() => {
    scrollToBottom();
  }, [arrayOfMessages]);

  const storeMessage = useCallback(() => {
    if (arrayOfMessages.length === 0) return;

    const lastMessage = arrayOfMessages[arrayOfMessages.length - 1];
    
    if (lastMessage && !lastMessage.fromDB) {

      axios.post("http://localhost:3500/addMessage", {
        userID: props.userLogged[0],
        friendID: props.userClicked,
        messageContent: lastMessage.content,
        messageTime: time // time from useState
      })
      .then(response => console.log(response))
      .catch(err => console.error("Error storing message:", err));
    }
  }, [arrayOfMessages, props.userClicked, props.userLogged]);

  useEffect(() => {
    storeMessage();
  }, [arrayOfMessages, storeMessage]);

  const renderMessage = (message, index) => {

    if(message !== null && message.timestamp) {
      const ownerOfMessage = 
      Number(message.userID) === props.userLogged[0] ? "Self" : "Friend";

      //message.timestamp

      const [date, time] = message.timestamp.split('T');
      const timeCleaned = time.replace(/\.\d+/, '').replace(/Z$/, '');
      
      return (
        <Message
          key={index}
          messageOwner={ownerOfMessage}
          messageContent={message.content}
          ref={messageRef}
          messageDate={timeCleaned}
          userLogged={props.userLogged}
        />
      );
    }
  };

  return (
    <div id="Chat">
      <header>
        <div id="headerInfoContainer">
          {matchedUser && (
            <>
              <img
                src={matchedUser.photo || "default-avatar.png"}
                alt="profile icon"
                id="pfp"
              />
              <h5 id="userName">{matchedUser.username}</h5>
            </>
          )}
        </div>
      </header>

      <div id="messages" ref={messagesDiv}>
        {arrayOfMessages.map((message, index) => renderMessage(message, index))}
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
  );
}

Chat.propTypes = {
  userClicked: PropTypes.number.isRequired,
  keyTyped: PropTypes.string,
  actualPage: PropTypes.string.isRequired,
  isInputFocused: PropTypes.bool.isRequired,
  userLogged: PropTypes.array.isRequired,
};

export default Chat;
