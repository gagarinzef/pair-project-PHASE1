'use strict';
const fs = require('fs')

module.exports = {
  up (queryInterface, Sequelize) {
    let data = JSON.parse(fs.readFileSync('./data/tag.json'))
    data.map(el=>{
      el.createdAt = new Date()
      el.updatedAt = new Date()
    })
    
    return queryInterface.bulkInsert('Tags', data)
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Tags', null)
  }
};
