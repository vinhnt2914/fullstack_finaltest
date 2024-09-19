const { users, links } = require("./data");

// utility functions

const findUser = (id) => {
  return users.find((user) => user.id === id);
};

module.exports = { findUser };
