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
    app.get("/", (request, response) => {
      db.collection("quotes")
        .find()
        .toArray()
        .then((quotes) => {
          response.render("index.ejs", { quotes: quotes });
        })
        .catch((error) => console.error(error));
    });

    app.post("/quotes", (request, response) => {
      quotesCollection
        .insertOne(request.body)
        .then((result) => {
          response.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    app.put("/quotes", (request, response) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            $set: {
              name: request.body.name,
              quote: request.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => response.json("Success"))
        .catch((error) => console.error(error));
    });
    app.delete("/quotes", (request, response) => {
      quotesCollection
        .deleteOne({ name: request.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return response.json("No quote to delete");
          }
          response.json("Deleted Darth Vader's quote");
        })
        .catch((error) => console.error(error));
    });
  }
);
app.listen(3000, function () {
  console.log("listening on 3000");
});
