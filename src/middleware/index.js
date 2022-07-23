// eslint-disable-next-line no-unused-vars
const route = '/api/images_backend_v2/uploads';
const { sqs } = require('./aws-sqs');
const { fetchImage } = require('./helpers');

module.exports = function (app) {

  app.use(route, (req, res, next) => {
    if(req.method === 'POST') {
      const queueUrl = 
          `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/${process.env.AWS_QUEUE_NAME}`;
      const paramsAWS = {
          QueueUrl: queueUrl,
          MaxNumberOfMessages: 1,
          VisibilityTimeout: 0,
          WaitTimeSeconds: 0
      };
      sqs.receiveMessage(paramsAWS, async (err, data) => {
        if (err) {
            console.log(err, err.stack);
        } else {
            if (!data.Messages) {
                req.body = {
                  err: "Nothing to process"
                }
                next();
            }
            const orderData = JSON.parse(data.Messages[0].Body);
            const { image_url } = orderData;
            const filename = await fetchImage(image_url);
            req.body = {
              xl: `${filename}_xl`,
              lg: `${filename}_lg`,
              md: `${filename}_md`,
              sm: `${filename}_sm`,
              thumbnail: `${filename}_thumbnail`,
              original: `${filename}`
            };
            const deleteParams = {
              QueueUrl: queueUrl,
              ReceiptHandle: data.Messages[0].ReceiptHandle
            };
            sqs.deleteMessage(deleteParams, (err, data) => {
              if (err) {
                console.log(err, err.stack);
              } else {
                console.log('Successfully deleted message from queue');
              }
            });
            next();
          }
      });
          
    }
  });
}
