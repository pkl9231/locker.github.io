/* var request = require("request");
var Promise = require('promise');
var moment = require('moment');
 */
module.exports = {
    getValidationString: function (errors = [], cb) {
        var errorString = "";
        for (var key in errors) {
            // skip loop if the property is from prototype
            if (!errors.hasOwnProperty(key)) continue;

            var obj = errors[key];
            for (var prop in obj) {
                // skip loop if the property is from prototype
                if (!obj.hasOwnProperty(prop)) continue;

                // your code
                errorString += obj[prop] + "\n";
            }
        }
        cb(errorString);
    },generalResponse: function (status, msg, data = {}, err = null, finalEr=null) {
        return {
                "status": status,
                "msg": msg,
                "data": data,
                "err": err,
                "err_detail":finalEr
            };
    },
    
    verificationToken :(req,res,next) =>{
        // Get Auth Header
        const bearerHeader = req.headers['authorization'];
        // check if not defined
        if(typeof bearerHeader !=='undefined'){
          const bearer = bearerHeader.split(' ');
          // Get token from array
          const barerToken = bearer[1];
          req.token = barerToken;
          // Next Middleware
          next();
        }else{
          // farbidden
           /*  var rError = this.generalResponse(401, "Token not valid!", [], '', '');
              res.status(401).send(rError); */
              var rError = {
                "status": 401,
                "msg": 'Token not valid!',
                "data": [],
                "err": '',
                "err_detail":''
            };
            res.status(401).send(rError);
        }
      }
}