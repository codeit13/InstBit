let { getCreds } = require("./util/defines");
let { createMediaObject } = require("./util/insta_helper");
let { responseObj } = require("./util/helper");

exports.handler = async (event, context) => {
  var body = JSON.parse(event.body);
  let access_token = body.access_token;
  let instagram_account_id = body.instagram_account_id;
  let postFile = body.postFile;
  let caption = body.caption;
  try {
    let params = getCreds(access_token, instagram_account_id);
    params["media_type"] = "IMAGE";
    params["media_url"] = postFile[0].url;
    params["caption"] += caption;
    console.log("PARAMS :::: ", params);

    //   2
    let imageMediaObjectResponse = await createMediaObject(params);
    let imageMediaObjectId = imageMediaObjectResponse["json_data"]["id"];

    return responseObj(200, { resp: imageMediaObjectId });
  } catch (error) {
    console.log(error);
    return responseObj(500, error);
  }
};
