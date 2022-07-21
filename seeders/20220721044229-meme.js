'use strict';
const fs = require('fs')

module.exports = {
  up (queryInterface, Sequelize) {
    let data = JSON.parse(fs.readFileSync('./data/meme.json'))
    data.map(el=>{
      el.createdAt = new Date()
      el.updatedAt = new Date()
    })
    
    return queryInterface.bulkInsert('Memes', data)
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Memes', null)
  }
};
