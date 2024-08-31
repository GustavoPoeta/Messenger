import PropTypes from 'prop-types';
import User from './user/User';
import users from '../../assets/users.json';
import './NavBar.css';
import logo from '../../assets/logo.png';
import optionsIcon from '../../assets/gear-fill.svg'
import addFriendIcon from '../../assets/person-plus-fill.svg';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

function NavBar(props) {

    const addFriendInput = useRef(null);
    const [friendsList, setFriendsList] = useState([]);

    // Navigate to the home page
    const goHome = useCallback(() => {
        props.setUserClicked("");
        props.setActualPage("0");
    }, [props]);

    // Navigate to the options page
    const goOptions = useCallback(() => {
        props.setActualPage("2");
    }, [props]);

    // Adjust border-bottom styling for the last user in the list
    const borderChange = useCallback((index) => {
        if (index === users.users.length - 1) {
            return { borderBottom: 'none' };
        }
        return {};
    }, []);

    // Set focus state when input is focused
    const handleFocus = () => {
        props.setInputFocused(true);
    };

    // Remove focus state when input loses focus
    const handleBlur = () => {
        props.setInputFocused(false);
    };

    // Add a new friend when Enter is pressed
    const addFriend = (event) => {
        if(event.key === "Enter") {
            axios.post('http://localhost:3500/checkFriend', {
                userID: props.userLogged[0],
                friendID: addFriendInput.current.value
            })
                .then((response) => {

                    if (response.status === 200) {

                        axios.post('http://localhost:3500/addFriend', {
                            userID: props.userLogged[0],
                            friendID: addFriendInput.current.value
                        })
                            .then(response => {
                                console.log(response.data);
                                setTimeout(() => {
                                    addFriendInput.current.value = "";
                                }, 500)
                            })
                            .catch(err => {
                                throw new Error(err);
                            });
                    }
                })
                .catch((err) => {
                    console.error(err);
                }); 
            }
    };

    // Fetch the list of friends from the server
    const getFriends = useCallback(() => {
        axios.post('http://localhost:3500/getFriends', {
            userID: props.userLogged[0],
        })
            .then(response => {
                setFriendsList(response.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, [props.userLogged]);

    // Set up polling to refresh the friends list every second
    useEffect(() => {
        getFriends();
        const interval = setInterval(() => {
            getFriends();
        }, 1000);

        return () => clearInterval(interval);
    }, [friendsList, getFriends]);

    return (
        <>
            <div id="navBar">
                <header id='navbarHeader'>
                    <img src={addFriendIcon} alt="add a friend button" id='AddFriendIcon' />
                    <input
                        type="text"
                        id="addFriendInput"
                        placeholder="Type your friend's id"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyUp={addFriend}
                        ref={addFriendInput}
                    />
                </header>

                {/* List of contacts the user has */}
                <div id="contacts">
                    {
                        friendsList.map((object, index) => (
                            <User
                                style={borderChange(index)}
                                key={object.index}
                                nickname={object.username}
                                id={object.id}
                                iconUrl={object.photo}
                                setUserClicked={props.setUserClicked}
                                setActualPage={props.setActualPage}
                            />
                        ))
                    }
                </div>

                <div id='navOptions'>
                    <img
                        src={logo}
                        alt="button to go to home with night owl's icon"
                        id='navbarHomeIcon'
                        onClick={goHome}
                    />
                    <img
                        src={optionsIcon}
                        alt="button to go to the options"
                        id='navbarOptionsIcon'
                        onClick={goOptions}
                    />
                </div>
            </div>
        </>
    );
}

NavBar.propTypes = {
    setUserClicked: PropTypes.func.isRequired,
    setInputFocused: PropTypes.func.isRequired,
    setActualPage: PropTypes.func.isRequired,
    userLogged: PropTypes.array.isRequired
};

export default NavBar;
