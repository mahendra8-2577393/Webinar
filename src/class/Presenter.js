const fs = require("fs");
const bcrypt = require("bcryptjs");
const DataStore = require("../models");
const ApiError = require("../utils/ApiError");
const APIResponse = require("../utils/APIResponse");
const jwtSign = require("../utils/jwtSign");
const Utils = require("./Utils");

const utils = new Utils();
const prefixUrl = "http://localhost:3000/";

class Presenter {
  async pastAttendedConferences(payload) {
    const { presenterId } = payload;
    if (!presenterId) {
      throw new ApiError(400, "Bad Request", ["Please provide a presenterId"]);
    }
    try {
      const response = await DataStore.presenterRelation.find({ presenterId });
      return new APIResponse(200, response);
    } catch (error) {
      console.error(error);
      throw new ApiError(500, "An error occurred", [error.message]);
    }
  }

  async registerPresenter(payload) {
    const { presenterId, streamOfPaper, validatePresenter, conferenceId } =
      payload;

    if (!validatePresenter) {
      throw new ApiError(400, "Not verified", [
        "Please contact admin for verification",
      ]);
    }

    if (
      !utils.isValidObjectId(presenterId) ||
      !streamOfPaper ||
      !utils.isValidObjectId(conferenceId)
    ) {
      throw new ApiError(400, "Bad Request", [
        "Please provide valid presenterId, streamOfPaper, and conferenceId",
      ]);
    }

    try {
      const existingPresenter = await DataStore.presenterRelation.findOne({
        presenterId,
        conferenceId,
      });
      if (existingPresenter) {
        throw new ApiError(409, "Already Registered", [
          "Presenter already registered",
        ]);
      }

      const presenterRelation = new DataStore.presenterRelation({
        presenterId,
        streamOfPaper,
        conferenceId,
      });
      await presenterRelation.save();
      return new APIResponse(201, presenterRelation);
    } catch (error) {
      console.error(error);
      throw new ApiError(500, "An error occurred", [error.message]);
    }
  }

  async saveConferencePaper(payload) {
    const { conferenceId, presenterId, filePath, originalName } = payload;

    if (!conferenceId || !presenterId || !filePath) {
      throw new ApiError(400, "Bad Request", [
        "Please provide a conferenceId, presenterId, and filePath",
      ]);
    }

    try {
      const updatedRecord = await DataStore.presenterRelation.findOneAndUpdate(
        { conferenceId, presenterId },
        {
          $set: {
            filePath: prefixUrl + filePath,
            fileOriginalName: originalName,
          },
        },
        { new: true }
      );
      return new APIResponse(200, updatedRecord);
    } catch (error) {
      console.error(error);
      throw new ApiError(500, "An error occurred", [error.message]);
    }
  }

  async updateRegisterDetails(payload) {
    const { presenterId, streamOfPaper, conferenceId } = payload;

    if (!presenterId || !streamOfPaper || !conferenceId) {
      throw new ApiError(400, "Bad Request", [
        "Please provide presenterId, streamOfPaper, and conferenceId",
      ]);
    }

    try {
      const existingRecord = await DataStore.presenterRelation.findOne({
        presenterId,
        conferenceId,
      });
      if (!existingRecord) {
        throw new ApiError(404, "Not Found", ["You are not registered"]);
      }

      const updatedRecord = await DataStore.presenterRelation.findOneAndUpdate(
        { presenterId, conferenceId },
        { $set: { streamOfPaper } },
        { new: true }
      );
      return new APIResponse(200, updatedRecord);
    } catch (error) {
      console.error(error);
      throw new ApiError(500, "An error occurred", [error.message]);
    }
  }

  async updatePaper(payload) {
    const { conferenceId, presenterId, oldPaperUrl, filePath, originalName } =
      payload;

    if (
      !conferenceId ||
      !presenterId ||
      !oldPaperUrl ||
      !filePath ||
      !originalName
    ) {
      throw new ApiError(400, "Bad Request", [
        "Please provide conferenceId, presenterId, oldPaperUrl, filePath, and originalName",
      ]);
    }

    try {
      const oldFilePath = oldPaperUrl.replace(prefixUrl, "");
      fs.unlink(oldFilePath, (err) => {
        if (err)
          throw new ApiError(500, "Unable to delete old paper", [err.message]);
        console.log("Old paper deleted successfully");
      });

      const updatedRecord = await DataStore.presenterRelation.findOneAndUpdate(
        { conferenceId, presenterId },
        {
          $set: {
            filePath: prefixUrl + filePath,
            fileOriginalName: originalName,
          },
        },
        { new: true }
      );
      return new APIResponse(200, updatedRecord);
    } catch (error) {
      console.error(error);
      throw new ApiError(500, "An error occurred", [error.message]);
    }
  }

  async deletePaper(payload) {
    const { conferenceId, presenterId, paperUrl } = payload;

    if (!paperUrl || !conferenceId || !presenterId) {
      throw new ApiError(400, "Bad Request", [
        "Please provide paperUrl, conferenceId, and presenterId",
      ]);
    }

    try {
      const filePath = paperUrl.replace(prefixUrl, "");
      fs.unlink(filePath, (err) => {
        if (err)
          throw new ApiError(500, "Unable to delete paper", [err.message]);
        console.log("Paper deleted successfully");
      });

      const updatedRecord = await DataStore.presenterRelation.findOneAndUpdate(
        { conferenceId, presenterId },
        { $set: { filePath: null } },
        { new: true }
      );
      return new APIResponse(200, updatedRecord);
    } catch (error) {
      console.error(error);
      throw new ApiError(500, "An error occurred", [error.message]);
    }
  }

  async checkPresenter(payload) {
    const { email } = payload;

    if (!email) {
      throw new ApiError(400, "Bad Request", ["Please provide an email"]);
    }

    try {
      const existingPresenter = await DataStore.presenter.findOne({ email });
      if (existingPresenter) {
        throw new ApiError(409, "Already Registered", [
          "Presenter already registered",
        ]);
      }
    } catch (error) {
      console.error(error);
      throw new ApiError(500, "An error occurred", [error.message]);
    }
  }

  async registerPresenter(payload) {
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
      linkeldnUrl,
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
      !linkeldnUrl ||
      !securityQuestion
    ) {
      throw new ApiError(400, "Bad Request", [
        "Please provide a valid payload",
      ]);
    }

    utils.passowrdCompare(password, confirmPassword);
    const fullName = [firstName, secondName, lastName]
      .filter(Boolean)
      .join(" ");

    try {
      const existingPresenter = await DataStore.presenter.findOne({ email });
      if (existingPresenter) {
        throw new ApiError(409, "Already Registered", [
          "Presenter already registered",
        ]);
      }

      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      const newPresenter = new DataStore.presenter({
        title,
        name: fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        gender,
        dateOfBirth,
        address,
        city,
        state,
        userRole,
        linkeldnUrl,
        securityQuestion,
        profileImageUrl,
      });

      const result = await newPresenter.save();
      const payload = { name: fullName, email, userRole };
      const token = jwtSign(payload);

      return new APIResponse(201, result, token);
    } catch (error) {
      console.error(error);
      throw new ApiError(500, "An error occurred", [error.message]);
    }
  }
}

module.exports = Presenter;
