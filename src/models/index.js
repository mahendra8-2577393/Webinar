//viewer schema is for audience, presenter schema is for presenters, admin schema is for admins,
// userRelation schema is to have details of the confrence our audience signed for
// presenterRelation schema is to have details of the presenters in the conference paper url and stream of paper
// verifyPresenter schema is to have details of the presenters who have validated their account
// confrence schema is to have details of the conference
const {
  Audience,
  presenter,
  userRelation,
  presenterRelation,
  admin,
} = require("./User");
const conference = require("./confrenceSchema");
module.exports = {
  Audience,
  presenter,
  userRelation,
  presenterRelation,
  admin,
  conference,
};
