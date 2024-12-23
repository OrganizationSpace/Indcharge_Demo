const SlackNotify = require("slack-notify");
const slackurl = SlackNotify(
  "https://hooks.slack.com/services/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"
);
const slacklog = function (req, res, next) {
  var json = res.json;

  var t = false;
  res.json = function (obj) {
    function loging(obj) {
      if (req && req.headers.authorization) {
        t = true;
      }
 slackurl.alert({
        text:
          req.method +
          "   " +
          "(" +
          res.statusCode +
          ")" +
          " " +
          " " +
          process.env.DEV +
          req.route.path +
          "   " +
          "Token : " +
          "`" +
          JSON.stringify(t) +
          "`",
        attachments: [
          {
            fallback: "Required Fallback String",
            fields: [
              {
                title: "REQ",
                value: "`" + JSON.stringify(req.headers) + "`" ?? "",
                short: true,
              },
              {
                title: "RES",
                value: "`" + JSON.stringify(obj.headers) + "`" ?? "",
                short: true,
              },
            ],
          },
        ],
      });
    }
    loging(obj);

    json.call(this, obj);
  };
  next();
};

module.exports = slacklog;
