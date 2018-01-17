var express = require("express");
var app = express();
//var expressSanitizer = require("express-sanitizer");  // To remove any java script code feed by users in form 
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");


mongoose.connect("mongodb://localhost/blogApp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
//app.use(expressSanitizer);
app.use(methodOverride("_method"));

//Mongoose Model config
var BlogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now()}
});

var BlogModel = mongoose.model("Blog", BlogSchema);

/*BlogModel.create({
    title: "Seattle Weather",
    image: "http://1.bp.blogspot.com/-_j8kHhzKeHM/UL1_DpqN8NI/AAAAAAAAMKQ/BGvRVwmgmAM/s1600/tumblr_m66m4ryYrg1qd6wxeo1_500.jpg",
    body: "No matter which season it is, it is going to rain anyway !"
});*/

/** RESTful routes  **/

app.get("/", function(req,res){
    res.redirect("/blogs");
});

//INDEX - GET
app.get("/blogs", function(req,res){
    BlogModel.find({}, function(error, blogs){
        if(error){
            console.log("DB Error:" + error);
        }else{
             res.render("Index", {blogs : blogs}) ;
        }
    })
});

//NEW-GET
app.get("/blogs/new", function(req,res){
    res.render("new");
});

//CREATE - POST
app.post("/blogs", function(req, res){
    //Create Blog
   // req.body.blog.body = req.sanitize(req.body.blog.body);
    BlogModel.create(req.body.blog, function(error, newBlog){
        if(error){
            console.log("DB Error:" + error);
        }else{
             res.redirect("/blogs") ;
        }
    });
});

//SHOW - GET
app.get("/blogs/:id", function(req, res) {
    BlogModel.findById(req.params.id, function(error, blog){
        if(error){
            console.log("DB Error:" + error);
        }else{
             res.render("Show", {blog : blog}) ;
        }
    });
   //res.render("Show");
});

//EDIT - GET
app.get("/blogs/:id/edit", function(req, res) {
   BlogModel.findById(req.params.id, function(error, blog){
        if(error){
            console.log("DB Error:" + error);
        }else{
             res.render("edit", {blog : blog}) ;
        }
    });
});

//UPDATE -PUT
app.put("/blogs/:id", function(req, res){
    BlogModel.findByIdAndUpdate(req.params.id, req.body.blog, function(error, updatedBlog){
        if(error){
            res.redirect("/blogs");
        }else{
            //Show
            res.redirect("/blogs/"+updatedBlog._id);
        }
    });
});

//DELETE
app.delete("/blogs/:id", function(req,res){
    BlogModel.findByIdAndRemove(req.params.id, function(error){
        if(error){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog server connected");
});
