/**
 * Gaurav Tiwari
 * 6376013956
 * Api response body is defined here
 */

class APIResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}

module.exports = APIResponse;
