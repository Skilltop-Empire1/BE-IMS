// Function to generate a random password
const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-15);
     // Generates an 8 character password
  };


  module.exports = {generateRandomPassword}