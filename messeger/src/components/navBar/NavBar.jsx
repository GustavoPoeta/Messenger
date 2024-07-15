import User from './user/User';
import './NavBar.css';

function NavBar () {


    return (
        <>
        
            <div id="navBar">

                {/* list of contacts the user has */}
                <div id="contacts">
                    <User />
                </div>


                {/* list of groups the user is in */}
                <div id="groups">

                </div>

            </div>
        
        </>
    )
}

export default NavBar;