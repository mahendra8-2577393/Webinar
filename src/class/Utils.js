const DataStore = require("../models/index");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");
const APIResponse = require("../utils/APIResponse");
const jwtSign = require("../utils/jwtSign");

const fs = require("fs");
const RoleRelation = {
  Admin: 0,
  Presenter: 1,
  Audience: 2,
};
const prefixUrl = "http://localhost:3000/";

class Utils {
  isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }
  /**
   * Gets all conferences from the database.
   * @returns {Promise<APIResponse>} - a promise that resolves to an APIResponse object with a status of 200 and a response body containing an array of all conferences
   * @throws {ApiError} - if any of the below conditions are met
   * - an error occurs while getting the conferences
   */
  async getAllConfrences() {
    try {
      // Get all conferences from the database
      const response = await DataStore.conference.find({});
      return new APIResponse(200, response);
    } catch (error) {
      console.error(error);
      // Throw an ApiError if an error occurs while getting the conferences
      throw new ApiError(500, "An error occured", [error.message]);
    }
  }

  /**
   * Gets a conference by its id.
   * @param {Object} payload - an object with a confrenceId property
   * @returns {Promise<APIResponse>} - a promise that resolves to an APIResponse object with a status of 200 and a response body containing the conference
   * @throws {ApiError} - if any of the below conditions are met
   * - confrenceId is not provided
   * - confrenceId is not a valid ObjectId
   * - an error occurs while getting the conference
   */
  async getConfrencesId(payload) {
    const { confrenceId } = payload;
    if (!confrenceId) {
      throw new ApiError(400, "confrenceId is required", ["Missing Parameter"]);
    }

    try {
      if (!this.isValidObjectId(confrenceId)) {
        throw new ApiError(400, "Invalid confrenceId", ["Invalid Parameter"]);
      }

      const response = await DataStore.conference.findById(confrenceId);
      return new APIResponse(200, response);
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "An error occured", [error.message]);
    }
  }
  /**
   * Gets conferences based on the provided userId and role.
   * The role must be either RoleRelation.Presenter or RoleRelation.Audience.
   * If the role is RoleRelation.Presenter, the conferences that the presenter is related to are returned.
   * If the role is RoleRelation.Audience, the conferences that the audience is related to are returned.
   * @param {Object} payload - an object with userId and role properties
   * @returns {Promise<APIResponse>} - a promise that resolves to an APIResponse object with a status of 200 and a response body containing the conferences
   * @throws {ApiError} - if any of the below conditions are met
   * - userId is not provided
   * - role is not provided
   * - userId is not a valid ObjectId
   * - role is not a valid role
   * - an error occurs while getting conferences
   */
  async getConfrenceByUserId(payload) {
    const { userId, role } = payload;
    if (!this.isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid userId", ["Invalid Parameter"]);
    }
    if (!userId || !role) {
      throw new ApiError(400, "userId and role are required", [
        "Missing Parameter",
      ]);
    }
    try {
      let response;
      switch (role) {
        case RoleRelation.Presenter:
          // Get conferences that the presenter is related to
          response = await DataStore.presenterRelation.find({
            presenterId: userId,
          });
          return new APIResponse(200, response);
        case RoleRelation.Audience:
          // Get conferences that the audience is related to
          response = await DataStore.userRelation.find({ AudienceId: userId });
          return new APIResponse(200, response);
        default:
          throw new ApiError(400, "Invalid role", ["Invalid Parameter"]);
      }
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "An error occured", [error.message]);
    }
  }

  /**
   * Filters conferences based on the provided modeOfConference and conferenceStatus.
   * If neither modeOfConference nor conferenceStatus is provided, all conferences are returned.
   * If modeOfConference is provided, conferences with any of the provided modes are returned.
   * If conferenceStatus is provided, conferences with any of the provided statuses are returned.
   * @param {Object} payload - an object with modeOfConference and conferenceStatus properties
   * @returns {Promise<APIResponse>} - a promise that resolves to an APIResponse object with a status of 200 and a response body containing the filtered conferences
   * @throws {ApiError} - if an error occurs while filtering conferences
   */
  async filterConfrences(payload) {
    const { modeOfConference, conferenceStatus } = payload;
    let filter = {};
    let response;
    if (!modeOfConference && !conferenceStatus) {
      response = await DataStore.conference.find({});
      return new APIResponse(200, response);
    }
    if (modeOfConference) {
      const modeArray = Array.isArray(modeOfConference)
        ? modeOfConference
        : [modeOfConference];
      filter.modeOfConference = { $in: modeArray };
    }
    if (conferenceStatus) {
      const statusArray = Array.isArray(conferenceStatus)
        ? conferenceStatus
        : [conferenceStatus];
      filter.conferenceStatus = { $in: statusArray };
    }
    response = await DataStore.conference.find(filter);
    return new APIResponse(200, response);
  }

  /**
   * Searches for conferences based on the provided searchText.
   * @param {Object} payload - an object with a searchText property
   * @returns {Promise<APIResponse>} - a promise that resolves to an APIResponse object with a status of 200 and a response body containing the search results
   * @throws {ApiError} - if any of the below conditions are met
   * - searchText is not provided
   * - an error occurs while searching for conferences
   */
  async searchConfrences(payload) {
    const { searchText } = payload;
    if (!searchText) {
      throw new ApiError(400, "searchText is required", ["Missing Parameter"]);
    }
    try {
      // Create a regex pattern to match the searchText case insensitively
      const title = { $regex: searchText, $options: "i" };
      // Search for conferences with titles that match the regex pattern
      const response = await DataStore.conference.find({
        title: title,
      });
      // Return a new APIResponse object with the search results
      return new APIResponse(200, response);
    } catch (error) {
      console.log(error);
      // Throw a new ApiError if an error occurs while searching for conferences
      throw new ApiError(500, "An error occured", [error.message]);
    }
  }

  /**
   * Compares the provided password with the confirmPassword to ensure they match.
   * This is a utility function that can be used to compare passwords during registration.
   * @param {Object} payload - an object with password and confirmPassword
   * @returns {boolean} - true if passwords match, false otherwise
   * @throws {ApiError} - if any of the below conditions are met
   * - password or confirmPassword is not provided
   * - passwords do not match
   */
  async passowrdCompare(payload) {
    const { password, confirmPassword } = payload;

    // Check if password and confirmPassword are provided
    if (!password || !confirmPassword) {
      throw new ApiError(400, "Bad Request", [
        "Please provide a password and confirmPassword",
      ]);
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
      throw new ApiError(400, "Bad Request", [
        "Password and confirm password do not match",
      ]);
    }

    // Return true if the passwords match
    return true;
  }

  /**
   * Logs in a user
   * @param {Object} payload - an object with email and password
   * @returns {Promise<APIResponse>} - a promise that resolves to an APIResponse
   * @throws {ApiError} - if any of the below conditions are met
   * - email or password is not provided
   * - user is not found
   * - password is incorrect
   * - internal server error
   */
  async login(payload) {
    const { email, password } = payload;
    if (!email || !password) {
      throw new ApiError(400, "Bad Request", [
        "Please provide an email and password",
      ]);
    }

    try {
      // find the user in the database
      let record = await DataStore.Audience.findOne({ email });
      if (!record) {
        record = await DataStore.presenter.findOne({ email });
      }
      if (!record) {
        record = await DataStore.admin.findOne({ email });
      }

      // if user is not found
      if (!record) {
        throw new ApiError(404, "Not Found", ["Credentials are wrong"]);
      }

      // compare password with the one in the database
      const isMatch = await bcrypt.compare(password, record.password);
      if (!isMatch) {
        throw new ApiError(400, "Bad Request", ["Credentials are wrong"]);
      }

      // if password is correct, generate a token and send it in the response
      let payload = {
        name: record.name,
        email: record.email,
        userRole: record.userRole,
      };
      let token = jwtSign(payload);

      return new APIResponse(200, record, token);
    } catch (error) {
      console.error("Login error:", error);
      throw new ApiError(500, "Internal Server Error", [error.message]);
    }
  }
  async uploadImage(payload) {}
  async getPaper(paperUrl, res) {
    let filePath = paperUrl.replace(prefixUrl, "");
    let file = fs.createReadStream(filePath);
    let stat = fs.statSync(filePath);
    const { fileOriginalName } = DataStore.presenterRelation.findOne({
      paper_url: paperUrl,
    });
    res.setHeader;
  }
}

module.exports = Utils;
