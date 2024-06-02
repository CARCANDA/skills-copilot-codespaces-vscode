// Create web server
// npm install express
// npm install body-parser
// npm install ejs
// npm install mongoose
// npm install method-override
// npm install express-sanitizer

// Import modules
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });

// Use ejs
app.set("view engine", "ejs");

// Use public folder
app.use(express.static("public"));

// Use body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Use method-override
app.use(methodOverride("_method"));

// Use express-sanitizer
app.use(expressSanitizer());

// Create schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

// Create model
var Blog = mongoose.model("Blog", blogSchema);

// Redirect to index page
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

// Index page
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { blogs: blogs });
        }
    });
});

// New page
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

// Create page
app.post("/blogs", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

// Show page
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
});

// Edit page
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog)
    {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    }
    );
}
);

// Update page
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
});