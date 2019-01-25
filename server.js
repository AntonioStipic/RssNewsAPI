const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Feed = require("rss-to-json");
const mysql = require("mysql");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const session = require("express-session")
const crypto = require("crypto");

const app = express();
const port = process.env.PORT || 3000;

app.use(session({
    secret: "RssNewsAPI",
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/static"));


let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "rssnewsapi"
});

connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
});

let JSONsources = fs.readFileSync("./resources/json/sources.json");
JSONsources = JSON.parse(JSONsources);

app.get("/", (request, response) => {

    response.redirect("/home");

});

app.get("/home", (request, response) => {
    if (request.session.sessid) {
        response.redirect("/dashboard");
    } else {
        response.sendFile(__dirname + "/static/views/home.html");
    }
});

app.get("/analytics", (request, response) => {

    sess = request.session;

    if (sess.sessid) {
        response.sendFile(__dirname + "/static/views/analytics.html");
    } else {
        response.redirect("/home");
    }
});

app.get("/keys", (request, response) => {
    sess = request.session;

    if (sess.sessid) {
        response.sendFile(__dirname + "/static/views/keys.html");
    } else {
        response.redirect("/home");
    }
});

app.get("/dashboard", (request, response) => {
    sess = request.session;

    if (sess.sessid) {
        sessidExists(sess.sessid, function (error, data) {
            if (error) {
                console.log("SESSID EXISTS ERROR : ", err);
            } else {
                response.sendFile(__dirname + "/static/views/dashboard.html");
            }
        });
    } else {
        response.redirect("/home");
    }

})

app.get("/login", function (request, response) {
    if (request.session.sessid) {
        response.redirect("/dashboard");
    } else {
        response.sendFile(__dirname + "/static/views/login.html");
    }
});

app.get("/register", function (request, response) {
    if (request.session.sessid) {
        response.redirect("/dashboard");
    } else {
        response.sendFile(__dirname + "/static/views/register.html");
    }
});

app.post("/register", function (request, response) {
    let username = request.body.username;
    let password = request.body.password;
    let email = request.body.email;

    if (username != undefined && password != undefined) {

        // FOR some reason, this is unnecessary: connectToDatabase();

        let userId = randomValueHex(8);
        let sessid = randomValueHex(32);

        bcrypt.hash(password, 10, function (err, hash) {
            connection.query("INSERT INTO users VALUES (?, ?, ?, ?, ?)", [userId, username, email, hash, sessid], function (error, result) {
                if (error) {
                    if (error.code == "ER_DUP_ENTRY") {
                        console.log(error.code, "for user:", username);

                        response.json({code: 401, message: "Username or email already exists!"});
                    } else {
                        console.log(error.code);
                    }
                } else {
                    console.log("User successfully added to database!");
                    response.json({code: 200, message: "Successfully registered!"});
                }
            });
        });

    } else {
        //response.sendFile(__dirname + "/static/views/error.html?error=925");
        response.send("/error?error=925");
    }
});

app.post("/login", function (request, response) {
    let username = request.body.username;
    let password = request.body.password;

    if (username != undefined && password != undefined) {

        userExists(username, function (error, data) {
            if (error) {
                console.log("USER EXISTS ERROR : ", err);
            } else {
                db_username = "prazno";
                db_password = "prazno";
                db_sessid = "prazno";
                if (data == username) {

                    connection.query("SELECT * FROM users WHERE username='" + username + "';", function (error, result) {
                        let str = JSON.stringify(result);
                        result = JSON.parse(str);

                        let db_username = result[0].username;
                        let db_password = result[0].password;
                        let db_sessid = result[0].sessid;
                        let db_id = result[0].id;

                        bcrypt.compare(password, db_password, function (err, res) {
                            if (db_username == username && res) {
                                console.log("User: '" + username + "' successfully logged in!");
                                request.session.sessid = db_sessid;
                                request.session.username = db_username;
                                request.session.userId = db_id;
                                response.json({code: 200, message: "Success"});
                            } else {
                                console.log("User: '" + username + "' entered wrong password!");
                                
                                response.json({code: 401, message: "Wrong password!"});
                            }
                        });


                        //response.render("login.html");
                    });

                } else {
                    console.log("Entered user: '" + username + "' does not exist!");
                    
                    response.json({code: 401, message: "Username does not exist!"});
                }
            }
        });

    } else {
        console.log("Username: '" + username + "', password: '" + password + "', one of them is undefined");
        response.send("error?error=925");
    }
});

