const DataStore = require("../models/index");
const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const APIResponse = require("../utils/APIResponse");
const Utils = require("./Utils");
const utils = new Utils();
//const { getIo } = require("../utils/socketResponse");
const dataValidation = require("../utils/DateValidation");
const USER_TYPES = {
  Audience: "Audience",
  Presenter: "Presenter",
};
const DataResponse = {
  Year: "Y",
  Month: "M",
  Day: "D",
};
//const io = getIo();
class Admin {
  async listAllUsers(payload) {
    const { confrenceId, type } = payload;
    if (!confrenceId || !type) {
      throw new ApiError(400, "ConfrenceId and type are required", [
        "Missing Parameter",
      ]);
    }
    let queryForAudience = [
      {
        $facet: {
          response: [
            {
              $match: { conferenceId: { $eq: confrenceId } },
              $lookup: {
                from: DataStore.Audience,
                localField: "AudienceId",
                foreignField: "_id",
                as: "Audience",
              },
              $project: {
                AudienceId: 0,
              },
            },
          ],
          count1: [
            {
              $match: {
                conferenceId: { $eq: confrenceId },
                modeOfAttendence: { $eq: "Online" },
              },
              $count: "OnlineAudience",
            },
          ],
          count2: [
            {
              $match: {
                conferenceId: { $eq: confrenceId },
                modeOfAttendence: { $eq: "Offline" },
              },
              $count: "OfflineAudience",
            },
          ],
          count3: [
            {
              $match: { conferenceId: { $eq: confrenceId } },
              $lookup: {
                from: DataStore.Audience,
                localField: "AudienceId",
                foreignField: "_id",
                as: "Audience",
              },
              $match: { "Audience.ourCollegeStudent": { $eq: false } },
              $count: "NotOurCollegeStudentAudience",
            },
          ],
        },
      },
    ];
    let queryForPresenter = [
      {
        $match: { conferenceId: { $eq: confrenceId } },
        $lookup: {
          from: DataStore.presenter,
          localField: "presenterId",
          foreignField: "_id",
          as: "presenter",
        },
      },
    ];
    try {
      let response;
      switch (type) {
        case USER_TYPES.Audience:
          response = await DataStore.userRelation.aggregate(queryForAudience);
          break;
        case USER_TYPES.Presenter:
          response = await DataStore.userRelation.aggregate(queryForPresenter);
          break;
        default:
          throw new ApiError(400, "Invalid type", ["Invalid type"]);
      }
      return new APIResponse(200, response);
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "An error occured", [error.message]);
    }
  }
  async VerifyPresenter(payload) {
    const { presneterId, isValid } = payload;
    if (!presneterId || !isValid) {
      throw new ApiError(400, "presenterId and isValid is required", [
        "Parameters is missing",
      ]);
    }
    try {
      const response = await DataStore.presenter.findByIdAndUpdate(
        { _id: presneterId },
        { validatePresenter: true },
        { new: true }
      );
      if (response.validatePresenter === true) {
        return new APIResponse(200, response);
      } else {
        throw new ApiError(400, "Presenter is not verified", [
          "Presenter is not verified",
        ]);
      }
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "An error occured", [error.message]);
    }
  }
  async createConfrence(payload) {
    const {
      title,
      fieldsAvailable,
      startDate,
      endDate,
      modeOfConference,
      description,
    } = payload;
    if (
      !title ||
      !fieldsAvailable ||
      !startDate ||
      !endDate ||
      !modeOfConference ||
      !description
    ) {
      throw new ApiError(
        400,
        "title, fieldsAvailable, startDate, endDate and modeOfConference are required",
        ["Missing Parameter"]
      );
    }
    try {
      let result = dataValidation(startDate, endDate);
      switch (result.issue) {
        case DataResponse.Year:
          throw new ApiError(400, "Start Year is greater than current year", [
            "Start Year is greater than current year",
          ]);

        case DataResponse.Month:
          throw new ApiError(400, "Start Month is greater than current month", [
            "Start Month is greater than current month",
          ]);

        case DataResponse.Day:
          throw new ApiError(400, "Start Day is greater than current day", [
            "Start Day is greater than current day",
          ]);

        default:
          break;
      }

      const response = await DataStore.conference.create({
        title,
        fieldsAvailable,
        startDate,
        endDate,
        modeOfConference,
        description,
      });
      return new APIResponse(200, response);
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "An error occured", [error.message]);
    }
  }
  async updateConfrence(payload) {
    const {
      confrenceId,
      title,
      fieldsAvailable,
      startDate,
      endDate,
      modeOfConference,
      description,
      conferenceStatus,
    } = payload;
    if (!utils.isValidObjectId(confrenceId)) {
      throw new ApiError(400, "Invalid confrenceId", ["Invalid Parameter"]);
    }
    if (
      !confrenceId ||
      !title ||
      !fieldsAvailable ||
      !startDate ||
      !endDate ||
      !modeOfConference ||
      !description ||
      !conferenceStatus
    ) {
      throw new ApiError(
        400,
        "confrenceId, title, fieldsAvailable, startDate, endDate, modeOfConference and description are required",
        ["Missing Parameter"]
      );
    }
    try {
      const checkIfExist = await DataStore.conference.findById({
        _id: confrenceId,
      });
      if (!checkIfExist) {
        throw new ApiError(400, "Confrence does not exist", [
          "Confrence does not exist",
        ]);
      }
      const response = await DataStore.conference.findByIdAndUpdate(
        confrenceId,
        {
          title,
          fieldsAvailable,
          startDate,
          endDate,
          modeOfConference,
          description,
          conferenceStatus,
        },
        { new: true }
      );
      return new APIResponse(200, response);
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "An error occured", [error.message]);
    }
  }
  async deleteConfrence(payload) {
    const { confrenceId } = payload;
    if (!utils.isValidObjectId(confrenceId)) {
      throw new ApiError(400, "Invalid confrenceId", ["Invalid Parameter"]);
    }
    if (!confrenceId) {
      throw new ApiError(400, "confrenceId is required", ["Missing Parameter"]);
    }
    try {
      const checkIfExist = await DataStore.conference.findById({
        _id: confrenceId,
      });
      if (!checkIfExist) {
        throw new ApiError(400, "Confrence does not exist", [
          "Confrence does not exist",
        ]);
      }
      const response = await DataStore.conference.findByIdAndDelete(
        confrenceId
      );
      return new APIResponse(200, response);
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "An error occured", [error.message]);
    }
  }

  async verifyAllPresenter(payload) {
    const updatedresponse = payload.presenterId.map(async (record) => {
      try {
        await VerifyPresenter({
          presneterId: record.presenterId,
          isValid: true,
        });
        return { status: "success", presenterId: record.presenterId };
      } catch (error) {
        console.log(error);
        throw new ApiError(500, "An error occured", [error.message]);
      }
    });
    try {
      const result = await Promise.all(updatedresponse);
      return new APIResponse(200, result);
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "An error occured", [error.message]);
    }
  }
  async deletePresenter(payload) {
    const { presenterId } = payload;
    if (!utils.isValidObjectId(presenterId)) {
      throw new ApiError(400, "Invalid presenterId", ["Invalid Parameter"]);
    }
    if (!presenterId) {
      throw new ApiError(400, "presenterId is required", ["Missing Parameter"]);
    }
    try {
      const checkIfExist = await DataStore.presenter.findById({
        _id: presenterId,
      });
      if (!checkIfExist) {
        throw new ApiError(400, "Presenter does not exist", [
          "Presenter does not exist",
        ]);
      }
      const response = await DataStore.presenter.findByIdAndDelete({
        _id: presenterId,
      });
      return new APIResponse(200, response);
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "An error occured", [error.message]);
    }
  }
}

module.exports = Admin;
