const mysql = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 3500;

app.use(cors());
app.use(express.json());

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

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).send({err: "Error hashing password!"});
        }

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
                console.log(result);
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

// Add Friend
app.post("/addFriend", (req, res) => {
    const {userID, friendID} = req.body;

    const insertQuery = "INSERT INTO friends (userID, friendID) VALUES (?, ?)";
    connection.query(insertQuery, [userID, friendID], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({error: "Error inserting friend"});
        }

        res.status(200).send({success: "Friend added successfully"});
    });
});

app.post("/getFriends", (req, res) => {
    const {userID} = req.body;

    const query = "select * from user where id in (select friendID from friends where userID = ? )";

    connection.query(query, [userID], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({error: "error fetching friend's info"});
        }

        console.log(result);
        res.status(200).send(result);
    });
});


// app.post("/saveMessage", (req, res) => {
//     const {message, userID, friendID} = req.body;


//     const query = "update set"
// });

// Start server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
