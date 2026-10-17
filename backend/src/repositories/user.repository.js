const User=require('../models/user.model.js');
//This file's only job is database queries. No business logic, no password checking — just raw database operations

const userRepository = {
  findByEmail: async (email) => {
    return await User.findOne({ email })
  },

  findById: async (id) => {
    return await User.findById(id )
  },

  create: async (userData) => {
    return await User.create(userData)
  }
}

module.exports = userRepository