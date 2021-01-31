//à mettre au tout début
require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

//MailGun configuration
const api_key = process.env.MAIL_GUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

//Route en get
app.get("/form", async (req, res) => {
  try {
    res.status("route get");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Route en post
app.post("/form", async (req, res) => {
  //Destructuring
  const { firstname, lastname, email, subject, message } = req.fields;

  //   Création de l'objet DATA
  const data = {
    from: `${firstname} ${lastname} <${email}>`,
    to: "amandinedelavoie@live.fr", //email de mailGun
    subject: subject,
    text: message,
  };
  //Envoie de l'objet DATA via MailGun
  mailgun.messages().send(data, (error, body) => {
    if (!error) {
      console.log(data);
      return res.json(body);
    } else {
      res.status(401).json(error);
    }
    // res.status(200).json({ firstname, lastname, email, subject, message });
  });
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("server started");
});