app.get("/refresh/:code", (request, response) => {

    let userId = request.session.userId;

    if (request.params.code == "sudo" && userId == "aefabf96") {
        for (language in JSONsources) {
            for (category in JSONsources[language]) {
                for (i in JSONsources[language][category]) {
                    fetchAndInsertStory(language, category, i);
                }
            }
        }
        response.json({ code: 200, message: "Fetching news..." });
    } else {
        response.json({ code: 403, message: "Forbidden route" });
    }

});

app.get("/update/:code", (request, response) => {

    let code = request.params.code;

    bcrypt.compare(code, process.env.UPDATE_CODE, function (err, res) {
        
        if (err) {
            console.log(err);

            unauthorized(response);
        } else {

            for (language in JSONsources) {
                for (category in JSONsources[language]) {
                    for (i in JSONsources[language][category]) {
                        fetchAndInsertStory(language, category, i);
                    }
                }
            }

            response.json({code: 200, message: "Fetching news..."});
        }
        
    });

});

app.get("/news", (request, response) => {


    let appId = request.query.appid;

    let category = request.query.category;
    let language = request.query.language;

    let limit = request.query.limit;

    let order = request.query.order;

    if (!category) {
        category = "latest";
    }

    if (!language) {
        language = "en";
    }

    if (!order) {
        order = "DESC";
    }

    order = order.toUpperCase();

    if (order != "ASC" && order != "DESC") {
        order = "DESC";
    }

    category = category.toLowerCase();
    language = language.toLowerCase();


    connection.query("SELECT * FROM keysAPI WHERE keyID=?", [appId], function (err, result, fields) {
        if (err) {
            console.log(err);

            response.setHeader("Content-Type", "application/json");
            response.json({ code: 500, message: "Internal Server Error" });
        }

        let dbKey = result[0];


        if (dbKey) {
            if (dbKey.permission > 0) {

                let command = "";

                if (!limit) {
                    command = "SELECT * FROM stories WHERE language=? AND category=? ORDER BY time " + order;
                } else {
                    command = "SELECT * FROM stories WHERE language=? AND category=? ORDER BY time " + order + " LIMIT " + limit;
                }



                connection.query(command, [language, category], function (err, result, fields) {
                    if (err) {
                        console.log(err);

                        response.setHeader("Content-Type", "application/json");
                        response.json({ code: 500, message: "Internal Server Error" });
                    }

                    response.setHeader("Content-Type", "application/json");
                    response.json(result);


                    let datetime = new Date().toISOString().slice(0, 19).replace("T", " ");

                    connection.query("INSERT INTO queries VALUES (NULL, ?, ?, ?, ?)", [dbKey.owner, category, datetime, language], function (err) {
                        if (err) {
                            console.log(err);
                        }
                    })


                });





            } else {
                unauthorized(response);
            }
        } else {
            unauthorized(response);
        }

        // console.log(result[0]);
    });

});

app.post("/fetchUserData", (request, response) => {
    if (request.session.sessid) {
        response.json({ username: request.session.username, sessid: request.session.sessid })
    } else {
        unauthorized(response);
    }
});

app.post("/fetchApiKeys", (request, response) => {
    if (request.session.sessid) {
        connection.query("SELECT * FROM keysAPI WHERE owner=?", [request.session.userId], function (err, result) {

            if (err) {
                console.log(err)
            } else {
                response.json(result);
            }

        });
    } else {
        unauthorized(response);
    }
});

app.post("/fetchCategories", (request, response) => {

    // if (request.session.sessid) {

    let result = {};

    for (i in JSONsources) {
        result[i] = [];
        for (e in JSONsources[i]) {
            result[i].push(e);
        }
    }

    response.json(result);
    // } else {
    //     unauthorized(response);
    // }
});

app.post("/fetchLanguages", (request, response) => {

    //if (request.session.sessid) {

    let result = [];

    for (i in JSONsources) {
        result.push(i);
    }

    result = result.join(", ");

    response.send(result);
    // } else {
    //     unauthorized(response);
    // }
});

