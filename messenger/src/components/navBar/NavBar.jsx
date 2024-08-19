import PropTypes from 'prop-types';
import User from './user/User';
import users from '../../assets/users.json';
import './NavBar.css';
import logo from '../../assets/logo.png';
import optionsIcon from '../../assets/gear-fill.svg'
import addFriendIcon from '../../assets/person-plus-fill.svg';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

function NavBar (props) {

    const addFriendInput = useRef(null);
    const [friendsList, setFriendsList] = useState([]);

    const goHome = useCallback(() => {
        props.setUserClicked("");
        props.setActualPage("0");
    }, [props]); // sets userClicked to "" so the page goes home


    const goOptions = useCallback(() => {
        props.setActualPage("2");
    }, [props]);


    const borderChange = useCallback((index) => {
        if (index === users.users.length - 1) {
            return { borderBottom: 'none' };
        }
        return {};
    }, []); // change the border-bottom property if the current user on the map method is the last.


    const handleFocus = () => {
        props.setInputFocused(true);
    };


    const handleBlur = () => {
        props.setInputFocused(false);
    };

    const addFriend = (event) => {

        if(event.key === "Enter") {

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
                }) 

        }

    };

    const getFriends = useCallback(() => {
        
        axios.post('http://localhost:3500/getFriends', {
            userID: props.userLogged[0]
        })
            .then(response => {
                console.log(response.data);
                setFriendsList(response.data);                
            })
            .catch(err => {
                console.error (err);
            });

    }, [props.userLogged])

  useEffect(() => {
    const interval = setInterval(() => {
        getFriends();
    }, 1000);

    return () => clearInterval(interval);
  }, [friendsList, getFriends])

    return (
        <>
        
            <div id="navBar">

                <header id='navbarHeader'>
                    <img src={addFriendIcon} alt="add a friend button" id='AddFriendIcon' />
                    <input type="text" id="addFriendInput" placeholder="Type your friend's id"
                     onFocus={handleFocus}
                     onBlur={handleBlur}
                     onKeyUp={addFriend}
                     ref={addFriendInput}
                     />
                </header>

                {/* list of contacts the user has */}
                <div id="contacts">
                    {
                        friendsList.map((object, index) => (
                            <User 
                                style= {borderChange(index)} 
                                key= {object.index} 
                                nickname= {object.username} 
                                iconUrl={object.photo} 
                                setUserClicked = {props.setUserClicked}
                                setActualPage = {props.setActualPage}
                            />
                        ))
                    }
                </div>

                <div id='navOptions'>

                    <img src={logo} alt="button to go to home with night owl's icon" id='navbarHomeIcon' onClick={goHome}/>

                    <img src={optionsIcon} alt="button to go to the options" id='navbarOptionsIcon' onClick={goOptions}/>

                </div>

            </div>
        
        </>
    )
}

NavBar.propTypes = {
    setUserClicked: PropTypes.func.isRequired,
    setInputFocused: PropTypes.func.isRequired,
    setActualPage: PropTypes.func.isRequired,
    userLogged: PropTypes.array.isRequired
}

export default NavBar;