const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const { param } = require("../route/route");

const createBlog = async function (req, res) {
  try {
    let blog = req.body;
    if (Object.keys(blog).length == 0) {
      return res.status(400).send({ status: false, msg: "data can't be empty" });
    }
    //if(blog==null) res.status(400).send({status: false, msg: "Please include blog content"})
    if (!blog.title)
      res.status(400).send({ status: false, msg: "Please include an title" });
    if (!blog.body)
      res.status(400).send({ status: false, msg: "Please include an body" });
    if (!blog.authorId)
      res
        .status(400)
        .send({ status: false, msg: "Please include an authorId" });
    if (!blog.category)
      res
        .status(400)
        .send({ status: false, msg: "Please include an category" });

    let blogData = await authorModel.findById(blog.authorId);
    if (!blogData)
      res
        .status(400)
        .send({ status: false, msg: "Please use right author id" });

    let blogCreated = await blogModel.create(blog);
    res
      .status(201)
      .send({
        status: true,
        msg: "data created successfully",
        data: blogCreated,
      });
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ status: false, msg: "Error", error: err.message });
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getBlogs = async function (req, res) {
  try {
    let filterResult = req.query;
    //console.log(filterResult)
    if (Object.keys(filterResult).length == 0) {
      return res.status(400).send({ status: false, msg: "Please include some filter parameter"});
    }
    if (filterResult.authorId || filterResult.category || filterResult.tags || filterResult.subcategory){

    
    
    let data = await blogModel
        .find(  filterResult, {isDeleted: false}, {isPublished: true})     //{$and:[data, {isDeleted: false}]});
        .populate("authorId");
      if (!data) {
        res.status(404).send({ status: false, msg: "Data not found" });
      }
      res.status(200).send({ status: true, msg: data });
    } 
    else res.status(404).send({status: false, msg: "Please include correct filter parameter"})  
  }
    catch (err) {
    console.log("This is the error:", err.message);
    res.status(500).send({ status: false, msg: "Error", error: err.message });
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let data = req.body;
    let blog = await blogModel.findById(blogId);
    if (Object.keys(blog).length == 0) {
      return res.status(404).send("No such blog found");
    }
    if (data.title) blog.title = data.title;
    if (data.category) blog.category = data.category;
    if (data.body) blog.body = data.body;
    if (data.tags) {
      blog.tags.push(data.tags);
    }
    if (data.subcategory) {
      blog.subcategory.push(data.subcategory);
    }
    blog.isPublished = true;
    blog.publishedAt = Date.now();
    let updateData = await blogModel.findOneAndUpdate({ _id: blogId }, blog, {
      new: true,
    });
    res.status(200).send({ msg: updateData });
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    if (!blogId)
      res.status(400).send({ status: false, msg: "Please include an blogId" });
    let blog = await blogModel.findById(blogId);
    if (!blog)
      return res.status(404).send({ status: false, msg: "BLOG NOT FOUND" });
    if (blog.isDeleted == true) {
      res
        .status(400)
        .send({ status: false, msg: "This data is already deleted" });
    }
    let newData = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true } },
      { new: true }
    );
    res.status(200).send({ status: true });
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ status: false, msg: "ERROR", error: err.message });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  

const deleteqBlog = async function (req, res) {
  try {
    let data = req.query;
    //if (!data.authorId)
      // return res.status(400).send({ status: false, msg: "author id required" });
   
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "no parameter provided for deleting" });
    }

    if (data.tags) {
      data.tags = {
        $in: data.tags,
      };
    }

    if (data.subcategory) {
      data.subcategory = {
        $in: data.subcategory,
      };
    }

    
    const blog = await blogModel.findOne(data);
    if (!blog) return res.status(404).send({status: false, msg: 'BLOG NOT FOUND' });
    if (blog.isDeleted == true) {
      res
        .status(400)
        .send({ status: false, msg: "This data is already deleted" }); }
   
    //if (blog.isDeleted == "true") return res.status(400).send({status: false, msg: "This data is already deleted"}); 
    const deletedData = await blogModel.updateMany(data, {
      $set: {
        isDeleted: true,
        deletedAt: Date.now()}
      },
      {new: true}
    );
      let f = await blogModel.findOne({deletedData}).select({deletedAt:1, isDeleted:1, _id:0})
    res.status(200).send({ status: true, msg: f });
  } 

  catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteqBlog = deleteqBlog;
