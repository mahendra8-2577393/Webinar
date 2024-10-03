const audience = require("../class/Audience");
const audienceController = new audience();

const registerAudience = (req, res, next) => {
  const {
    title,
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    gender,
    dateOfBirth,
    address,
    city,
    state,
    securityQuestion,
  } = req.body;
  const profileImage = req.file?.path;
  audienceController
    .registerAudience({
      title,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      gender,
      dateOfBirth,
      address,
      city,
      state,
      securityQuestion,
      profileImage,
    })
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  registerAudience,
};
