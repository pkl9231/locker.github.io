const wrap = require('../helper/wrapper');
const constants = require('../config/constants');

module.exports = {
    userAuth: async (req, res, next) => {
        let apiName = constants.API_ACCESS_URL + 'users/signin';
        try {
            // console.log(req.body);
            var apis = await wrap.wrapper(req, res, apiName);
        } catch (error) {
            res.render('error', { message: error.message });
        }
        let status = (apis[0]['statusCode'] == 200) ? true : false;
        console.log('hello new status = ' + apis[0]['statusCode']);
        if (status == true) {
            console.log("working ....", apis[0]['statusCode'])
            let apiResponse = JSON.parse(apis[0]['body']);
            console.log('apiResponse length', apiResponse);
            console.log('token', apiResponse.data.token.length)
            let token = apiResponse.data.token;
            try {
                if (!token.length) {
                    return res.redirect('/');    
                }
                next();
            } catch (error) {
                console.log(error);
                releaseEvents.redirect('/');
                return;
            }
        } else {
            console.log("not working", apis[0]['statusCode']);
            res.redirect('/');
            return;
        }
    }
}