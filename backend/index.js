const mysql = require('mysql');
const express = require('express');

const app = express();

const PORT = 3500;

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
});

// middleware for parsing json
app.use(express.json());





// listening to the port
app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
);

app.post('/newUser', (req, res) => {
    const { id } = req.params;
    console.log(req.body);

    res.send({
        a: `${req.body.a}`
    })
})

app.get('/users', (req, res) => {

})


connection.end();