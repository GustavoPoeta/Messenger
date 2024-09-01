import './ErrorMessage.css';
import PropTypes from 'prop-types';

function ErrorMessage (props) {

    setTimeout(() => {
        props.setErrorMsg('');
    },5000);
    
    return (
        <div id='errorMessageDiv'>
            <p id='errorMessage'>{props.message}</p>
        </div>
    );
}

ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
    setErrorMsg: PropTypes.func.isRequired
}

export default ErrorMessage;