'use strict';
const fs = require('fs')

module.exports = {
  up (queryInterface, Sequelize) {
    let data = JSON.parse(fs.readFileSync('./data/profile.json'))
    data.map(el=>{
      el.createdAt = new Date()
      el.updatedAt = new Date()
    })
    
    return queryInterface.bulkInsert('UserProfiles', data)
  },

  down (queryInterface, Sequelize) {
     return queryInterface.bulkDelete('UserProfiles', null)
  }
};
