const { error } = require('node:console');
const path = require('node:path');
const con = require(path.join(__dirname, "..", "models/mysql.js"));

function selectuser(users,name) {
    return new Promise(function ( resolve,reject) {
        con.query(`select * from ${name} where email='${users.email}'`, function (error, data) {
            if (error) {
                reject(error);
            }
            resolve(data);
        });
    });
}

function updateuser(id,name){
    return new Promise(function(resolve,reject){
        con.query(`update ${name} set isVerified=true where id=${id} and isActive=true`, function (error, data) {
            if (error) {
                reject(error);
            }
            resolve(data);
        });
    })
}
module.exports = { selectuser,updateuser}