import './Login.css';
import logo from '../../assets/logo.png';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import axios from 'axios';

function Login () {

    const [page, setPage] = useState("login");
    const emailInput = useRef(null);
    const usernameInput = useRef(null);
    const passwordInput = useRef(null);

    const noPlaceholderOnFocus = (event) => {
       event.target.placeholder = ""
    };
    const placeholderOnBlur = (event) => {

        if (event.target.id === "email") {
            event.target.placeholder = "type your email";
        }
            else if (event.target.id === "password") {
                event.target.placeholder = "type your password";
            }
            else if (event.target.id === "username") {
                event.target.placeholder = "type your username";
            }
        
    };


    const randomId = () => {
        return Math.floor(Math.random() * 9999999999);
    }

    const handleLogin = () => {

        if (page === "login") {

            axios.post('http://localhost:3500/newUser', {
                id: `${randomId()}`,
                username: `${usernameInput}`,
                email: `${emailInput}`,
                password: `${passwordInput}`
                })

                .then(response => {
                    console.log(response);
                })

                .catch(err => {
                    console.error(err);
                })

        } 
        else if (page === "sign") {
            axios.get('http://localhost:3500/users', {
            
            })
        }
        
    }



    return (
        <>
            <main>
                <div id="loginContainer">

                    <img src={logo} alt="Logo" id='loginLogo' draggable= "false" />

                    <h1 id='loginTitle'>Owl</h1>

                    <div style={{marginBottom: "20px", marginTop: "10px"}}>

                        {page !== "login" ? <input type="text" id='username' className='input' placeholder='type your username' onFocus={noPlaceholderOnFocus} ref={usernameInput} onBlur={placeholderOnBlur}/> : null}

                        <input type="email" id='email' className='input' placeholder='type your email' onFocus={noPlaceholderOnFocus} ref={emailInput} onBlur={placeholderOnBlur}/>
                    
                        <input type="password" id='password' className='input' placeholder='type your password' onFocus={noPlaceholderOnFocus} ref={passwordInput} onBlur={placeholderOnBlur} />

                        {page === "login" ? <p id='changePage' onClick={() => setPage("sign")}>Sign-in</p> : <p id='changePage' onClick={() => setPage("login")}>Log-in</p>}

                    </div>

                    {page === "login" ? <button className='submitBtn' id='logBtn' onClick={handleLogin}>Login</button> : <button className='submitBtn' id='signBtn' onClick={handleLogin}>Sign in</button>}
                </div>
            </main>  
        </>
    );
}

Login.propTypes = {
    isUserLog: PropTypes.bool.isRequired
}

export default Login;
