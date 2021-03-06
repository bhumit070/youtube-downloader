const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const youtubedl = require('youtube-dl-exec');

app.use(bodyParser.json());
app.use(cors());
app.post('/url', (req, res) => {
  const { url } = req.body;
  youtubedl(url, {
    dumpJson: true,
    noWarnings: true,
    noCallHome: true,
    noCheckCertificate: true,
    preferFreeFormats: true,
    youtubeSkipDashManifest: true,
    referer: url,
  })
    .then((data) => {
      videoLinks = [];
      const thumbnail = data.thumbnail;
      const title = data.fulltitle;
      data.formats.map((format) => {
        const url = format.url;
        if (format.format.includes('p')) {
          format = format.format.split('(');
          format = format[format.length - 1].split(')');
          format = format[0];
          videoLinks.push({
            quality: format,
            url,
          });
        }
      });
      var obj = {};
      for (var i = 0, len = videoLinks.length; i < len; i++)
        obj[videoLinks[i]['quality']] = videoLinks[i];

      videoLinks = new Array();
      for (var key in obj) videoLinks.push(obj[key]);
      return res.json({
        thumbnail,
        title,
        videoLinks,
      });
    })
    .catch((error) => {
      return res.json({
        error: `Error is ${error}`,
        error: 'No Data Found',
      });
    });
});
app.listen(5000);
