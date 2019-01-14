const express = require("express");
const Feed = require("rss-to-json");
const mysql = require("mysql");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const app = express();
const port = process.env.PORT || 3000;

let connection = mysql.createConnection({
    host: "85.10.205.173",
    user: "rssnewsapi",
    password: "Spaldin12345",
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

    bcrypt.hash("123", 10, function (err, hash) {
        console.log(hash);
    });

    connection.query("SELECT * FROM keysAPI", function (err, result, fields) {
        if (err) {
            console.log(err);

            response.setHeader("Content-Type", "application/json");
            response.json({code: 500, message: "Internal Server Error"});
        }


        response.json({code: 200, message: "Hello World!"});
        console.log(result)
    });
});

app.get("/refresh/:code", (request, response) => {

    if (request.params.code == "sudo") {
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

app.get("/news", (request, response) => {


    let appId = request.query.appid;

    let category = request.query.category;
    let language = request.query.language;

    if (!category) {
        category = "latest";
    }

    if (!language) {
        language = "en";
    }


    connection.query("SELECT * FROM keysAPI WHERE keyID=?", [appId], function (err, result, fields) {
        if (err) {
            console.log(err);

            response.setHeader("Content-Type", "application/json");
            response.json({code: 500, message: "Internal Server Error"});
        }

        let dbKey = result[0];

        if (dbKey) {
            if (dbKey.permission > 0) {


                connection.query("SELECT * FROM stories WHERE language=? AND category=?", [language, category], function (err, result, fields) {
                    if (err) {
                        console.log(err);

                        response.setHeader("Content-Type", "application/json");
                        response.json({code: 500, message: "Internal Server Error"});
                    }

                    response.setHeader("Content-Type", "application/json");
                    response.json(result);

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