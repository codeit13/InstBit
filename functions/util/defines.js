let axios = require("axios");

function getCreds(access_token, instagram_account_id) {
  const graph_domain = "https://graph.facebook.com/";
  const graph_version = "v15.0";

  return {
    access_token: access_token,
    graph_domain: graph_domain,
    graph_version: graph_version,
    endpoint_base: graph_domain + graph_version + "/",
    instagram_account_id: instagram_account_id,
  };
}

async function makeApiCall(url, payload, type) {
  let resp;

  if (type === "POST") {
    resp = await axios.post(url, payload);
  } else {
    const endpointParams = new URLSearchParams(payload);
    resp = await axios.get(url, endpointParams);
  }

  return {
    url: url,
    req: payload,
    resp: resp.data.content,
  };
}

module.exports = { getCreds, makeApiCall };
