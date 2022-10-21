let { getCreds } = require("./util/defines");
let {
  createMediaObject,
  getMediaObjectStatus,
  publishMedia,
  getContentPublishingLimit,
  sleep,
} = require("./util/insta_helper");
let { requestObj, responseObj } = require("./util/helper");

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

    let contentPublishingApiLimit = await getContentPublishingLimit(params);

    return responseObj(200, { resp: contentPublishingApiLimit });
  } catch (error) {
    console.log(error);
    return responseObj(500, error);
  }
};
