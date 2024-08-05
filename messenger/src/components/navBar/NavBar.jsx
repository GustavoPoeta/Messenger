import PropTypes from 'prop-types';
import User from './user/User';
import users from '../../assets/users.json';
import './NavBar.css';
import logo from '../../assets/logo.png';
import optionsIcon from '../../assets/gear-fill.svg'
import addFriendIcon from '../../assets/person-plus-fill.svg';
import { useCallback } from 'react';

function NavBar (props) {

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
        console.log("a")
    }

    const handleBlur = () => {
        props.setInputFocused(false);
        console.log("b")
    }

    return (
        <>
        
            <div id="navBar">

                <header id='navbarHeader'>
                    <img src={addFriendIcon} alt="add a friend button" id='AddFriendIcon' />
                    <input type="text" id="addFriendInput" placeholder="Type your friend's id"
                     onFocus={handleFocus}
                     onBlur={handleBlur}
                     />
                </header>

                {/* list of contacts the user has */}
                <div id="contacts">
                    {
                        users.users.map((user, index) => (
                            <User style= {borderChange(index)} 
                            key= {user.index} 
                            nickname= {user.name} 
                            iconUrl={user.profile_picture} 
                            setUserClicked = {props.setUserClicked}
                            setActualPage = {props.setActualPage}
                            />
                        )) // dinamically calls the user component for every user in the json file.
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
}

export default NavBar;