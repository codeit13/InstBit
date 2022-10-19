let { makeApiCall } = require("./defines");

function sleep(s) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

function createMediaObject(params) {
  let url = params.endpoint_base + params.instagram_account_id + "/media";
  let payLoad = {
    caption: params.caption,
    access_token: params.access_token,
  };

  if (params.media_type === "IMAGE") {
    payLoad["image_url"] = params.media_url;
  } else {
    payLoad["media_type"] = params.media_type;
    payLoad["video_url"] = params.media_url;
  }

  return makeApiCall(url, payLoad, "POST");
}

function getMediaObjectStatus(mediaObjectId, params) {
  let url = params.endpoint_base + "/" + mediaObjectId;

  let payLoad = {
    fields: "status_code",
    access_token: params.access_token,
  };

  return makeApiCall(url, payLoad, "GET");
}

function publishMedia(mediaObjectId, params) {
  let url =
    params.endpoint_base + params.instagram_account_id + "/media_publish";

  let payLoad = {
    creation_id: mediaObjectId,
    access_token: params.access_token,
  };

  return makeApiCall(url, payLoad, "POST");
}

function getContentPublishingLimit(params) {
  let url =
    params["endpoint_base"] +
    params["instagram_account_id"] +
    "/content_publishing_limit";
  let payLoad = {
    fields: "config,quota_usage",
    access_token: params.access_token,
  };

  return makeApiCall(url, payLoad, "GET");
}

module.exports = {
  createMediaObject: createMediaObject,
  getMediaObjectStatus: getMediaObjectStatus,
  publishMedia: publishMedia,
  getContentPublishingLimit: getContentPublishingLimit,
  sleep: sleep,
};
