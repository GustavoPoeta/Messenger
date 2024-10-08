import './Options.css';
import editIcon from '../../assets/pencil-square.svg';
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const Options = (props) => {
    // Refs to access input elements directly
    const inputName = useRef(null);
    const inputEmail = useRef(null);

    // State to track whether inputs are disabled or editable
    const [disabledInputs, setDisabledInputs] = useState({
        name: true,
        email: true
    });
    const [userPhoto, setUserPhoto] = useState('');

    useEffect(() => {

        axios.post('http://localhost:3500/getInfo', {
            id: props.userLogged[0]
        })
            .then((response) => {
                console.log(response.data[0].photo)
                setUserPhoto(response.data[0].photo)
            })
            .catch(err => props.setErrorMsg(err));

    }, [props, props.userLogged])

    // Toggles the disabled state of input fields and sets focus
    const toggleInputDisabledState = (inputKey) => {
        setDisabledInputs(prev => ({
            ...prev,
            [inputKey]: !prev[inputKey]
        }));
        props.setInputFocused(true); // Ensures the input is focused
    };

    // Updates the input values in the parent component state
    const updateInputValue = (e) => {
        const { id, value } = e.target;
        props.setInputValues(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Sends a request to update the user's name if valid
    const updateUserName = () => {
        const inputValue = inputName.current.value;
        const spaces = inputValue.split('').filter(char => char === " ").length;

        // Only update if input is not empty or does not only contain spaces
        if (spaces < inputValue.length || inputValue !== "") {
            axios.post('http://localhost:3500/changeName', {
                newName: inputValue,
                email: props.userLogged[1]
            })
                .then(response => console.log(response))
                .catch(err => {
                    props.setErrorMsg(err.response.data.error);
                });
        }
    };

    // Sends a request to update the user's email if valid
    const updateUserEmail = () => {
        const inputValue = inputEmail.current.value;
        const spaces = inputValue.split('').filter(char => char === " ").length;

        // Only update if input is not empty or does not only contain spaces
        if (spaces < inputValue.length || inputValue !== "") {
            axios.post('http://localhost:3500/changeEmail', {
                email: props.userLogged[1],
                newEmail: inputValue
            })
                .then(response => console.log(response))
                .catch(err => {
                    props.setErrorMsg(err.response.data.error);
                });
        }
    };

    // Handles the click event for editing input fields
    const toggleEditMode = (event) => {
        if (event.target.id === "editName") {
            if (!disabledInputs.name) {
                updateUserName();
            }
            toggleInputDisabledState('nameInputOption');
        } else if (event.target.id === "editEmail") {
            if (!disabledInputs.email) {
                updateUserEmail();
            }
            toggleInputDisabledState('emailInputOption');
        }
    };

    return (
        <>
            <div id='options'>
                <div id='optionsContainer'>
                    <div id='profileInfoDiv'>
                        <img src={userPhoto} alt="User icon" id='profileInfoPfp' />

                        <div id='profileInfoInputs'>

                            <div id='profileInfoInputDiv'>
                                <input 
                                type="text"
                                id="id"
                                value={props.userLogged[0]}
                                className='profileInfoInput'
                                disabled
                                />
                            </div> 

                            <div id='profileInfoInputDiv'>
                                <input 
                                    type="text" 
                                    id="nameInputOption"
                                    value={props.inputValues.name}  
                                    className='profileInfoInput'
                                    disabled={disabledInputs.name}
                                    onChange={updateInputValue}
                                    ref={inputName}
                                />
                                <img 
                                    src={editIcon} 
                                    id='editName'
                                    alt="Icon for editing profile's name" 
                                    className='profileInfoEdit' 
                                    onClick={toggleEditMode}
                                />
                            </div>

                            <div id='profileInfoInputDiv'>
                                <input 
                                    type="text" 
                                    id="emailInputOption"
                                    value={props.inputValues.email}  
                                    className='profileInfoInput'
                                    disabled={disabledInputs.email}
                                    ref={inputEmail}
                                    onChange={updateInputValue}
                                />
                                <img 
                                    src={editIcon} 
                                    id='editEmail'
                                    alt="Icon for editing profile's email" 
                                    className='profileInfoEdit' 
                                    onClick={toggleEditMode}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

Options.propTypes = {
    setInputFocused: PropTypes.func.isRequired,
    userLogged: PropTypes.array.isRequired,
    setInputValues: PropTypes.func.isRequired,
    inputValues: PropTypes.object.isRequired,
    setErrorMsg: PropTypes.func.isRequired,
};

export default Options;
