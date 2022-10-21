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
    console.log("PARAMS :::: ", params);

    //   2
    let imageMediaObjectResponse = createMediaObject(params);
    let imageMediaObjectId = imageMediaObjectResponse["json_data"]["id"];
    let imageMediaStatusCode = "IN_PROGRESS";

    // 3
    while (imageMediaStatusCode !== "FINISHED") {
      let imageMediaObjectStatusResponse = getMediaObjectStatus(
        imageMediaObjectId,
        params
      );
      imageMediaStatusCode =
        imageMediaObjectStatusResponse["json_data"]["status_code"];

      console.log("\n---- IMAGE MEDIA OBJECT STATUS -----\n");
      console.log("\tStatus Code:");
      console.log("\t" + imageMediaStatusCode);

      sleep(5);
    }

    // 4
    let publishImageResponse = publishMedia(imageMediaObjectId, params);
    console.log("\n---- PUBLISHED IMAGE RESPONSE -----\n");
    console.log("\tResponse:");
    console.log(publishImageResponse["resp"]);

    // 5
    let contentPublishingApiLimit = getContentPublishingLimit(params);
    console.log("\n---- CONTENT PUBLISHING USER API LIMIT -----\n");
    console.log("\tResponse:");
    console.log(contentPublishingApiLimit["resp"]);

    return responseObj(200, { params: params });
  } catch (error) {
    console.log(error);
    return responseObj(500, error);
  }
};
