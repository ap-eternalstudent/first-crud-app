const bodyParser = require("body-parser");
const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const connectionString =
  "mongodb+srv://anton:753842@cluster0.p6dfi.mongodb.net/star-wars?retryWrites=true&w=majority";

app.listen(3000, function () {
  console.log("listening on 3000");
});
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(connectionString, {
  useUnifiedTopology: true,
}).then((client) => {
  console.log("Connected to Database");
  const db = client.db("star-wars-quotes");
  const quotesCollection = db.collection("quotes");
  // All your handlers here...

  app.post("/quotes", (request, response) => {
    quotesCollection
      .insertOne(request.body)
      .then((result) => {
        response.redirect("/");
      })
      .catch((error) => console.error(error));
  });

  app.get("/", (request, response) => {
    db.collection("quotes")
      .find()
      .toArray()
      .then((results) => {
        response.render("index.ejs", { quotes: results });
      })
      .catch((error) => console.error(error));
  });
  app.put("/quotes", (request, response) => {
    console.log(request.body);
  });
});
