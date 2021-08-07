const HttpClient = require("https");

const axios = require("axios").default;

const HttpError = require("../models/http-error");

const author_obj = {
  author: {
    name: `${process.env.AUTHOR_NAME}`,
    lastname: `${process.env.AUTHOR_LASTNAME}`,
  },
};

const searchItems = (req, res, next) => {
  const string = encodeURI(req.query.q);
  const options = {
    hostname: `${process.env.MELI_URL}`,
    port: 443,
    path: `/sites/MLA/search?q=${string}`,
    method: "GET",
  };
  HttpClient.get(options, (result) => {
    let data = "";
    result.on("data", (chunk) => (data += chunk));
    result.on("end", () => {
      res.json({
        statusCode: res.statusCode,
        message: "Success",
        body: { ...author_obj, ...JSON.parse(data) },
      });
    });
  }).on("error", (error) => {
    return next(new HttpError(error, 404));
  });
};

const getItemDescription = (req, res, next) => {
  const itemId = req.params.id;

  const one = `https://${process.env.MELI_URL}/items/${itemId}`;
  const two = `https://${process.env.MELI_URL}/items/${itemId}/description`;

  const req1 = axios.get(one);
  const req2 = axios.get(two);

  axios
    .all([req1, req2])
    .then((responses) => {
      let objResponse = {};
      responses.map((response) => {
        objResponse = { ...author_obj, ...objResponse, ...response.data };
      });
      res.json({
        statusCode: res.statusCode,
        message: "Success",
        body: objResponse,
      });
    })
    .catch((error) => {
      return next(new HttpError(error, 404));
    });
};

exports.searchItems = searchItems;
exports.getItemDescription = getItemDescription;
