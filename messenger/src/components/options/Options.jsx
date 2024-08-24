import './Options.css';
import pfp from '../../assets/cool-pfp-02.jpg';
import editIcon from '../../assets/pencil-square.svg';
import { useState, useRef } from 'react';
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
                .catch(err => console.error(err));
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
                .catch(err => console.error(err));
        }
    };

    // Handles the click event for editing input fields
    const toggleEditMode = (event) => {
        if (event.target.id === "editName") {
            if (!disabledInputs.name) {
                updateUserName();
            }
            toggleInputDisabledState('name');
        } else if (event.target.id === "editEmail") {
            if (!disabledInputs.email) {
                updateUserEmail();
            }
            toggleInputDisabledState('email');
        }
    };

    return (
        <>
            <div id='options'>
                <div id='optionsContainer'>
                    <div id='profileInfoDiv'>
                        <img src={pfp} alt="User icon" id='profileInfoPfp' />

                        <div id='profileInfoInputs'>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                <input 
                                    type="text" 
                                    id="name"
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

                            <div style={{ display: "flex", alignItems: "center" }}>
                                <input 
                                    type="text" 
                                    id="email"
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
    inputValues: PropTypes.object.isRequired
};

export default Options;
