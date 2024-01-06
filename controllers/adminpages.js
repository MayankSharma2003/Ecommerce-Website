const { error } = require('node:console');
const path = require('node:path');
const con = require(path.join(__dirname, "..", "models/mysql.js"));

function getseller(request, response) {
    con.query(`select * from sellers where isProved=false and isActive=true`, function (error, result) {
        if (error) throw error;
        response.status(200);
        response.send(JSON.stringify(result));
    });
}

function selleraccepted(request, response) {
    const id = request.body.id;
    con.query(`update sellers set isProved=true where id='${id}'`, function (error, results) { if (error) throw error; });
}

function sellerrejected(request, response) {
    const id = request.body.id;
    con.query(`update sellers set isActive=false where id='${id}'`, function (error, results) { if (error) throw error; });
}

function getproduct(request, response) {
    con.query(`select * from products where isProved=false and isActive=true`, function (error, result) {
        if (error) throw error;
        response.status(200);
        response.send(JSON.stringify(result));
    });
}

function productaccepted(request, response) {
    const id = request.body.id;
    con.query(`update products set isProved=true where id='${id}'`, function (error, results) { if (error) throw error; });
}

function productrejected(request, response) {
    const id = request.body.id;
    con.query(`update products set isActiVe=false where id='${id}'`, function (error, results) { if (error) throw error; });
}

function getallusers(request, response) {
    con.query(`SELECT * FROM users where isActive=true and isAdmin=false`, function (error,data) {
        if (error) throw error;
        response.status(200);
        response.json(data);
        });
}

function getallsellers(request, response) {
    con.query(`SELECT * FROM sellers where isActive=true and isVerified=true`, function (error, data) {
        if (error) throw error;
        response.status(200);
        response.json(data);
    });
}

module.exports = { getseller, selleraccepted, sellerrejected, getproduct, productaccepted, productrejected,getallusers , getallsellers}