const ApiError = require("./ApiError");
const dataValidation = (startDate, endDate) => {
  let obj = { issue: "", success: "false" };
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  const { startYear, startMonth, startDay } = startDate.split("-");
  const { endYear, endMonth, endDay } = endDate.split("-");
  if (startYear > currentYear || endYear > currentYear || startYear > endYear) {
    obj.issue = "Y";
  }
  if (startMonth > endMonth) {
    obj.issue = "M";
  }
  if (startDay > endDay && startMonth === endMonth) {
    obj.issue = "D";
  }
  obj.success = "true";
  return obj;
};

module.exports = dataValidation;
