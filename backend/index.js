const mysql = require('mysql2');
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
    password: '1234',
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
        return res.status(400).send({error: "server did not receive required data from client"});
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).send({error: "Error hashing password!"});
        }

        // Insert new user into the database
        const registerUser = `INSERT INTO user (username, email, password) VALUES (?, ?, ?)`;
        connection.query(registerUser, [username, email, hash], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({error: "Error registering user!"});
            }

            return res.status(200).send({success: "User registered successfully"});
        });
    });
});

// User Login
app.post('/users', (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).send({error: "server did not receive required data from client"});
    }

    // Retrieve user data for login
    const getUser = `SELECT id, email, password FROM user WHERE email = ?`;
    connection.query(getUser, [email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({error: "Error fetching user!"});
        }

        if (result.length === 0) {
            return res.status(404).send({error: "User not found"});
        }

        const hashedPassword = result[0].password;
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
                console.error(err);
                return res.status(500).send({error: "Error comparing passwords!"});
            }

            if (isMatch) {
                return res.status(200).send([result[0].id, result[0].email]);
            } else {
                return res.status(401).send({error: "Passwords do not match"});
            }
        });
    });
});

// Change Username
app.post("/changeName", (req, res) => {
    const {newName, email} = req.body;

    if (!email || !newName) {
        return res.status(400).send({error: "server did not receive required data from client"});
    }

    // Update the username for the given email
    const query = "UPDATE user SET username = ? WHERE email = ?";
    connection.query(query, [newName, email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({error: "Error changing username"});
        }

        return res.status(200).send({success: "Username changed successfully"});
    });
});

// Change Email
app.post('/changeEmail', (req, res) => {
    const {email, newEmail} = req.body;

    if (!email || !newEmail) {
        return res.status(400).send({error: "server did not receive required data from client"});
    }

    // Update the email address for the given email
    const query = "UPDATE user SET email = ? WHERE email = ?";
    connection.query(query, [newEmail, email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({error: "Error changing email"});
        }
        return res.status(200).send({success: "Email changed successfully"});
    });
});

// Get User Info
app.post("/getInfo", (req, res) => {
    const {id} = req.body;

    if (!id) {
        return res.status(400).send({error: "server did not receive required data from client"});
    }

    // Retrieve the username for the given id
    const query = "SELECT username, photo FROM user WHERE id = ?";
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({error: "Error getting user info"});
        }

        if (result.length === 0) {
            return res.status(404).send({error: "User not found"});
        }

        return res.status(200).send(result);
    });
});

app.post('/checkFriend', (req, res) => {
    const {userID, friendID} = req.body;

    const query = "SELECT * FROM friends WHERE (userID = ? AND friendID = ?) OR (userID = ? AND friendID = ?)";

    connection.query(query, [userID, friendID, friendID, userID], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({error: "Error checking friendship"});
        }

        if (result.length > 0) {
            return res.status(200).send({message: "Friendship exists", friendship: result});
        } else {
            return res.status(200).send({message: "No friendship found"});
        }
    });
});

// Add Friend
app.post("/addFriend", (req, res) => {
    const { userID, friendID } = req.body;

    if (!userID || !friendID) {
        return res.status(400).send({error: "server did not receive required data from client"});
    }

    // Prevent adding oneself as a friend
    if (userID === friendID) {
        return res.status(400).send({error: "You cannot add yourself as a friend"});
    }

    // Check if the friendID exists in the user table
    const checkUserQuery = "SELECT id FROM user WHERE id = ?";
    connection.query(checkUserQuery, [friendID], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({error: "Error checking if friend exists"});
        }

        if (result.length === 0) {
            return res.status(404).send({error: "Friend not found"});
        }

        // If friend exists, proceed to insert the friendship record
        const insertQuery = "INSERT INTO friends (userID, friendID) VALUES (?, ?)";
        connection.query(insertQuery, [userID, friendID], (err, result) => {
            if (err) {
                return res.status(500).send({error: "Error inserting friend"});
            }

            return res.status(200).send({success: "Friend added successfully"});
        });
    });
});

