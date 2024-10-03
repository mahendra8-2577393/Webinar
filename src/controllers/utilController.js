const Utils = require("../class/Utils");

const utils = new Utils();

const getAllConfrences = (req, res, next) => {
  utils
    .getAllConfrences()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const getConfrencesId = (req, res, next) => {
  const { confrenceId } = req.params;
  utils
    .getConfrencesId({ confrenceId })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const getConfrenceByUserId = (req, res, next) => {
  const { userId, role } = req.params;
  utils
    .getConfrenceByUserId({ userId, role })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const filterConfrences = (req, res, next) => {
  const { modeOfConference, conferenceStatus } = req.body;
  utils
    .filterConfrences({ modeOfConference, conferenceStatus })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const searchConfrences = (req, res, next) => {
  const { searchText } = req.params;
  utils
    .searchConfrences({ searchText })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  getAllConfrences,
  getConfrencesId,
  getConfrenceByUserId,
  filterConfrences,
  searchConfrences,
};
