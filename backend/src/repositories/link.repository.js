const { useImperativeHandle } = require("react");
const Link=require("../models/link.model");
const { create, findById } = require("../models/user.model");

const createLink=async(data)=>{
    const link=await Link.create(data);
    return link;
}

//Need to find the link we'll maybe need to use pagination
const findlinkbyUser=async(userId,{page=1,limit=20}={})=>{
    const skip=(page-1)*limit;
    const link=await Link.find({userId})
        .sort({createAt:-1})
        .skip(skip)
        .limit(limit);
    return link;
}

const findlinkbyId=async(id,userId)=>{
    const link=await Link.find({_id:id,userId});
    return link;
}

const findlinkbyInternal=async(id)=>{
    const link=await Link.findbyId(id);
    return link;
}

//we are passing userID to update the the url linked to the user ?
const updateLink=async(id,userId,updates)=>{
    const link=await Link.findOneAndUpdate(
        {_id:id,userId},
        updates,
        {new:true}
    );
    return link;
}

//used by the worker
const updatelinkInternal=async(id,updates)=>{
    const link=await Link.findByIdAndUpdate(id,updates,{new:true});
    return link;
}

const deleteLink = async(id,userId)=>{
    const result=await Link.findOneAndDelete({_id:id,userId});
    return result;
}

module.exports = {
    createLink,
    findLinksByUser,
    findLinkById,
    findLinkByIdInternal,
    updateLink,
    updateLinkInternal,
    deleteLink
};
