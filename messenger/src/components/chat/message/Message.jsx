import './Message.css';
import PropTypes from "prop-types";
import usersJson from '../../../assets/users.json';
import { forwardRef } from 'react';

function Message(props, messageRef) {
  const container = `container container${props.messageOwner}`;
  const messageContainer = `messageContainer message${props.messageOwner}`;

  // Function to determine which style to use based on messageOwner
  const checkOwner = () => {
    if (props.messageOwner === "Self") {
      return (
        <div className={container} ref={messageRef}>
          <div className={messageContainer}>
            <p className='messageContent'>{props.messageContent}</p>
          </div>
          <img
            src={
              usersJson.users.find(user => user.username === "Self")?.profile_picture
            }
            alt="message owner's icon"
            className="messageOwnerPfp"
          />
          <p className='messageTime'>{props.messageDate}</p>
        </div>
      );
    } else {
      return (
        <div className={container} ref={messageRef}>
          <p className='messageTime'>{props.messageDate}</p>
          <img
            src={
              usersJson.users.find(user => user.username === props.messageOwner)?.profile_picture
            }
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
  messageDate: PropTypes.string.isRequired
};

export default MessageComponent;
