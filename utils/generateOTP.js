const generateOTP = () => {
  // توليد رقم عشوائي بين 100000 و 999999 وتحويله لنص (String)
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = generateOTP;