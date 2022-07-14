require('dotenv').config();

var config = {}

config.endpoint = 'https://horus-heresy.documents.azure.com:443/'
config.key = process.env.DB_KEY

config.database = {
    id: 'horus-heresy'
}
  
config.container = {
    id: 'special-rules'
}

module.exports = config