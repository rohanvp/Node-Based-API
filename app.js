const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema={
    title:String,
    content:String

};
const Article=mongoose.model("Article",articleSchema);

//chaining methods for all articles operations
app.route("/articles")

.get(function(req,res) {

  Article.find(function(err,foundArticles){

      
      if(!err)
      {
        res.send(foundArticles);

      }
      else
      {
        res.send(err);
      }

  });
  
})

.post(function(req,res){

  console.log();
  console.log();
  
  const newArticle=new Article({

    title:req.body.title,
    content:req.body.content

  });

  newArticle.save(function(err){

    if(!err)
    {
      res.send("sucessfully added new article");
    }
    else
    {
      res.send(err);
    }

  });

})

.delete(function(req,res){

  Article.deleteMany(function(err){

    if(!err){
      res.send("sucessfully deleted all articles");
    }
    else
    {
      res.send(err);
    }

  });

});

//chaining methods for targeting specific articles
app.route("/articles/:articleTitle")


.get(function(req,res){

  
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){//foundArticle since only 1 article is returned

    if(foundArticle)
    {
      res.send(foundArticle);
    }
    else
    {
      res.send("No articles matching found");
    }
  })

})

.put(function(req,res){

  Article.updateOne(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    function(err)
    {
      if(!err)
      {
        res.send("successfully updated article");
      }
      else
      {
        console.log(err);
      }
    }

  )

})

.patch(function(req,res){

  Article.updateOne(
    
      {title:req.params.articleTitle},
      {$set:req.body},//req.body contains title or content or both and that's how it selects which fields to update
      function(err)
      {
        if(!err)
        {
          res.send("successfully updated");
        }
        else
        {
          res.send("error occured");
        }
      }
    
  )

})

.delete(function(req,res){

  Article.deleteOne(

    {title:req.params.articleTitle},
    function(err)
    {
      if(!err)
        {
          res.send("deleted updated");
        }
        else
        {
          res.send("error occured");
        }

    }
  )

});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});