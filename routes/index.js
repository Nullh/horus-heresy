var express = require('express');
var router = express.Router();

const CosmosClient = require('@azure/cosmos').CosmosClient
const config = require('./config')
const url = require('url');
const { ConflictResolutionMode } = require('@azure/cosmos');

const endpoint = config.endpoint
const key = config.key

const databaseId = config.database.id
const containerId = config.container.id
const partitionKey = { kind: 'Hash', paths: ['/partitionKey'] }

const options = {
  endpoint: endpoint,
  key: key,
  userAgentSuffix: 'CosmosDBJavascriptQuickstart'
};

const client = new CosmosClient(options)

async function queryContainer() {
  console.log(`Querying container:\n${config.container.id}`)

  // query to return all children in a family
  // Including the partition key value of country in the WHERE filter results in a more efficient query
  const querySpec = {
    query: 'SELECT r.id, r.name, r.flavour, r.text, r.source FROM root r ORDER BY r.name',
  }

  const { resources: results } = await client
    .database(databaseId)
    .container(containerId)
    .items.query(querySpec)
    .fetchAll()
  return results;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  queryContainer()
    .then(ok => {
      console.log(`Returned from query`);
    
      /*var parsedContent = '';
      var colourFlip = true
      ok.forEach(rule => {
          var bgColour = colourFlip ? "Gainsboro" : "DarkGrey"
          parsedContent += `<button type="button" class="collapsible" style="background-color:${bgColour}">${rule.name}</button>\n<div class="content">\n<p class="flavour">${rule.flavour}</p>\n<div class="rule-text">${rule.text}</div><p class="source">${rule.source}</p></div>\n`;
          colourFlip = !colourFlip
      });
      res.render('index', { dump: parsedContent });
      */
      res.render('index', { rules: ok });
    })
  //console.log(`\tQuery returned ${queryResult}\n`)
  
});

module.exports = router;
