var request = require("request");
var url = require("url");
var fs = require("fs");

module.exports = {
    wrapper: async (req, res, _url, headers = {}) => {
        return new Promise(function (resolve, reject) {
            // console.log(req.body);
            // console.log(req.method);
            // req.method
            request(
                {
                    method: req.method,
                    headers: headers,
                    url: _url,
                    form: req.body,
                    qs: req.query,
                    timeout: req.timeout
                },
                function (error, response, body) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve([response]);
                    }
                }
            );
        });
    }
}