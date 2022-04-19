//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

// Connection
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

// Schema
const articleSchema = {
  title: String,
  content: String,
};

//Model
const Article = mongoose.model("Article", articleSchema);

// Chained Route Handler Using Express

///////////////////---------Requests Targeting All Articles ----------------//////////////////////

app.route("/articles")
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (!err) {
        res.send("Yayy! Successfully Added a New Article");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Deletion Successful -- All Items are deleted from database");
      } else {
        res.send(err);
      }
    });
  });

///////////////////---------Requests Targeting a Specific Articles ----------------//////////////////////

app.route("/articles/:articleTitle")
  .get((req, res) => {

    Article.findOne({title: req.params.articleTitle},(err, foundArticle)=>{
      if(foundArticle){
        res.send(foundArticle);
      }
      else{
        res.send("Sorry, there is no such title available to us! Please try something else");
      }
    })
  })
  .put((req, res)=>{
  //Article.update()  ---> depricated
    Article.replaceOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      (err) => {
        if (!err) {
          res.send("Update Successful for that article!");
        }
        else{
          res.send(err);
        }
      }
    );
  })

  .patch((req,res)=>{
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body },
      (err)=>{
        if(!err){
          res.send("Successfully Patched through Postman");
        }
        else{
          res.send(err);
        }
      }
    )
  })
  // .post((req, res) => {})
  .delete((req, res) => {
    Article.deleteOne(
      {title: req.params.articleTitle},
      (err)=>{
        if(!err){
          res.send("Deleted one item from DB");
        }
        else{
          res.send(err);
        }
      }
    )
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

// GET Request
// app.get("/articles", (req, res)=>{
//   Article.find((err, foundArticles)=>{
//     if(!err){
//       res.send(foundArticles);
//     }
//     else{
//       res.send(err);
//     }
//   })
// })

// POST Request
// app.post("/articles", (req, res)=>{
//   // console.log(req.body.title);
//   // console.log(req.body.content);

//   const newArticle = new Article ({
//     title: req.body.title,
//     content: req.body.content
//   });

//   newArticle.save((err)=>{
//     if(!err){
//       res.send("Yayy! Successfully Added a New Article");
//     }
//     else{
//       res.send(err);
//     }
//   });

// })

// DELETE Request
// app.delete("/articles", (req, res)=>{
//   Article.deleteMany((err)=>{
//     if(!err){
//       res.send("Deletion Successful -- All Items are deleted from database");
//     }
//     else{
//       res.send(err);
//     }
//   })
// });
