const mongoose = require('mongoose');
require('dotenv').config();

//connect to DB
mongoose.connect(process.env.MONGODB_DATABASE_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, 
(err) => {
    try {
        console.log(`Server connected successfully to MongoDB`);
    } catch (err) {
        console.log(err);
    }
});

//create schema
const blogSchema = new mongoose.Schema ({
  title: String,
  content: String
});

//create model (aka Collection) (equivalent to Table in SQL))
const Blog = mongoose.model('Blog', blogSchema);

class DBUtility {

    // *** DB utility methods

    static findOneBlog(blogID, callBack) {
        Blog.findOne({_id: blogID}, (err, foundBlog) => {
            let blog = null;
            if (err) {
                console.log(err);         
            } else {
                blog = foundBlog
                callBack(blog);
            }
        });
    }

    static findAllBlogs(callBack) {
        Blog.find({}, (err, allBlogs) => {
            if (err) {
                console.log(err);
            } else {
                callBack(allBlogs);
            }  
        });
    }
  
    static createNewBlogInDB(blogTitle, blogContent) {
        return new Promise((resolve, reject) => {
            const blog = new Blog({
                title: blogTitle,
                content: blogContent
            });
            blog.save(err => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(`created list ${blog.title} successfully.`);
                    resolve(blog);
                }
            });
        });
    }
  
    static deleteOneBlogFromDB(blogID) {
        return new Promise((resolve, reject) => {
            Blog.findByIdAndDelete(blogID, (err, deletedBlog) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(`Deleted list ${deletedBlog.name} successfully`);
                    resolve(deletedBlog);
                }
            });
        });
    }
}

exports.DBUtility = DBUtility;