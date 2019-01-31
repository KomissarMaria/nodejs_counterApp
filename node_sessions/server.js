const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
var uuid = require('uuid');
const docClient = new AWS.DynamoDB.DocumentClient();
const table = "node_sessions";
const express = require('express');
const app = express();

var newValue = -1

app.get('/', (req, res) => {

  var params = {
  TableName: table,
  Item: {
    'UUID': uuid.v1(),
    'DT': Date.now(),
    'TYPE': "new",
    'IP': "2.2.2.2",
    'ADD':"some text"
  }
  };

  docClient.put(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", JSON.stringify(data, null, 2));
    }
  })

  var params = {
    TableName: table,
    FilterExpression: "#type = :Value",
    ExpressionAttributeNames: {
      "#type":"TYPE"
    },
    ExpressionAttributeValues: {
      ":Value":"new"
    },
    Select:'COUNT'
  };

  docClient.scan(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      newValue = data.Count;
      console.log("Success", data.Count);
    }
  })

  res.send('Hello world from a Node.js app! Your cnt = ' + newValue)
})

app.listen(3000, () => {
    console.log('Server is up on 3000')
})


