
const authorModel = require("../models/authorModel")
const blogModel= require("../models/blogModel")







const createBlog = async function (req, res) {
    try{
    
    let blog = req.body
    if(!blog.title) res.status(400).send({status: false, msg: "Please include an title"})
    if(!blog.body) res.status(400).send({status: false, msg:"Please include an body"})
    if(!blog.authorId) res.status(400).send({status: false, msg: "Please include an authorId"})
    if(!blog.category) res.status(400).send({status: false, msg: "Please include an category"})

    let blogData = await authorModel.findById(blog.authorId)
    if (!blogData) res.status(400).send ("Please use right author id")
   
    
   
    let blogCreated = await blogModel.create(blog)
    res.send({data: blogCreated})
                }
catch (err) {
    console.log('This is the error :', err.message);
    res.status(500).send({ msg: 'Error', error: err.message });
}
}

const getBlogs = async function (req, res) {
            try{
               let data = await blogModel.find({isDeleted: false , isPublished: true})
               if (!data) {
                res.status(404).send({status: false, msg: "Data not found"})
               }
             let d = req.query  
            // d = 1,2,3....1 = d.1 filter(d)
            let authorId = req.query.authorId
            let category = req.query.category
            let tags = req.query.tags
            let subcategory = req.query.subcategory

            let f = await data.select({authorId: authorId, category: category, tags: tags, subcategory: subcategory}) 
            res.status(200).send({status: true, msg: data})
            } catch (err) {
                console.log('This is the error :', err.message);
                res.status(500).send({ msg: 'Error', error: err.message });


}  
}

/* const getAllBlogs = async function (req, res) {
    try {
      let allBlogs = await BlogModel.find(
        { isDeleted: { $eq: false } },
        { isPublished: { eq: true } }
      );
      if (!allBlogs) {
        return res.status(404).send({ msg: '' });
      }
      res.status(200).send(allBlogs);
    } catch (err) {
      console.log('This is the error :', err.message);
      res.status(500).send({ msg: 'Error', error: err.message });
    }
  }; */

  const updateBlog = async function (req, res) {
    try {
      let blogId = req.params.blogId;

      let blog = await blogModel.findById(blogId);
      if (!blog) return res.status(404).send({ msg: 'BLOG NOT FOUND' });
      let updatedtags = blog.tags;
      let updatedsubcategory = blog.subcategory
      let tags = req.body.tags;
      let subcategory = req.body.subcategory;
      updatedtags.push(tags);
      updatedsubcategory.push(subcategory);
      let blogData = req.body;
      let updatedBlog = await blogModel.findOneAndUpdate(
        { _id: blogId },
        //blogData,
        {tags: updatedtags } ,
        {subcategory: updatedsubcategory}, 
        { new: true }
      );
      res
        .status(200)
        .send({ msg: 'Updated successfully', data: updatedBlog });
    } catch(err) {
      console.log('This is the error :', err.message);
      res.status(500).send({ msg: 'ERROR', error: err.message });
    }
  };
/*   const postMessage = async function (req, res) {
    let user = await userModel.findById(req.params.userId);
    if (!user) return res.send({ status: false, msg: 'No such user exists' });
    let updatedPosts = user.posts;
    let message = req.body.message;
    updatedPosts.push(message);
    let updatedUser = await userModel.findOneAndUpdate(
      { _id: user._id },
      { posts: updatedPosts },
      { new: true }
    );
    return res.send({ status: true, data: updatedUser });  
 */
   

 

  
  


module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlog = updateBlog
