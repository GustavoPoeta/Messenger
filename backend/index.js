const mysql = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 3500;

app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'messenger'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    } 
    console.log('Connected as id ' + connection.threadId);
});

// User Registration
app.post("/newUser", (req, res) => {
    const {username, email, password} = req.body;
    const saltRounds = 10;

    if (!username || !email || !password) {
        res.status(400).send({error: "server did not receive required data from client"});
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).send({err: "Error hashing password!"});
        }

        // Insert new user into the database
        const registerUser = `INSERT INTO user (username, email, password) VALUES (?, ?, ?)`;
        connection.query(registerUser, [username, email, hash], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({err: "Error registering user!"});
            }

            res.status(200).send({success: "User registered successfully"});
        });
    });
});

// User Login
app.post('/users', (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        res.status(400).send({error: "server did not receive required data from client"});
    }


    // Retrieve user data for login
    const getUser = `SELECT id, email, password FROM user WHERE email = ?`;
    connection.query(getUser, [email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({err: "Error fetching user!"});
        }

        if (result.length === 0) {
            return res.status(404).send({err: "User not found"});
        }

        const hashedPassword = result[0].password;
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
                console.error(err);
                return res.status(500).send({err: "Error comparing passwords!"});
            }

            if (isMatch) {
                res.status(200).send([result[0].id, result[0].email]);
            } else {
                res.status(401).send({err: "Invalid credentials"});
            }
        });
    });
});

// Change Username
app.post("/changeName", (req, res) => {
    const {newName, email} = req.body;

    if (!email || !newName) {
        res.status(400).send({error: "server did not receive required data from client"});
    }

    // Update the username for the given email
    const query = "UPDATE user SET username = ? WHERE email = ?";
    connection.query(query, [newName, email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({error: "Error changing username"});
        }

        res.status(200).send({success: "Username changed successfully"});
    });
});

// Change Email
app.post('/changeEmail', (req, res) => {
    const {email, newEmail} = req.body;

    if (!email || !newEmail) {
        res.status(400).send({error: "server did not receive required data from client"});
    }

    // Update the email address for the given email
    const query = "UPDATE user SET email = ? WHERE email = ?";
    connection.query(query, [newEmail, email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({error: "Error changing email"});
        }
        res.status(200).send({success: "Email changed successfully"});
    });
});

// Get User Info
app.post("/getInfo", (req, res) => {
    const {email} = req.body;

    if (!email) {
        res.status(400).send({error: "server did not receive required data from client"});
    }

    // Retrieve the username for the given email
    const query = "SELECT username FROM user WHERE email = ?";
    connection.query(query, [email], (err, result) => {
        
        if (err) {
            console.error(err);
            return res.status(500).send({error: "Error getting user info"});
        }

        if (result.length === 0) {
            return res.status(404).send({error: "User not found"});
        }

        res.status(200).send(result);
    });
});

app.post('/checkFriend', (req, res) => {
    const {userID, friendID} = req.body;

    const query = "SELECT * FROM friends WHERE (userID = ? AND friendID = ?) OR (userID = ? AND friendID = ?)";

    connection.query(query, [userID, friendID, friendID, userID], (err, result) => {

        if (err) {

            console.error(err);
            return res.status(500).send({ error: "Error checking friendship" });

        }

        if (result.length > 0) {

            res.status(200).send({ message: "Friendship exists", friendship: result });

        } else {

            res.status(200).send({ message: "No friendship found" });

        }
    });


});

// Add Friend
app.post("/addFriend", (req, res) => {
    const {userID, friendID} = req.body;



    if (!userID || !friendID) {
        res.status(400).send({error: "server did not receive required data from client"});
    }   
        // Prevent adding oneself as a friend
        else if (userID === friendID) {
            return res.status(400).send({error: "You cannot add yourself as a friend"});
        } 

    // Insert a friendship record
    const insertQuery = "INSERT INTO friends (userID, friendID) VALUES (?, ?)";

    connection.query(insertQuery, [userID, friendID], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).send({error: "Error inserting friend"});
        }

        res.status(200).send({success: "Friend added successfully"});
    });
});


// Get Friends
app.post("/getFriends", (req, res) => {

    const {userID} = req.body;

    if (!userID) {
        res.status(400).send({error: "server did not receive required data from client"});
    }

    // Query to retrieve all friends for the given user, whether they are listed as userID or friendID
    const query = `
        SELECT u.* 
        FROM user u 
        WHERE u.id IN (
            SELECT friendID FROM friends WHERE userID = ?
            UNION
            SELECT userID FROM friends WHERE friendID = ?
        )
    `;

    connection.query(query, [userID, userID], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).send({error: "Error fetching friend's info"});
        }

        res.status(200).send(result);
    });
});

app.post("/addMessage", (req, res) => {
    const {userID, friendID, message} = req.body;
    
    if (!userID || !friendID || !message) {
        res.status(400).send({error: "server did not receive required data from client"});
    }

    const query = "UPDATE friends SET messages = IFNULL(CONCAT(messages, ?), '') WHERE userID = ? AND friendID = ?";

    connection.query(query, [ message , userID, friendID], (err, result) => {

        if (err) {
            
            console.error(err);
            res.status(500).send({error: 'error adding message'});

        }

        res.status(200).send({success: "message was successfuly stored"});   
    });

});


app.post('/getMessages', (req, res) => {
    const {userID, friendID} = req.body;

    if (!userID || !friendID) {
        
        res.status(400).send({error: "server did not receive required data from client"});

    }

    const query = `
    SELECT messages 
    FROM friends 
    WHERE (userID = ? AND friendID = ?) 
       OR (userID = ? AND friendID = ?)
    `;

    connection.query(query, [userID, friendID, friendID, userID], (err, result) => {

        console.log(result);

        if (err) {

            res.status(500).send({error: "server was unable to retrieve message data"});

        }

        res.status(200).send(result);
    });

});



// Start server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
