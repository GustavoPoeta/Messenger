import './Message.css';
import PropTypes from "prop-types";
import { forwardRef, useCallback, useEffect, useState } from 'react';
import axios from 'axios';


function Message(props, messageRef) {
  const container = `container container${props.messageOwner}`;
  const messageContainer = `messageContainer message${props.messageOwner}`;

  const [userPhoto, setUserPhoto] = useState(''); 

  const getPfp = useCallback(() => {
    axios
      .post('http://localhost:3500/getInfo', {
        email: props.userLogged[1]
      })
      .then((response) => {
        setUserPhoto(() => response.data[0].photo);
      })
  }, [props.userLogged]);

  useEffect(() => {
    getPfp();
  }, [props.messageOwner]);

  // Function to determine which style to use based on messageOwner
  const checkOwner = () => {
    if (props.messageOwner === "Self") {
      return (
        <div className={container} ref={messageRef}>
          <div className={messageContainer}>
            <p className='messageContent'>{props.messageContent}</p>
          </div>
          <img
            src={userPhoto}
            alt="message owner's icon"
            className="messageOwnerPfp"
          />
          <p className='messageTime'>{props.messageDate}</p>
        </div>
      );

    } 
    
    else {
      return (
        <div className={container} ref={messageRef}>
          <p className='messageTime'>{props.messageDate}</p>
          <img
            src={userPhoto}
            alt="message owner's icon"
            className="messageOwnerPfp"
          />
          <div className={messageContainer}>
            <p className='messageContent'>{props.messageContent}</p>
          </div>
        </div>
      );
    }
  }

  return <>{checkOwner()}</>;
}

const MessageComponent = forwardRef(Message);

Message.propTypes = {
  messageContent: PropTypes.string.isRequired,
  messageOwner: PropTypes.string.isRequired,
  messageDate: PropTypes.string.isRequired,
  userLogged: PropTypes.array.isRequired
};

export default MessageComponent;
