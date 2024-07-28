import './Message.css';
import Proptypes from "prop-types";
import usersJson from '../../../assets/users.json';

function Message (props) {
        
    const container = `container container${props.messageOwner}`
    const messageContainer = `messageContainer message${props.messageOwner}`

    return (
        <>
                    <div className={container}>

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

                    </div>
                </>
    );
}


Message.propTypes = {
    messageContent: Proptypes.string.isRequired,
    messageOwner: Proptypes.string.isRequired
}

export default Message;