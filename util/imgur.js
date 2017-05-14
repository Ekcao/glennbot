const Promise = require('bluebird');
const https = require('https');


function randomSubredditImage(subReddit) {
  if (subReddit.length === 0) return Promise.resolve('Include a subreddit.');
  const options = {
    host: 'api.imgur.com',
    path: `/3/gallery/r/${subReddit}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Client-ID 6f00c92bf0e6fb8',
    },
  };
  return new Promise((resolve, reject) => {
    let images = '';
    const req = https.request(options, (res) => {
      res.on('data', (data) => {
        images += data;
      });
    });
    req.on('close', () => {
      const imageResult = JSON.parse(images);
      if (imageResult.data.length === 0) return (resolve(`${subReddit} subreddit doesnt exist or its inactive.`));
      const rand = Math.floor(Math.random() * imageResult.data.length);
      const image = imageResult.data[rand];
      if (image) {
        let imageLink = '';
        if (image.animated && image.type === 'image/gif') {
          imageLink = image.gifv;
        } else if (image.link) {
          imageLink = image.link;
//          console.log (imageLink)
        }
        const title = image.title ? image.title : '';
        resolve(`${imageLink} ${title}`);
      } else {
        return (resolve('Imgur API appears to be temporary unavailable. :thinking:'));
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.end();
  });
}

module.exports = {
  imgur: randomSubredditImage,
  subreddit: randomSubredditImage,
};
