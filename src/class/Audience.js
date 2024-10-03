const bcrypt = require("bcryptjs");
const DataStore = require("../models");
const ApiError = require("../utils/ApiError");
const APIResponse = require("../utils/APIResponse");
const jwtSign = require("../utils/jwtSign");
const utils = require("./Utils");
const prefixUrl = "http://localhost:3000/";
class Audience {
  async registerAudience(payload) {
    const salt = bcrypt.genSaltSync(10);
    let failSafe = {};
    const {
      title,
      firstName,
      secondName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      gender,
      dateOfBirth,
      address,
      city,
      state,
      userRole,
      securityQuestion,
      profileImageUrl,
    } = payload;
    if (
      !title ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber ||
      !gender ||
      !dateOfBirth ||
      !address ||
      !city ||
      !state ||
      !userRole ||
      !securityQuestion
    ) {
      throw new ApiError(400, "Bad Request", [
        "Please provide a valid payload",
      ]);
    }
    utils.passowrdCompare(password, confirmPassword);
    let fullName;
    if (secondName) {
      fullName = firstName + " " + secondName + " " + lastName;
    } else {
      fullName = firstName + " " + lastName;
    }
    try {
      const checkAudience = await DataStore.Audience.findOne({
        email: email,
      });
      if (checkAudience(email)) {
        const hash = bcrypt.hashSync(password, salt);
        const newAudience = new DataStore.Audience({
          title: title,
          name: fullName,
          email: email,
          password: hash,
          phoneNumber: phoneNumber,
          gender: gender,
          dateOfBirth: dateOfBirth,
          address: address,
          city: city,
          state: state,
          userRole: userRole,
          securityQuestion: securityQuestion,
          profileImageUrl: profileImageUrl,
        });
        failSafe = await newAudience.save();
        const result = await DataStore.Audience.findById(
          newAudience._id,
          "-password -securityQuestion"
        );
        let payload = {
          name: fullName,
          email: email,
          userRole: userRole,
        };
        let token = jwtSign(payload);
        return new APIResponse(201, result, token);
      }
    } catch (error) {
      console.log(error);
      if (failSafe._id) {
        await DataStore.presenter.deleteOne({ _id: failSafe._id });
      }
      throw new ApiError(500, "An error occured", [error.message]);
    }
  }
}
