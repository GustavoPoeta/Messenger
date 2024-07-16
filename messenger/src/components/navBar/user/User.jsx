import './User.css'

function User (props) {

    
    return (

        <>
        
            <div class="user" style={props.style}>
                <img src={props.iconUrl} alt="Ícone de usuário" className="userPfp"/>
                <p className="userNickname">{props.nickname}</p>
            </div>
        
        </>

    )

}


export default User;