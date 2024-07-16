import messagesJson from "../../../assets/newMsg.json";
import usersJson from "../../../assets/users.json";
import "./NewMessage.css";

function NewMessage() {
  return (
    <>

        {/* dinamically adds newMessage while there's new messages in the json*/}
      {Object.keys(messagesJson.newMessages).map((userName) => {
        const userMessage = messagesJson.newMessages[userName];
        const user = usersJson.users.find((user) => user.name === userName); // check if the name of the user in the messagesJson is registered in usersJson

        if (user) {
          return (
            <div className="newMessage" key={userName}>
              <div className="profileInfo">
                <img
                  src={user.profile_picture}
                  alt="Profile Icon"
                  className="newMessagePfp"
                />
                <h4 className="newMessageName">{user.name}</h4>

                <div className="status">
                  <p>{user.status}</p>
                </div>
              </div>
              <div className="message">
                <p>{userMessage.LastNewMessage}</p>
                <div className="numberOfMessages">
                    <p>{userMessage.howMany}</p>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })}
    </>
  );
}

export default NewMessage;
