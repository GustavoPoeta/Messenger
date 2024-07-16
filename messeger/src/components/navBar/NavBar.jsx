import User from './user/User';
import users from '../../assets/users.json';
import './NavBar.css';

function NavBar () {

    const borderChange = (index) => {
        if (index === users.users.length - 1) {
            return { borderBottom: 'none' };
        }
        return {};
    } // change the border-bottom property if the current user on the map method is the last.


    return (
        <>
        
            <div id="navBar">

                {/* list of contacts the user has */}
                <div id="contacts">
                    {
                        users.users.map((user, index) => (
                            <User style= {borderChange(index)}nickname= {user.name} iconUrl={user.profile_picture}/>
                        )) // dinamically calls the user component for every user in the json file.
                    }
                </div>

            </div>
        
        </>
    )
}

export default NavBar;