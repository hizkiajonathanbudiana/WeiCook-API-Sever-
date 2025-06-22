"use strict";
const data = require("../data/cuisines.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    data.forEach((el) => {
      el.updatedAt = new Date(el.updatedAt);
      el.createdAt = new Date(el.createdAt);
    });
    await queryInterface.bulkInsert("Cuisines", data);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Cuisines", null, {});
  },
};
