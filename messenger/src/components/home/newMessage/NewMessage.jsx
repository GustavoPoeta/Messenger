import "./NewMessage.css";
import PropTypes from "prop-types";

function NewMessage(props) {

  return (
    <>
        
      <div className="newMessage" onClick={() => {
        props.setActualPage("1");
        props.setUserClicked(props.messageOwnerID);
      }}>

        <div className="profileInfo">

          <img src={props.profilePicture} alt="Profile Picture" className="newMessagePfp" />
          <div className="newMessageName">{props.messageOwner}</div>

        </div>

        <div className="message">

          <p>{props.messageContent}</p>
          <div className="numberOfMessages">{props.messageNumberNew}</div>
          
        </div>

    </div>

    </>
  );
}

NewMessage.propTypes = {
  setActualPage: PropTypes.func.isRequired,
  setUserClicked: PropTypes.func.isRequired,
  messageOwnerID: PropTypes.number.isRequired,
  profilePicture: PropTypes.string.isRequired,
  messageOwner: PropTypes.string.isRequired,
  messageContent: PropTypes.string.isRequired,
  messageNumberNew: PropTypes.number.isRequired
}

export default NewMessage;
