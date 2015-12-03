var config = {
  //REDISURL: getEnv('REDISURL'),
  //PORT: getEnv('PORT'),
  //FBID: getEnv('FBID'),
  //FBIDSECRET: getEnv('FBIDSECRET')
};

conf = {
    port: 3000,
    debug: false,
    dbPort: 6379,
    dbHost: '127.0.0.1',
    dbOptions: {}
};

function getEnv(variable){
  if (process.env[variable] === undefined){
    throw new Error('You must create an environment variable for ' + variable);
  }
  return process.env[variable];
};

module.exports = config;