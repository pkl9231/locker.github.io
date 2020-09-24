const client = require('../config/dataBaseConnection');
module.exports = {
    isUserValid : function(uname,pass){
        return new Promise(
             function (resolve, reject) {
                var q = client.query(
                    `select 
                        * 
                    from 
                        users 
                    where 
                    (email='${uname}' OR username='${uname}') and password='${pass}' `,
                    function (err, result) {
                        // client.end();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                )
            }
        )
    },
    userList : function(){
        return new Promise(
             function (resolve, reject) {
                var q = client.query(
                    `select 
                        * 
                    from 
                        users 
                    where 
                    0=0  ORDER BY id desc`,
                    function (err, result) {
                        // client.end();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                )
            }
        )
    },
    checkDuplicateEntryOfUser: (params={})=>{
        return new Promise(
            function (resolve, reject) {
               var q = client.query(
                   `select 
                       * 
                   from 
                       users 
                   where 
                        email='${params.email}'  ORDER BY id desc`,
                   function (err, result) {
                       // client.end();
                       if (err) {
                           reject(err);
                       } else {
                           resolve(result);
                       }
                   }
               )
           }
       )
    },
    insertUser : (params={}) =>{
        return new Promise(
            function (resolve, reject) {
                console.log();
               var q = client.query(
                `INSERT 
                        INTO
                    users 
                        (first_name,last_name,email,phone,username,password,type,added_on) 
                        VALUES
                        ('${params.first_name}','${params.last_name}','${params.email}','${params.phone}','${params.username}','${params.password}','${params.type}','${params.added_on}')`,
                   function (err, result) {
                       // client.end();
                       if (err) {
                           reject(err);
                       } else {
                           resolve(result);
                       }
                   }
               )
           }
       )
    }
}