import './Message.css';
import Proptypes from "prop-types";
import usersJson from '../../../assets/users.json';
import { forwardRef } from 'react';

function Message (props, messageRef) {
        
    const container = `container container${props.messageOwner}`
    const messageContainer = `messageContainer message${props.messageOwner}`


    // check if the message owner is the user
    const checkOwner = () => {
        if (props.messageOwner === "Self") {
            return (
                <div className={container} ref={messageRef}>

                        <div className={messageContainer}>
                            <p className='messageContent'>
                                {
                                    props.messageContent
                                }
                            </p>
                        </div>

                        <img src={
                            usersJson.users.map((user) => {
                                return user.profile_picture;
                            })
                        } alt="message owner's icon" className="messageOwnerPfp"/>

                        <p className='messageTime'>{props.messageDate}</p>

                    </div>
            );
        } 
            else if (typeof(props.messageOwner) === String && props.messageOwner != "Self") {
                return (
                    <div className={container} ref={messageRef}>

                        <p className='messageTime'>{props.messageDate}</p>

                        <img src={
                            usersJson.users.map((user) => {
                                return user.profile_picture;
                            })
                        } alt="message owner's icon" className="messageOwnerPfp"/>

                        <div className={messageContainer}>
                            <p className='messageContent'>
                                {
                                    props.messageContent
                                }
                            </p>
                        </div>

                    </div>
                );
            }
    }

    return (
        <>
            {checkOwner()}
        </>
    );
}

const MessageComponent = forwardRef(Message);

Message.propTypes = {
    messageContent: Proptypes.string.isRequired,
    messageOwner: Proptypes.string.isRequired,
    messageDate: Proptypes.string.isRequired
}

export default MessageComponent;