const fs = require('fs');
const https = require('https');

const url = 'https://github.com/yarnpkg/yarn/releases/download/v1.22.22/yarn-1.22.22.js';
const file = fs.createWriteStream('yarn.js');

console.log('Downloading yarn...');
https.get(url, function(response) {
  if (response.statusCode === 302 || response.statusCode === 301) {
    // Handle redirect
    https.get(response.headers.location, function(redirectResponse) {
      redirectResponse.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Download completed! yarn.js created.');
      });
    });
  } else {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Download completed! yarn.js created.');
    });
  }
}).on('error', function(err) {
  fs.unlink('yarn.js', () => {});
  console.error('Error downloading:', err.message);
});
