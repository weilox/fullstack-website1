const express = require("express");
const sql = require("mysql2");

const app = express();
let logged = false;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const connection = sql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"root",
    database:"mydb"
});

connection.connect((error)=>{
    if(error) {throw error};
    console.log("Database connection established!");
});

app.get("/", (req, res)=>{
    res.render('index', { logged });
})

app.get("/register", (req, res)=>{
    res.render("register");
})

app.post("/register", (req, res)=>{
    const { username, email, password } = req.body;
  
    if (!username || !password || !email) {
      return res.status(400).json({ message: "You must fill in all fields." });
    }
  
    if (username.length < 5 ) {
      return res.status(400).json({ message: "The username must be at least 5 characters long." });
    }

    if (password.length < 5 ) {
        return res.status(400).json({ message: "The password must be at least 5 characters long." });
    }

    if (username.length > 20 ) {
        return res.status(400).json({ message: "The username must be at most 20 characters long." });
    }

    if (email.length > 254 ) {
        return res.status(400).json({ message: "The email must be at most 254 characters long."});
    }

    if (password.length > 64 ) {
        return res.status(400).json({ message: "The password must be at most 64 characters long."});
    }
    
    connection.query("select * from users where username = ? OR useremail = ?", [username, email], (err, results) => {
            if (err) {
                console.error("Error:", err);
                return res.status(500).json({ message: "An error occurred, please try again." });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: "This user already exists." });
            } else {
                connection.query("INSERT INTO users (username, useremail, userpassword) VALUES (?, ?, ?)",
                    [username, email, password],
                    (err, results) => {
                        if (err) {
                            console.error("Error:", err);
                            return res.status(500).json({ message: "An error occurred, please try again." });
                        }
                        return res.status(201).json({ message: "User created successfully." });
                    }
                );
            }
        }
    );
})

app.get("/login", (req, res)=>{
    res.render("login");
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    connection.query("SELECT * FROM users WHERE useremail = ? AND userpassword = ?", [email, password], (err, results) => {
        if (err) {
            console.error("Error:", err);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        if (results.length == 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        logged = true;
        res.status(200).json({ message: 'Login successful.' });
    });
});

app.get('/logout', (req, res) => {
    logged = false;
    res.redirect('/');
});

app.listen(5000, (error) => {
    if(error){throw error}
});