import './Login.css';
import logo from '../../assets/logo.png';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import axios from 'axios';

function Login (props) {

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


    const handleLogin = (event) => {

        event.preventDefault();

        if (page === "sign") {

            axios.post('http://localhost:3500/newUser', {

                username: `${usernameInput.current.value}`,
                email: `${emailInput.current.value}`,
                password: `${passwordInput.current.value}`

            })

                .then(response => {

                    console.log(response);
                    props.setUserLogged(`${emailInput.current.value}`);

                })

                .catch(err => {

                    console.error(err);

                })

        } 
        else if (page === "login") {

            axios.post('http://localhost:3500/users', {
                email: `${emailInput.current.value}`,
                password: `${passwordInput.current.value}`
            })

            .then (response => {
                
                if (response.status === 200) {

                    props.setUserLogged(() => [ response.data[0], response.data[1] ] );
                    
                }

            })

            .catch (err => {
                console.error(err);
            })
        }
        
    }



    return (
        <>
            <main>
                <div id="loginContainer">

                    <img src={logo} alt="Logo" id='loginLogo' draggable= "false" />

                    <h1 id='loginTitle'>Owl</h1>

                    <form id='form'>

                        <div style={{marginBottom: "20px", marginTop: "10px"}}>

                                {page !== "login" ? <input type="text" id='username' className='input'
                                    required
                                    placeholder='type your username'
                                    onFocus={noPlaceholderOnFocus}
                                    ref={usernameInput}
                                    onBlur={placeholderOnBlur}
                                    /> 
                                    :
                                    null}



                                <input type="email" id='email' className='input'
                                    required
                                    placeholder='type your email' 
                                    onFocus={noPlaceholderOnFocus} 
                                    ref={emailInput} 
                                    onBlur={placeholderOnBlur}
                                />


                            
                                <input type="password" id='password' className='input' 
                                    required
                                    placeholder='type your password' 
                                    onFocus={noPlaceholderOnFocus} 
                                    ref={passwordInput} 
                                    onBlur={placeholderOnBlur} 
                                />
                            



                            {page === "login" ?
                            <p id='changePage' onClick={() => setPage("sign")}>Sign-in</p> 
                                :
                            <p id='changePage' onClick={() => setPage("login")}>Log-in</p>}


                        </div>

                        {page === "login" ?
                        <input type='submit' className='submitBtn' id='logBtn' onClick={handleLogin} value="Login" />
                        : 
                        <input type='submit' className='submitBtn' id='signBtn' onClick={handleLogin} value="Sign In"/ >
                        }

                    </form>
                </div>
            </main>  
        </>
    );
}


Login.propTypes = {
    setUserLogged: PropTypes.func.isRequired,
    userLogged: PropTypes.array.isRequired
}

export default Login;
