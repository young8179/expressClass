function radLogger(req, res, next) {
    console.log('SWEET REQUEST BRO:');
    console.log(`New ${req.method} request at ${req.originalUrl}`);
    console.log('Req Query: ', req.query);
    next();
  }
  
  module.exports = radLogger;