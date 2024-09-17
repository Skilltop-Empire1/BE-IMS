// Function to generate a random password
const generateRandomPassword = (min, max) => {
    return Math.random(70, 90).toString(36).slice(-36);
     // Generates an 8 character password
  };



  


  module.exports = {generateRandomPassword}


  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}