const Presenter = require("../class/Presenter");

const presenter = new Presenter();

const getPresenter = (req, res, next) => {
  const { userId } = req.params;
  presenter
    .getPresenter({ userId })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const getPresenterByConfrenceId = (req, res, next) => {
  const { confrenceId } = req.params;
  presenter
    .getPresenterByConfrenceId({ confrenceId })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const getPresenterByUserId = (req, res, next) => {
  const { userId } = req.params;
  presenter
    .getPresenterByUserId({ userId })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const getPresenterByConfrenceIdAndUserId = (req, res, next) => {
  const { confrenceId, userId } = req.params;
  presenter
    .getPresenterByConfrenceIdAndUserId({ confrenceId, userId })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const getPresenterByUserIdAndConfrenceId = (req, res, next) => {
  const { userId, confrenceId } = req.params;
  presenter
    .getPresenterByUserIdAndConfrenceId({ userId, confrenceId })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const getPresenterByConfrenceIdAndRole = (req, res, next) => {
  const { confrenceId, role } = req.params;
  presenter
    .getPresenterByConfrenceIdAndRole({ confrenceId, role })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const getPresenterByUserIdAndRole = (req, res, next) => {
  const { userId, role } = req.params;
  presenter
    .getPresenterByUserIdAndRole({ userId, role })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const getPresenterByConfrenceIdAndRoleAndUserId = (req, res, next) => {
  const { confrenceId, role, userId } = req.params;
  presenter
    .getPresenterByConfrenceIdAndRoleAndUserId({ confrenceId, role, userId })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const getPresenterByUserIdAndRoleAndConfrenceId = (req, res, next) => {
  const { userId, role, confrenceId } = req.params;
  presenter
    .getPresenterByUserIdAndRoleAndConfrenceId({ userId, role, confrenceId })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      next(error);
    });
};

const registerPresenter = (req, res, next) => {
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
    userRole,
    linkeldnUrl,
    securityQuestion,
  } = req.body;
  const profileImage = req.file?.path;
  presenter
    .registerPresenter({
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
      userRole,
      linkeldnUrl,
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
  getPresenter,
  getPresenterByConfrenceId,
  getPresenterByUserId,
  getPresenterByConfrenceIdAndUserId,
  getPresenterByUserIdAndConfrenceId,
  getPresenterByConfrenceIdAndRole,
  getPresenterByUserIdAndRole,
  getPresenterByConfrenceIdAndRoleAndUserId,
  getPresenterByUserIdAndRoleAndConfrenceId,
  registerPresenter,
};
