import './Login.css';
import logo from '../../assets/logo.png';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import axios from 'axios';

function Login(props) {
    const [page, setPage] = useState("login"); // Toggle between "login" and "sign"
    const inputArray = useRef([]);
    const submitArray = useRef([]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    // Clear placeholder text on focus
    const noPlaceholderOnFocus = (event) => {
        event.target.placeholder = "";
    };

    // Restore placeholder text on blur and update form data
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

        const {id, value} = event.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    // Handle form submission for login or sign up
    const handleLogin = (event) => {
        event.preventDefault();

        if (page === "sign") {
            axios.post('http://localhost:3500/newUser', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            })
            .then(response => {
                console.log(response);
                props.setUserLogged([formData.email]);
            })
            .catch(err => {
                props.setErrorMsg(err.response.data.error);
                console.error(err);
            });
        }
        else if (page === "login") {
            axios.post('http://localhost:3500/users', {
                email: formData.email,
                password: formData.password
            })
            .then(response => {
                if (response.status === 200) {
                    props.setUserLogged([response.data[0], response.data[1]]);
                }
            })
            .catch(err => {
                props.setErrorMsg(err.response.data.error);
                console.error(err);
            });
        }
    };

    // Move focus to the next input field on Enter key press
    const goToNextInput = (event) => {
        if (event.key === "Enter") {
            const inputs = Array.from(event.currentTarget.form.elements);
            const currentIndex = inputs.indexOf(event.target);

            if (currentIndex > -1 && currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus();
            } else if (page === "login" && currentIndex === inputs.length - 1) {
                event.currentTarget.click();
            } else if (page === "sign" && currentIndex === inputs.length - 1) {
                event.currentTarget.click();
            }
        }
    };

    return (
        <>
            <main>
            

                <div id="loginContainer">
                    <img src={logo} alt="Logo" id='loginLogo' draggable="false" />
                    <h1 id='loginTitle'>Owl</h1>
                    <form id='form'>
                        <div style={{ marginBottom: "20px", marginTop: "10px" }}>
                            {page !== "login" ? (
                                <input
                                    type="text"
                                    id='username'
                                    className='input'
                                    required
                                    placeholder='type your username'
                                    onFocus={noPlaceholderOnFocus}
                                    ref={(element) => inputArray.current.push(element)}
                                    onBlur={placeholderOnBlur}
                                    onKeyUp={goToNextInput}
                                />
                            ) : null}
                            <input
                                type="email"
                                id='email'
                                className='input'
                                required
                                placeholder='type your email'
                                onFocus={noPlaceholderOnFocus}
                                ref={(element) => inputArray.current.push(element)}
                                onBlur={placeholderOnBlur}
                                onKeyUp={goToNextInput}
                            />
                            <input
                                type="password"
                                id='password'
                                className='input'
                                required
                                placeholder='type your password'
                                onFocus={noPlaceholderOnFocus}
                                ref={(element) => inputArray.current.push(element)}
                                onBlur={placeholderOnBlur}
                                onKeyUp={goToNextInput}
                            />
                            {page === "login" ? (
                                <p id='changePage' onClick={() => setPage("sign")}>Sign-in</p>
                            ) : (
                                <p id='changePage' onClick={() => setPage("login")}>Log-in</p>
                            )}
                        </div>
                        {page === "login" ? (
                            <input
                                type='submit'
                                className='submitBtn'
                                id='logBtn'
                                onClick={handleLogin}
                                ref={(element) => submitArray.current.push(element)}
                                value="Login"
                            />
                        ) : (
                            <input
                                type='submit'
                                className='submitBtn'
                                id='signBtn'
                                onClick={handleLogin}
                                value="Sign In"
                                ref={(element) => submitArray.current.push(element)}
                            />
                        )}
                    </form>
                </div>
            </main>
        </>
    );
}

Login.propTypes = {
    setUserLogged: PropTypes.func.isRequired,
    userLogged: PropTypes.array.isRequired,
    setErrorMsg: PropTypes.func.isRequired
};

export default Login;
