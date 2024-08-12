const mysql = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

const PORT = 3500;

app.use(cors());

// middleware for parsing json
app.use(express.json());

//stabilishing where to connect
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'messenger'
})


// connecting
connection.connect((err) => {

    // if there's an error return nothing
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    } 
        else {
            console.log('Connected as id ' + connection.threadId);
        }


    // inserts the user data (with its password hashed) into the database
    app.post("/newUser", (req, res) => {

        const {username, email, password} = req.body;

        const saltRounds = 10;

        bcrypt.hash(password, saltRounds, (err, hash) => {

            if (err) {
                console.error(err);
                return res.status(500).send({err: "error hashing password!"});
            } 

            else {
                
                console.log(req.body);
                const registerUser = `INSERT INTO user (username, email, password) VALUES (?, ?, ?)`;
                connection.query(registerUser, [username, email, hash] , (err, result) => {
                    
                    if (err) {
                        console.error(err);
                        return res.status(500).send({err: "error registering user!"});
                    }

                    console.log(result);
                    res.status(200)

                });

            }

        })
    })



    app.post('/users', (req, res) => {

        const {email, password} = req.body;

        const getUser = `select email, password from user where email = ?`;

        connection.query(getUser, [email], (err, result) => {
            
            if(err) {

                console.error(err);
                return result.status(500).send({err: "error fetching user!"});

            } 

           if (result.length === 0) {
                return result.status(404).send({err: "user not found"});
           }



           const hashedPassword = result[0].password;
           
           bcrypt.compare(password, hashedPassword, (err, isMatch) => {
                if (err) {
                    return res.status(500).send({err: "error comparing passwords!"});
                }

                if( isMatch ) {
                    res.status(200).send({success: "login successful!"});
                } 

                else {
                    res.status(401).send({err: "invalid credentials"});
                }
           });
           
        });

        
    });


});

// listening to the port
app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
);

