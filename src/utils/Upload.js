/**
 * Gaurav Tiwari
 * 6376013956
 * File saving filtering logic is here
 */
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const paperDir = path.join(__dirname, "../../public/uploads/researchPaper");
const imgDir = path.join(__dirname, "../../public/uploads/profileImage");
const ApiError = require("../utils/ApiError");
const santize = require("sanitize-filename");

const setUpDirectory = () => {
  fs.access(paperDir, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdirSync(paperDir);
      console.log("Research paper directory created");
    } else {
      console.log("Research paper directory already exists");
    }
  });
  fs.access(imgDir, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdirSync(imgDir);
      console.log("Profile image directory created");
    } else {
      console.log("Profile image directory already exists");
    }
  });
};

const paperStore = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, paperDir);
  },
  filename: function (req, file, cb) {
    var filename = file.originalname.split(".")[0];
    filename = santize(filename);
    const finalFilename =
      filename + "_" + req.body.email + "_" + Date.now() + ".pdf";
    cb(null, finalFilename);
  },
});

const paperFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" &&
    file.originalname.split(".")[1] === "pdf"
  ) {
    cb(null, true);
  } else {
    cb(
      new ApiError(400, "Invalid file type", ["pdf files are required"]),
      false
    );
  }
};

const paperUpload = multer({
  storage: paperStore,
  limits: {
    fileSize: 1024 * 1024 * 10,
    files: 1,
  },
  fileFilter: paperFilter,
});

const imageStore = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imgDir);
  },
  filename: function (req, file, cb) {
    var tempfilename = file.originalname.split(".")[0];
    var extension = file.originalname.split(".")[1];
    tempfilename = santize(tempfilename);
    const finalFilename = tempfilename + "_" + Date.now() + "." + extension;
    cb(null, finalFilename);
  },
});

const imageFilter = (req, file, cb) => {
  const acceptedTypes = ["image/jpeg", "image/png", "image/jpg"];
  const acceptedExtensions = ["jpg", "png", "jpeg"];
  if (
    acceptedTypes.includes(file.mimetype) &&
    acceptedExtensions.includes(file.originalname.split(".")[1])
  ) {
    cb(null, true);
  } else {
    cb(
      new ApiError(400, "Invalid file type", [
        "Only JPG, PNG and JPEG files are allowed",
      ]),
      false
    );
  }
};

const imageUpload = multer({
  storage: imageStore,
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 1,
  },
  fileFilter: imageFilter,
});

module.exports = { setUpDirectory, paperUpload, imageUpload };
