const express = require("express");

const MongoClient = require("mongodb").MongoClient;
const app = express();

// ========================
// Link to Database
// ========================

const connectionString =
  "mongodb+srv://anton:753842@cluster0.p6dfi.mongodb.net/star-wars?retryWrites=true&w=majority";

MongoClient.connect(connectionString, { useUnifiedTopology: true }).then(
  (client) => {
    console.log("Connected to Database");
    const db = client.db("star-wars-quotes");
    const quotesCollection = db.collection("quotes");
    // All your handlers here...
    // ========================
    // Middlewares
    // ========================
    app.set("view engine", "ejs");
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static("public"));
    // ========================
    // Routes
    // ========================
    app.get("/", (req, res) => {
      db.collection("quotes")
        .find()
        .toArray()
        .then((quotes) => {
          res.render("index.ejs", { quotes: quotes });
        })
        .catch((error) => console.error(error));
    });

    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => res.json("Success"))
        .catch((error) => console.error(error));
    });
    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json("Deleted Darth Vadar's quote");
        })
        .catch((error) => console.error(error));
    });
  }
);
app.listen(3000, function () {
  console.log("listening on 3000");
});
