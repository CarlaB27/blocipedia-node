'use strict';

const faker = require("faker");

let users = [];

 for(let i = 1 ; i <= 15 ; i++){
  users.push({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.hacker.noun(),
    role: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

 for(let i = 1 ; i <= 10 ; i++){
  users.push({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.hacker.noun(),
    role: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

 for(let i = 1 ; i <= 5 ; i++){
  users.push({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.hacker.noun(),
    role: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

 module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});
  },

   down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
}; 