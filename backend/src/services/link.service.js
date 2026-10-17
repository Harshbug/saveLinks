const linkRepository = require("../repositories/link.repository")
const { metadataQueue } = require('../config/queue');
//save links then push linkId,url to the queue


//creating link
const createLink = async (userId, url) => {
    const link = await linkRepository.createLink({ userId, url });
    //this first arg is name of the job name and other one is job.data
    await metadataQueue.add('fetch-metadata', {
        linkid: link._id,
        url: link.url,
    })
    return link;
}

//Listing a user's links

//we'll use finding link by user 
const getLinksForUser = async (userId, { page, limit } = {}) => {
    return linkRepository.findLinksByUser(userId, { page, limit });
}


// Getting one link
const getLinkById = async (linkId, userId) => {
    return linkRepository.findLinkById(linkId, userId);
}

// Updating a link:how do we do it what will happen to metadata status
const updateLink = async (linkId, userId, updates) => {
    if (updates.url) {
        updates.metadataStatus = 'pending';
        updates.title = null;
        updates.description = null;
        updates.image = null;
        updates.favicon = null;
    }
    const link = await linkRepository.updateLink(linkId, userId, updates);

    //Push add the jobs only if the url is updated
    if (updates.url) {
        await metadataQueue.add('fetch-metadata', { linkId, url: updates.url });
    }

    return link;

}


// Deleting a link
const deleteLink = async (linkId, userId)=>{
    //This statement will delete the link of user 
    return linkRepository.deleteLink(linkId, userId);
}



module.exports = {
    createLink,
    getLinksForUser,
    getLinkById,
};