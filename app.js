const express = require('express');
const bodyParser = require('body-parser');
const model = require('./model');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  model.DBUtility.findAllBlogs(blogsArray => {
    res.render('home', {
      blogsArray: blogsArray
    });
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.get('/posts/:blogID', async (req, res) => {
  const routeParamBlogID = req.params.blogID;
  try {
    model.DBUtility.findOneBlog(routeParamBlogID, foundBlog => {
      res.render('post', {
        blogTitlePassToEJS: foundBlog.title,
        blogContentPassToEJS: foundBlog.content
      });
    }); 
  } catch(err) {
    console.log(`Error: ${err}`);
  }     
});

app.post('/compose', async (req, res) => {
    const blogTitle = req.body.composeTitle;
    const blogContent = req.body.composeContent;
  try {
    await model.DBUtility.createNewBlogInDB(blogTitle, blogContent); 
  } catch(err) {
    console.log(`Error: ${err}`);
  }
  res.redirect('/');
});

app.post('/deleteBlog', async (req, res) => {
  const blogId = req.body.deleteBlogID
  try {
    const deletedBlog = await model.DBUtility.deleteOneBlogFromDB(blogId);
    console.log(`blog deleted: ${deletedBlog}`);  
  } catch(err) {
    console.log(`Error: ${err}`);
  }
  res.redirect('/');
});
  
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
