import './Chat.css';
import { useState, useEffect, useRef } from 'react';
import users from '../../assets/users.json';
import PropTypes from 'prop-types';
import insertMediaIcon from '../../assets/imageForInputFile.svg';
import emojiButton from '../../assets/emoji-sunglasses-fill.svg';
import Message from './message/Message.jsx'
 
function Chat (props) {

    const [arrayOfMessages, setArrayMessage] = useState([]);

    const headerHandler = () => {
        const matchedUser = users.users.find(user => user.name === props.userClicked);

        if (matchedUser) {
            return (
                <>
                    <img src={matchedUser.profile_picture} alt="icone de perfil" id='pfp' />
                    <h5 id='userName'>{matchedUser.name}</h5>
                </>
            );
        }
    }

    const inputRef = useRef(null);

    // if the keyTyped prop isn't empty it makes the input focus
    useEffect(() => {
        if (props.keyTyped != "") {
            inputRef.current.focus();
        } 
    }, [props.keyTyped]);


    // checks if enter is pressed and if yes adds the input's value to the array of messages
    const enterTyped = (event) => {
        if (event.key == "Enter") {

            const newMessage = inputRef.current.value;

            if (newMessage.trim()) {
                setArrayMessage((prev) => [...prev, {content: newMessage, owner: "Self"}] )
            }

            inputRef.current.value = '';
        } 
    }



    return (
        <>
        
            <div id='Chat'>
                
                <header>
                    <div id='headerInfoContainer'>
                        {
                            headerHandler()
                        }
                    </div>
                </header>

                <div id="messages">
                    {arrayOfMessages.map((message, index) => {
                        return (
                            // calls a map into arrayOfMessages which iterates and calls the message component for each message in the array
                            <Message key = {index} messageOwner = {message.owner} messageContent = {message.content}/>
                        );
                    })}
                </div>
                
                <div id="inputMessage">

                    <div id='otherInputsContainer'>

                        <button id='emoteBtn'>
                            <img src={emojiButton} alt="icon for sending emojis" id='emoteBtnIcon' />
                        </button>

                        <button id='inputMedia'><img src={insertMediaIcon} alt="icon for inserting media" id='inputMediaIcon'/></button>
                        
                    </div>

                    <input type="text" id='input' ref={inputRef} onKeyDown={enterTyped}/>

                </div>
            </div>

        </>
    )

}

Chat.propTypes = {
    userClicked: PropTypes.string.isRequired,
    keyTyped: PropTypes.string
}

export default Chat;