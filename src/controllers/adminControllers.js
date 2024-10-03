const Admin = require("../class/Admin");

const admin = new Admin();

const listAllUsers = (req, res, next) => {
  const { confrenceId, type } = req.body;
  admin
    .listAllUsers({ confrenceId, type })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const verifyPresenter = (req, res, next) => {
  const { presneterId, isValid } = req.body;
  admin
    .VerifyPresenter({ presneterId, isValid })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const createConfrence = (req, res, next) => {
  const {
    title,
    fieldsAvailable,
    startDate,
    endDate,
    modeOfConference,
    description,
  } = req.body;
  admin
    .createConfrence({
      title,
      fieldsAvailable,
      startDate,
      endDate,
      modeOfConference,
      description,
    })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const updateConfrence = (req, res, next) => {
  const {
    confrenceId,
    title,
    fieldsAvailable,
    startDate,
    endDate,
    modeOfConference,
    description,
    conferenceStatus,
  } = req.body;
  admin
    .updateConfrence({
      confrenceId,
      title,
      fieldsAvailable,
      startDate,
      endDate,
      modeOfConference,
      description,
      conferenceStatus,
    })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const deleteConfrence = (req, res, next) => {
  const { confrenceId } = req.body;
  admin
    .deleteConfrence({ confrenceId })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};
const verifyAllPresenter = (req, res, next) => {
  admin
    .verifyAllPresenter(req.body)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const deletePresenter = (req, res, next) => {
  const { presenterId } = req.body;
  admin
    .deletePresenter({ presenterId })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  listAllUsers,
  verifyPresenter,
  createConfrence,
  updateConfrence,
  deleteConfrence,
  verifyAllPresenter,
  deletePresenter,
};
