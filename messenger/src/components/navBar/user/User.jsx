import PropTypes from 'prop-types';
import removeFriend from '../../../assets/person-dash-fill.svg';
import './User.css'
import axios from 'axios';

function User (props) {

    return (

        <>
        
            <div className="user" style={props.style}>
                <div onClick={() => {
                    props.setUserClicked(props.id);
                    props.setActualPage("1");
                }} style={{display: "flex", alignItems: "center"}}>
                    <img src={props.iconUrl} alt="Ícone de usuário" className="userPfp"/>
                    <p className="userNickname">{props.nickname}</p>
                </div>

                <img src={removeFriend} alt='remove friend button' id='removeFriendBtn' onClick={() => {
                    axios.post('http://localhost:3500/removeFriend', {
                        userID: props.userLogged[0],
                        friendID: props.userID
                    })
                    .then(() => {
                        props.setActualPage("0");
                    })
                    .catch(err => {
                        props.setErrorMsg(err.response.data.error);
                    });
                }}/>
            </div>
        
        </>

    )

}

User.propTypes = {
    setUserClicked: PropTypes.func.isRequired,
    style: PropTypes.object,
    iconUrl: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    setActualPage: PropTypes.func.isRequired,
    userLogged: PropTypes.array.isRequired,
    userID: PropTypes.number.isRequired,
    setErrorMsg: PropTypes.func.isRequired
}

export default User;