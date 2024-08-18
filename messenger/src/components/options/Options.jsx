import './Options.css';
import pfp from '../../assets/cool-pfp-02.jpg';
import editIcon from '../../assets/pencil-square.svg';
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const Options = (props) => {


    const inputName = useRef(null);
    const inputEmail = useRef(null);

    const [disabledInputs, setDisabledInputs] = useState({
        name: true,
        email: true
    });

    const handleClickIsDisabled = (inputKey) => {
        setDisabledInputs(prev => ({
            ...prev,
            [inputKey]: !prev[inputKey]
        }));
        props.setInputFocused(true);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        props.setInputValues(prev => ({
            ...prev,
            [id]: value
        }));
    };
    

    const handleChangeName = () => {

        let howManySpace = 0;

        const inputValue = inputName.current.value;
        const inputArray = inputValue.split('');
        

        inputArray.forEach(element => {
            if (element === " ") {
                howManySpace++;
            }
        });


        if (howManySpace < inputValue.length || inputValue !== "") {
            
            axios.post('http://localhost:3500/changeName', {

                newName: `${inputName.current.value}`,
                email: `${props.userLogged}`

            })
                .then (response => console.log(response))
                .catch(err => console.error(err));
        }

    };

    const handleChangeEmail = () => {
        let howManySpace = 0;

        const inputValue = inputEmail.current.value;
        const inputArray = inputValue.split('');
        

        inputArray.forEach(element => {
            if (element === " ") {
                howManySpace++;
            }
        });


        if (howManySpace < inputValue.length || inputValue !== "") {
            axios.post('http://localhost:3500/changeEmail', {
                email: props.userLogged,
                newEmail: inputValue
            })
                .then(response => console.log(response))
                .catch(err => console.error(err));
        }
    }

    

    const handleClickEdit = (event) => {
        if (event.target.id === "editName" && disabledInputs.name === false) {

            handleChangeName();
            handleClickIsDisabled('name');

        } else {

            handleClickIsDisabled('name');

        }

        
        
        if (event.target.id === "editEmail" && disabledInputs.email === false) {

            handleChangeEmail();
            handleClickIsDisabled('email');

        } else {
            handleClickIsDisabled('email');
        }
    }

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
                                    onChange={handleInputChange}
                                    ref={inputName}
                                />
                                <img 
                                    src={editIcon} 
                                    id='editName'
                                    alt="icon for editing profile's info" 
                                    className='profileInfoEdit' 
                                    onClick={handleClickEdit}
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
                                    onChange={handleInputChange}
                                />
                                <img 
                                    src={editIcon} 
                                    id='editEmail'
                                    alt="icon for editing profile's info" 
                                    className='profileInfoEdit' 
                                    onClick={handleClickEdit}
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
    userLogged: PropTypes.string.isRequired,
    setInputValues: PropTypes.func.isRequired,
    inputValues: PropTypes.object.isRequired
};

export default Options;
