const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");

function hasBlankSpaces(str){
  return  str.match(/^\s+$/) !== null; 
}
const createBlog = async function (req, res) {
  try {
    let blog = req.body;
    if (Object.keys(blog).length == 0) {
      return res.status(400).send({ status: false, error: "data can't be empty" });
    }

    if (!blog.body)
      res.status(400).send({ status: false, error: "Please include an body" });
    if (!blog.authorId)
      res.status(400).send({ status: false, error: "Please include an authorId" });
    if (!blog.category)
      res.status(400).send({ status: false, error: "Please include an category" });

    let blogData = await authorModel.findById(blog.authorId);
    if (!blogData)res.status(400).send({ status: false, error: "Please use right author id" });

    let blogCreated = await blogModel.create(blog);
    res.status(201).send({status: true,error: "data created successfully",data: blogCreated,});
  } 
  catch (err) {
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
      return res.status(400).send({ status: false, error: "Please include some filter parameter"});
    }
    if (filterResult.authorId || filterResult.category || filterResult.tags || filterResult.subcategory){

    
    
    let data = await blogModel.find(  filterResult, {isDeleted: false}, {isPublished: true}).populate("authorId");    
     //{$and:[data, {isDeleted: false}]});
        
    if (data.length ==0) {
        return res.status(404).send({ status: false, error: "Data not found" });
      }
    return res.status(200).send({ status: true, Data: data });
    } 
    else res.status(404).send({status: false, error: "Please include correct filter parameter"})  
  }
    catch (err) {
    console.log("This is the error:", err.message);
    res.status(500).send({ status: false, msg: "Error", error: err.message });
  }
};

//Updating the blog ->

const updateBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let data = req.body;
    if (Object.keys(data).length == 0) return res.status(404).send({status: false, error: "Please include some properties to be updated"});
    let blog = await blogModel.findById(blogId);
    if (Object.keys(blog).length == 0) {
      return res.status(404).send({status: false, error:"No such blog found"});
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
    let updateData = await blogModel.findOneAndUpdate({ _id: blogId }, blog, 
      {new: true,});

    return res.status(200).send({status: true,  Data: updateData });
    } catch (err) {
     return res.status(500).send({ msg: "Error", error: err.message });
  }
};


//Deleting the blog via params ->


const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    //console.log(blogId)
    if (!blogId)
      res.status(400).send({ status: false, error: "Please include an blogId" });
    let blog = await blogModel.findById(blogId);
    if (!blog)
      return res.status(404).send({ status: false, error: "BLOG NOT FOUND" });
    if (blog.isDeleted == true) {
      return res
        .status(400)
        .send({ status: false, error: "This data is already deleted" });
    }
    let newData = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true } },
      { new: true }
      );
    return res.status(200).send({ status: true });
  } catch (err) {
    console.log("This is the error :", err.message);
    return res.status(500).send({ status: false, msg: "ERROR", error: err.message });
  }
};

//deleting blog via query ==>


  

const deleteBlogByQuery = async function (req, res) {
  try {
    let data = req.query;
    //if (!data.authorId)
      // return res.status(400).send({ status: false, msg: "author id required" });
   
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, error: "no parameter provided for deleting" });
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
    if(data.authorId || data.subcategory ||  data.category ||  data.tags || data.isPublished ) {
        let newData = await blogModel.find(data,{isPublished: false}) 
    
       //const blog = await blogModel.findOne(data);
       if (newData.length == 0) return res.status(404).send({status: false, error: 'BLOG NOT FOUND' });
        for (let i=0; i<newData.length; i++){
          if (newData[i].isDeleted == true) {return res.status(400).send({ status: false, error: "This data is already deleted" }); }
        }
      
   
   
    const deletedData = await blogModel.updateMany(newData, {
        $set: {
        isDeleted: true,
        deletedAt: Date.now()}
        },
      {new: true}
    );
      let result = await blogModel.findOne({deletedData}).select({isDeleted:1, deletedAt:1,  _id:0})
    return res.status(200).send({ status: true, msg: result });
  }
  else  {return res.status(400).send({ status: false, error: "Parameters for deleting can only be authorId, category, tags, subcategory or isPublished" }); }
  }
  catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogByQuery = deleteBlogByQuery;
