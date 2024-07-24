import PropTypes from 'prop-types';
import './User.css'

function User (props) {

    return (

        <>
        
            <div className="user" style={props.style} onClick={() => {
                props.setUserClicked(props.nickname)
            }}>
                <img src={props.iconUrl} alt="Ícone de usuário" className="userPfp"/>
                <p className="userNickname">{props.nickname}</p>
            </div>
        
        </>

    )

}

User.propTypes = {
    setUserClicked: PropTypes.func.isRequired,
    style: PropTypes.object,
    iconUrl: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired
}

export default User;