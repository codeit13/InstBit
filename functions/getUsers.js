const { responseObj } = require("./util/helper");
const { q, clientQuery } = require("./util/connection");

exports.handler = async (event, context) => {
  try {
    let avengers = await clientQuery.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("users"))),
        q.Lambda((x) => q.Get(x))
      )
    );
    return responseObj(200, avengers);
  } catch (error) {
    console.log(error);
    return responseObj(500, error);
  }
};
