const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

const docClient = new AWS.DynamoDB.DocumentClient();

const express = require('express')
const app = express()
var newValue = -1

app.get('/', (req, res) => {
  docClient.get({
    "TableName": "counters",
    "Key": {
      "counterName": "importantCounter"
    },
    "ConsistentRead": true
  }, function (err, data) {
    if (err) console.log(err);
    else {
      const currentValue = data.Item.currentValue;
      newValue = currentValue + 1;
      docClient.update({
        "TableName": "counters",
        "ReturnValues": "UPDATED_NEW",
        "ExpressionAttributeValues": {
          ":a": currentValue,
          ":bb": newValue
        },
        "ExpressionAttributeNames": {
          "#currentValue": "currentValue"
        },
        "ConditionExpression": "(#currentValue = :a)",
        "UpdateExpression": "SET #currentValue = :bb",
        "Key": {
          "counterName": "importantCounter"
        }
      }, function (err, data) {
        if (err) console.log(err);
        else console.log(data);
      })
    }
  })
  res.send('Hello world from a Node.js app! Your cnt = ' + newValue)
})

app.listen(3000, () => {
    console.log('Server is up on 3000')
})


