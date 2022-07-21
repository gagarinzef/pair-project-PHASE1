'use strict';
const fs = require('fs')

module.exports = {
  up (queryInterface, Sequelize) {
    let data = JSON.parse(fs.readFileSync('./data/meme-detail.json'))
    data.map(el=>{
      el.createdAt = new Date()
      el.updatedAt = new Date()
    })
    
    return queryInterface.bulkInsert('MemeDetails', data)
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('MemeDetails', null)
  }
};
