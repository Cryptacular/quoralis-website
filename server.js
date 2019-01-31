const path = require("path");
const express = require("express");
const helmet = require("helmet");
const request = require("request");
const xml2js = require("xml2js");
const nodemailer = require("nodemailer");
const { check, validationResult } = require("express-validator/check");

const app = express();

app.use(helmet());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.static("public"));
app.use(express.json());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "templates/pages"));

var port = process.env.PORT || 3000;

var router = express.Router();

router.get("/", function(req, res) {
  res.render("index");
});

router.get("/api/posts", function(req, res) {
  request("https://medium.com/feed/quoralis", function(error, response, body) {
    if (!error) {
      xml2js.parseString(body, function(error, result) {
        console.log("/posts called at " + new Date());
        res.json(result.rss.channel);
      });
    } else {
      console.log(error);
      res.send({
        status: "Internal Server Error",
        statusCode: 500,
        message: "Unknown error. Please try again."
      });
    }
  });
});

router.post(
  "/api/contact",
  [
    check("name")
      .isLength({ min: 1 })
      .withMessage("Name is required"),
    check("message")
      .isLength({ min: 1 })
      .withMessage("Message is required"),
    check("email")
      .isEmail()
      .withMessage("That email doesn't look right")
  ],
  function(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send({
        status: "Bad request",
        statusCode: 400,
        message: "Please fill in the required fields.",
        errors: errors.array()
      });
      return;
    }

    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: "mail.quoralis.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: "info@quoralis.com",
      replyTo: `'${name}' <${email}>`,
      to: "info@quoralis.com",
      subject: `Enquiry from ${name} - Quoralis`,
      text: `From: ${name} <${email}>\n\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, error => {
      if (error) {
        console.log(error);
        res.send({
          status: "Internal Server Error",
          statusCode: 500,
          message: "Unknown error. Please try again."
        });
      } else {
        console.log(`Email sent: ${email}`);
        res.send({
          status: "OK",
          statusCode: 200,
          message: "Thanks! We'll get back to you as soon as possible."
        });
      }
    });
  }
);

router.get("/:page", function(req, res) {
  res.render(req.params.page, (err, html) => {
    if (err) {
      res.status(404).render("404");
    } else {
      res.send(html);
    }
  });
});

app.use("/", router);

app.listen(port);
console.log(`Listening on port ${port}`);
