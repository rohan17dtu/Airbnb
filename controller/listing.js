const Listing = require("../models/listing");
module.exports.index = async (req,res)=>{
    const listings = await Listing.find({});
      res.render('listings/index.ejs',{listings});
      
    }
module.exports.renderNewForm =(req, res)=> {
    res.render("listings/new.ejs");
    }
module.exports.showListing = async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews" ,populate:{path:"author"}}).populate("owner");
    console.log(listing);
    if(!listing){
      req.flash("error" ,"listing doesnt exist");
      res.redirect("/listings")
    }
    console.log(listing.owner.username);
    res.render("listings/viewlisting.ejs",{listing});
  }
module.exports.createListing =async (req,res , next)=>{
  let url=req.file.path;
  let filename = req.file.filename;
  
  
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image.url = url;
    newlisting.image.filename = filename;
    
   await newlisting.save();
   
   console.log(newlisting.owner);
   req.flash("success" ,"new listing created");
   res.redirect(`/listings`);
  
   
 }
module.exports.editForm =async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
 //    console.log(listing.owner._id,res.locals.currentuser._id);
    if(!listing){
     req.flash("error" ,"listing doesnt exist");
     res.redirect("/listings")
   }
   let originalImageURL = listing.image.url;
   originalImageURL= originalImageURL.replace("upload","upload/w_250,h_300");
    res.render("listings/edit.ejs",{listing, originalImageURL} );
  }
module.exports.updateListing = async (req,res)=>{
  
   
    const id = req.params.id;
    const newlisting = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== 'undefined'){
      let url=req.file.path;
      let filename = req.file.filename;
      newlisting.image.url = url;
      newlisting.image.filename = filename;
      await newlisting.save();

    }
    
    console.log(newlisting);
    
    res.redirect(`/listings/${id}`);
  
  }
module.exports.deleteListing = async (req , res )=>{
    const {id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
  
  }
  