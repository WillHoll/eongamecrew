require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const massive = require('massive');
const aws = require('aws-sdk');
const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET, S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = process.env;
const app = express()

// TOP LEVEL MIDDLEWARE
app.use(express.json());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

// auth endpoints



// AMAZON S3 BUCKET URL REQUEST

app.get('/api/signs3', (req, res) => {
  aws.config = {
    region: 'us-east-2',
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  };
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    return res.send(returnData)
  });
});

// MASSIVE DATATBASE CONNECTION
massive(CONNECTION_STRING).then(db => {
  app.set('db', db);
  app.listen(SERVER_PORT, () =>
    console.log(`${SERVER_PORT} bottles of beer on the wall`));
});