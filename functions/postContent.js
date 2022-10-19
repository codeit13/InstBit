const multer = require("multer");
const upload = multer({ dest: "uploads/" });

let { getCreds } = require("./util/defines");
let {
  createMediaObject,
  getMediaObjectStatus,
  publishMedia,
  getContentPublishingLimit,
  sleep,
} = require("./util/insta_helper");
let { requestObj, responseObj } = require("./util/helper");

function parseMultipartForm(event) {
  return new Promise((resolve) => {
    // we'll store all form fields inside of this
    const fields = {};

    // let's instantiate our busboy instance!
    const busboy = Busboy({
      // it uses request headers
      // to extract the form boundary value (the ----WebKitFormBoundary thing)
      headers: event.headers,
    });

    // before parsing anything, we need to set up some handlers.
    // whenever busboy comes across a file ...
    busboy.on(
      "file",
      (fieldname, filestream, filename, transferEncoding, mimeType) => {
        // ... we take a look at the file's data ...
        filestream.on("data", (data) => {
          // ... and write the file's name, type and content into `fields`.
          fields[fieldname] = {
            filename,
            type: mimeType,
            content: data,
          };
        });
      }
    );

    // whenever busboy comes across a normal field ...
    busboy.on("field", (fieldName, value) => {
      // ... we write its value into `fields`.
      fields[fieldName] = value;
    });

    // once busboy is finished, we resolve the promise with the resulted fields.
    busboy.on("finish", () => {
      resolve(fields);
    });

    // now that all handlers are set up, we can finally start processing our request!
    busboy.write(event.body);
  });
}

exports.handler = async (event, context) => {
  console.log("1");
  console.log("EVENT.BODY ::::::::: ", event.body);
  const data = await parseMultipartForm(event);
  console.log("2");
  let access_token = data.access_token;
  let instagram_account_id = data.instagram_account_id;
  let caption = data.caption;
  console.log(data);
  console.log("3");
  try {
    // 1
    console.log("4");
    let params = getCreds(access_token, instagram_account_id);
    console.log("5");
    params["media_type"] = "IMAGE";
    params["media_url"] =
      "https://justinstolpe.com/sandbox/ig_publish_content_img.png";
    params["caption"] += caption;
    console.log("6");
    console.log("PARAMS :::: ", params);
    console.log("7");

    return responseObj(200, params);

    // //   2
    // let imageMediaObjectResponse = createMediaObject(params);
    // let imageMediaObjectId = imageMediaObjectResponse["json_data"]["id"];
    // let imageMediaStatusCode = "IN_PROGRESS";

    // // 3
    // while (imageMediaStatusCode !== "FINISHED") {
    //   let imageMediaObjectStatusResponse = getMediaObjectStatus(
    //     imageMediaObjectId,
    //     params
    //   );
    //   imageMediaStatusCode =
    //     imageMediaObjectStatusResponse["json_data"]["status_code"];

    //   console.log("\n---- IMAGE MEDIA OBJECT STATUS -----\n");
    //   console.log("\tStatus Code:");
    //   console.log("\t" + imageMediaStatusCode);

    //   sleep(5);
    // }

    // // 4
    // let publishImageResponse = publishMedia(imageMediaObjectId, params);
    // console.log("\n---- PUBLISHED IMAGE RESPONSE -----\n");
    // console.log("\tResponse:");
    // console.log(publishImageResponse["resp"]);

    // // 5
    // let contentPublishingApiLimit = getContentPublishingLimit(params);
    // console.log("\n---- CONTENT PUBLISHING USER API LIMIT -----\n");
    // console.log("\tResponse:");
    // console.log(contentPublishingApiLimit["resp"]);
  } catch (error) {
    console.log(error);
    return responseObj(500, error);
  }
};
