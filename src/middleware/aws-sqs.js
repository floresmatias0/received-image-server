// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region we will be using
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
// Create SQS service client
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

module.exports = { sqs }