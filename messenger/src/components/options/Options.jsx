import './Options.css';
import pfp from '../../assets/cool-pfp-02.jpg';
import editIcon from '../../assets/pencil-square.svg';
import { useState } from 'react';
import PropTypes from 'prop-types';

const Options = (props) => {
    const [disabledInputs, setDisabledInputs] = useState({
        name: true,
        email: true
    });

    const [inputValues, setInputValues] = useState({
        name: 'Cool Name',
        email: 'coolEmail@gmail.com'
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
        setInputValues(prev => ({
            ...prev,
            [id]: value
        }));
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
                                    value={inputValues.name}  
                                    className='profileInfoInput'
                                    disabled={disabledInputs.name}
                                    onChange={handleInputChange}
                                />
                                <img 
                                    src={editIcon} 
                                    alt="icon for editing profile's info" 
                                    className='profileInfoEdit' 
                                    onClick={() => handleClickIsDisabled('name')}
                                />
                            </div>

                            <div style={{ display: "flex", alignItems: "center" }}>
                                <input 
                                    type="text" 
                                    id="email"
                                    value={inputValues.email}  
                                    className='profileInfoInput'
                                    disabled={disabledInputs.email}
                                    onChange={handleInputChange}
                                />
                                <img 
                                    src={editIcon} 
                                    alt="icon for editing profile's info" 
                                    className='profileInfoEdit' 
                                    onClick={() => handleClickIsDisabled('email')}
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
    setInputFocused: PropTypes.func.isRequired
};

export default Options;
