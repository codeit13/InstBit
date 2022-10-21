let { getCreds, makeApiCall } = require("./util/defines");
let { responseObj } = require("./util/helper");

exports.handler = async (event, context) => {
  var body = JSON.parse(event.body);
  let access_token = body.access_token;
  let instagram_account_id = body.instagram_account_id;
  let redirect_uri = body.redirect_uri;

  let endpointParams = {
    grant_type: "fb_exchange_token",
    client_id: process.env.REACT_APP_FACEBOOK_CLIENT_ID,
    client_secret: process.env.REACT_APP_FACEBOOK_CLIENT_SECRET,
    redirect_uri: redirect_uri,
    fb_exchange_token: access_token,
  };

  try {
    let params = getCreds(access_token, instagram_account_id);
    params["debug"] = "yes";

    let url = params.endpoint_base + "oauth/access_token";

    const data = await makeApiCall(url, endpointParams);

    return responseObj(200, {
      resp: data,
    });
  } catch (error) {
    console.log(error);
    return responseObj(500, error);
  }
};
