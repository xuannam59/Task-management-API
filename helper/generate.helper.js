module.exports.generateRandomChar = (length) => {
  const chars = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm0123456789";

  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.random() * chars.length);
  }

  return result;
}

module.exports.generateRandomNumber = (length) => {
  const numbers = "1234567890";

  let result = "";

  for (let i = 0; i < length; i++) {
    result += numbers.charAt(Math.random() * numbers.length);
  }

  return result;
}