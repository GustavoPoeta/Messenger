import NewMessage from './newMessage/NewMessage';
import PropTypes from 'prop-types';
import './Home.css';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

function Home(props) {
    const [newMessages, setNewMessages] = useState([]);
    const [profilePictures, setProfilePictures] = useState({});
    const [usernames, setUsernames] = useState({});

    // Fetch new messages
    const getNewMessages = useCallback(() => {
        axios.post('http://localhost:3500/getNewMessages', {
            userID: props.userLogged[0]
        })
        .then(response => {
            console.log(response.data)
            setNewMessages(response.data)
        })
        .catch(err => props.setErrorMsg(err.response?.data?.error || "An error occurred"));
    }, [props]);

    useEffect(() => {
        getNewMessages();

        const interval = setInterval(() => {
            getNewMessages();
        }, 1000);

        return () => clearInterval(interval);
    }, [getNewMessages]);

    // Fetch profile pictures and usernames
    const getProfileInfo = useCallback((friendID) => {
        axios.post('http://localhost:3500/getInfo', { id: friendID })
        .then(response => {
            setProfilePictures(prev => ({
                ...prev,
                [friendID]: response.data[0].photo
            }));
            setUsernames(prev => ({
                ...prev,
                [friendID]: response.data[0].username
            }));
        })
        .catch(err => props.setErrorMsg(err.response?.data?.error || "An error occurred"));
    }, [props]);

    useEffect(() => {
        const friendIDs = newMessages.map(group => group.friendID);
        friendIDs.forEach(friendID => {
            if (!profilePictures[friendID] || !usernames[friendID]) {
                getProfileInfo(Number(friendID));
            }
        });
    }, [newMessages, profilePictures, usernames, getProfileInfo]);

    const renderMessages = (messagesArray) => {
        return messagesArray.map((messageGroup) => {
            const lastMessage = messageGroup.messages[messageGroup.messages.length - 1];
            
            if( lastMessage ) {
                return (
                    <NewMessage
                        key={lastMessage.timestamp}
                        profilePicture={profilePictures[messageGroup.friendID] || ''}
                        messageOwner={usernames[messageGroup.friendID] || ''}
                        messageContent={lastMessage.content}
                        messageNumberNew={messageGroup.messages.length}
                        setActualPage={props.setActualPage}
                        setUserClicked={props.setUserClicked}
                        messageOwnerID={messageGroup.messages[0].friendID}
                    />
                );
            }
        });
    };

    return (
        <div id="home">
            {Array.isArray(newMessages) && newMessages.length > 0
                ? renderMessages(newMessages)
                : null
            }
        </div>
    );
}

Home.propTypes = {
    userLogged: PropTypes.array.isRequired,
    setErrorMsg: PropTypes.func.isRequired,
    setActualPage: PropTypes.func.isRequired,
    setUserClicked: PropTypes.func.isRequired
};

export default Home;