app.post("/deleteApiKey", (request, response) => {
    if (request.session.sessid) {
        keyID = request.body.keyID


        connection.query("DELETE FROM keysAPI WHERE keyID=?", [keyID], function (err, result) {
            if (err) {
                console.log(err)
            } else {
                response.json({ code: 200, message: "success" });
            }

        });

    } else {
        unauthorized(response);
    }
});

app.post("/renameApiKey", (request, response) => {
    if (request.session.sessid) {
        name = request.body.name
        keyID = request.body.keyID


        connection.query("UPDATE keysAPI SET name=? WHERE keyID=?", [name, keyID], function (err, result) {
            if (err) {
                console.log(err)
            } else {
                response.json({ code: 200, message: "success" });
            }

        });

    } else {
        unauthorized(response);
    }
});

app.post("/createApiKey", (request, response) => {
    if (request.session.sessid) {
        let name = request.body.name
        let owner = request.session.userId;
        let id = randomValueHex(32);

        connection.query("INSERT INTO keysAPI VALUES (NULL, ?, 1, ?, ?)", [id, owner, name], function (err, result) {
            if (err) {
                console.log(err)
            } else {
                response.json({ code: 200, message: "success" });
            }
        });

    } else {
        unauthorized(response);
    }
});

app.post("/countQueries", (request, response) => {
    // SELECT       `language`,
    //          COUNT(`language`) AS `occurences` 
    // FROM     `queries`
    // GROUP BY `language`
    // ORDER BY `occurences` DESC
    // LIMIT    6;




    let select = request.body.select;

    let command = "";
    if (select == "language") {
        command = "SELECT `language`, COUNT(`language`) AS `occurences` FROM `queries` GROUP BY `language` ORDER BY `occurences` DESC LIMIT 6;"
    } else if (select == "category") {
        command = "SELECT `category`, COUNT(`category`) AS `occurences` FROM `queries` GROUP BY `category` ORDER BY `occurences` DESC LIMIT 6;"
    }

    // connection.query("SELECT ?, COUNT(?) AS `occurences` FROM `queries` GROUP BY ? ORDER BY `occurences` DESC LIMIT 6;", [select, select, select], function (err, result) {
    connection.query(command, function (err, result) {
        if (err) {
            console.log(err);
        }

        response.json(JSON.stringify(result));
    });

});

app.get("/logout", function (request, response) {
    let username = request.session.username;
    request.session.destroy();
    console.log("User: '" + username + "' successfully logged out!");
    response.redirect("/home");
});

app.get("*", (request, response) => {
    response.sendFile(__dirname + "/static/views/404.html");
});

app.listen(port, () => {
    console.log("Listening on port:", port);
});

function unauthorized(response) {
    response.setHeader("Content-Type", "application/json");
    response.json({ code: 401, message: "Unauthorized access!" });
}

function fetchAndInsertStory(language, category, i) {
    Feed.load(JSONsources[language][category][i], function (err, rss) {
        if (err) {
            console.log("Oops ERROR", err);
        }

        let time = Math.floor(new Date() / 1000);
        console.log(time);

        // console.log(rss.items)

        for (e in rss.items) {



            // console.log(counter + " " + );


            let title = rss.items[e].title;
            let description = rss.items[e].description;
            let media = "image";
            let link = rss.items[e].link;

            connection.query("SELECT * FROM stories WHERE link=?", [link], function (err, result) {
                console.log(result.length);

                if (result.length == 0) {
                    connection.query("INSERT INTO stories VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)", [title, description, media, link, language, category, time], function (err) {
                        if (err) throw err;
                    });
                } else {
                    console.log(link);
                }
            });
        }
    });
}

function userExists(username, callback) {
    connection.query("SELECT username FROM users WHERE username='" + username + "';", function (error, result) {
        let str = JSON.stringify(result);
        result = JSON.parse(str);
        if (result[0]) {
            if (result[0].username == username) {
                callback(null, result[0].username);
            } else {
                callback(null, null);
            }
        } else {
            callback(null, null);
        }
    });
}

function sessidExists(sessid, callback) {
    connection.query("SELECT sessid FROM users WHERE sessid='" + sessid + "';", function (error, result) {
        let str = JSON.stringify(result);
        result = JSON.parse(str);
        if (result[0]) {
            if (result[0].sessid == sessid) {
                callback(null, result[0].sessid);
            } else {
                callback(null, null);
            }
        } else {
            callback(null, null);
        }
    });
}

function randomValueHex(len) {
    return crypto.randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len);   // return required number of characters
}
