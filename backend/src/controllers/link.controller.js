const { asyncSend } = require("bullmq");
const { createLink } = require("../repositories/link.repository");
const linkService=require("../services/link.service");
//create link,list all the link,list one link which is searched,update,and remove

const create=async(req,res)=>{
    const link = await createLink(req.user.userId,req.body.url);
    res.status(201).json({sucess:true,data:link});
};

//list all the link

const listAll=async(req,res)=>{
    const page=Math.max(parseInt(req.query.page)|| 1,1);
    const limit=Math.min(parseInt(req.query.limit) || 20,100)
    const listAll=await linkService.getLinksForUser(req.user.userId,{page,limit});
    res.json({ success: true, data: links });
}

//get one ling
const getOne=async(req,res)=>{
    const getLink=await linkService.getLinkById(req.params.id,req.user.userId)
    if(!getLink) return res.status(404).json({sucess:false,message:'link not found'})
    res.json({sucess:true,data:getLink})
}

//update link
const updateLink=async(req,res)=>{
    const UpdateLink=await linkService.updateLink(req.params.id,req.user.userId,req.body);
    if(!link) return res.status(404).json({sucess:false,message:'Link is not provided'})
    res.json({
        sucess:true,
        data:updateLink
    })
}
const remove = async (req, res) => {
  const link = await linkService.deleteLink(req.params.id, req.user.userId);
  if (!link) return res.status(404).json({ success: false, message: 'Link not found' });
  res.status(204).send();
};

module.exports = { create, listAll, getOne, updateLink, remove };