/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const express = require("express");
const app = express();
const csrf = require("tiny-csrf");
const cookiepasrser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const bcrypt = require("bcrypt");
const saltRound = 10;

const passport = require("passport");
const LocalStrategy = require("passport-local");
const connectEnsure = require("connect-ensure-login");


const path = require("path");

//Set View Engine
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "ejs");

const { sequelize } = require("./models");
const { DataTypes } = require("sequelize");


//Models
let parent = require("./models/parentmodel")(sequelize, DataTypes);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookiepasrser("this is Secret String"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

app.use(flash());
app.use(passport.initialize());

app.use(
    session({
        secret: "This_is_Super_Secret_Key_2021095900023267",
        cookie: {
            maxAge: 60 * 60 * 24 * 1000, //24 Hours
        },
    })
);


passport.use(
    "local",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        (username, password, done) => {
            parent.findOne({
                where: {
                    email: username,
                },
            })
                .then(async function (user) {
                    console.log(user.email);
                    if (user) {
                        const resultantPass = await bcrypt.compare(password, user.password);
                        if (resultantPass) {
                            return done(null, user);
                        } else {
                            console.log("User is Login");
                            return done(null, false, { message: "Invalid Password" });
                        }
                    } else {
                        return done(null, false, { message: "User Does Not Exist" });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    return error;
                });
        }
    )
);

passport.serializeUser((user, done) => {
    console.log("Serealizing User in Session", user.id);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    parent.findByPk(id)
        .then((user) => {
            done(null, user);
        })
        .catch((err) => {
            done(err, null);
        });
});

app.use(function (request, response, next) {
    const Message = request.flash();
    response.locals.messages = Message;
    next();
});

app.get("/", (request, response) => {
    try {
        console.log("\nRoute:/FrontPage\n");
        response.status(200).render("frontPage", { csrfToken: request.csrfToken() });
    } catch (error) {
        console.log("Error:" + error);
        request.flash("error", `Error:${error}`);
        response.redirect("back");
    }
});

app.get("/signup", (request, response) => {
    try {
        console.log("\nRoute:/Signup\n");
        response.status(200).render("signUp", { csrfToken: request.csrfToken() });
    } catch (error) {
        console.log("Error:" + error);
        request.flash("error", `Error:${error}`);
        response.redirect("back");
    }
});

app.get("/login", (request, response) => {
    try {
        console.log("\nRoute:/login\n");
        response.status(200).render("login", { csrfToken: request.csrfToken() });
    } catch (error) {
        console.log("Error:" + error);
        request.flash("error", `Error:${error}`);
        response.redirect("back");
    }
});


app.get(
    "/Home",
    connectEnsure.ensureLoggedIn({ redirectTo: "/" }),
    (request, response) => {
        try {
            console.log("\nRoute:/Home\n");
            if (request.user.UserRole == "parent") {
                console.log(request.user.id);
                if (request.accepts("html")) {
                    response.render("Home", {
                        csrfToken: request.csrfToken(),
                        User: request.user.username,
                    });
                } else {
                    response.json({
                        User: request.user.username,
                    });
                }
            } else {
                console.log("User")
                console.log("Hello")
                response.redirect("/");
            }
        } catch (error) {
            console.log("Error:" + error);
            request.flash("error", `Error:${error}`);
            response.redirect("back");
        }
    }
);

app.post("/SignUpUser", async (request, response) => {
    console.log(request.body);
    try {
        console.log("\nPOST Route:/SignUpUser\n");
        let User = await parent.findAll({ where: { email: request.body.email } });
        if (User.length == 0) {
            let hashPass = await bcrypt.hash(request.body.password, saltRound);

            let add = await parent.create({
                username: request.body.username,
                email: request.body.email,
                password: hashPass,
                UserRole: "parent",
            });
            request.login(add, (err) => {
                if (err) {
                    console.log(err);
                }
                request.flash("success", "Admin Suceessfully Created");
                console.log("The User is created");
                response.redirect("/Home");
            });
        } else {
            request.flash("error", "Email Already Exist");
            console.log("the user is not created");
            response.redirect("/signup");
        }
    } catch (error) {
        console.log("Error:" + error);
        request.flash("error", `Error:${error}`);
        response.redirect("back");
    }
});

app.post(
    "/parentLogin",
    passport.authenticate("local", { failureRedirect: "/", failureFlash: true }),
    async (request, response) => {
        try {
            console.log("\nPOST Route:/parentLogin\n");
            if (request.user.UserRole == "parent") {
                console.log("ParentLogin");
            }
            request.flash("success", "Login Successfully");
            response.redirect("/Home");
        } catch (error) {
            console.log("Error:" + error);
            request.flash("error", `Error:${error}`);
        }
    }
);


module.exports = app;