// Get Friends
app.post("/getFriends", (req, res) => {
    const {userID} = req.body;

    if (!userID) {
        return res.status(400).send({error: "server did not receive required data from client"});
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

        return res.status(200).send(result);
    });
});

app.post("/addMessage", (req, res) => {
    const {userID, friendID, messageContent, messageTime} = req.body;

    if (!userID || !friendID || !messageContent || !messageTime) {
        return res.status(400).send({error: "server did not receive required data from client"});
    }

    const insertMessage = `
        INSERT INTO messages (userID, friendID, content, timestamp)
        VALUES (?, ?, ?, ?)
    `;

    connection.query(insertMessage, [userID, friendID, messageContent, messageTime], (err, result) => {
        if (err) {
            return res.status(500).send({error: "server was not able to add the message"});
        }

        res.status(200).send(result);
    });
});

app.post('/getMessages', (req, res) => {
    const {userID, friendID} = req.body;

    if (!userID || !friendID) {
        return res.status(400).send({error: "server did not receive required data from client"});
    }

    const query = `
        SELECT id, userID, content, timestamp
        FROM messages
        WHERE (userID = ? AND friendID = ?) OR (userID = ? AND friendID = ?)
        ORDER BY timestamp ASC
    `;
    connection.query(query, [userID, friendID, friendID, userID], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({error: "server was not able to retrieve the messages"});
        }

        if (!result[0] || result[0].messages === '') {
            return res.status(404).send({not_found: "there aren't messages saved at our database!"});
        }

        const messages = [];
        
        result.forEach(message => {
            const {id, userID, content, timestamp} = message;

            if (id && content !== '' && userID && timestamp) {
                
                messages.push({ id, userID, content, timestamp, fromDB: true });

            }
        });

        return res.status(200).send(messages);
    });
});

app.post('/modifySeen', (req, res) => {
    const {messageID} = req.body;

    const query = `UPDATE messages SET seen = 1 WHERE id = ?`;

    connection.query(query, [messageID], (err) => {
        if (err) {
            return res.status(500).send({error: "Error updating message status"});
        }

        return res.status(200).send({ success: "Message status updated successfully" });
    });


});

app.post('/getNewMessages', (req, res) => {
    const {userID} = req.body;

    const query = `SELECT * FROM messages WHERE friendID = ? AND seen = 0`;

    connection.query(query, [userID], (err, result) => {
        if (err) {
            return res.status(500).send({error: "error getting new messages"});
        }

        // use reduce

        // Group messages by userID( if the message was sent by the friend, then he will be the userID [owner] of it)
        const groupedMessages = result.reduce((acc, message) => {

            if (!acc[message.userID]) {
                acc[message.userID] = [];
            }
            
            if (Number(message.seen) === 0) {
                acc[message.userID].push(message);
            }

            return acc;
        }, {});

        // Convert the grouped messages object to an array
        const groupedMessagesArray = Object.keys(groupedMessages).map(friendID => ({
            friendID,
            messages: groupedMessages[friendID]
        }));

        return res.status(200).send(groupedMessagesArray);
    });
});

app.post('/removeFriend', (req, res) => {
    const { userID, friendID } = req.body;

    if (!userID || !friendID) {
        return res.status(400).send({ error: "Server did not receive required data from client" });
    }

    // Delete the friendship from the 'friends' table
    const deleteFriendQuery = `DELETE FROM friends WHERE (userID = ? AND friendID = ?) OR (userID = ? AND friendID = ?)`;

    connection.query(deleteFriendQuery, [userID, friendID, friendID, userID], (err) => {
        if (err) {
            return res.status(500).send({ error: "Error deleting friend" });
        }

        // Delete the associated messages from the 'messages' table
        const deleteMessagesQuery = `DELETE FROM messages WHERE (userID = ? AND friendID = ?) OR (userID = ? AND friendID = ?)`;

        connection.query(deleteMessagesQuery, [userID, friendID, friendID, userID], (msgErr) => {
            if (msgErr) {
                return res.status(500).send({ error: "Error deleting friend's messages" });
            }

            return res.status(200).send({ success: "Friend deleted and messages removed" });
        });
    });
});



// Start server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
