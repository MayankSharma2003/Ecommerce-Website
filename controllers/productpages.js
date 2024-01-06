const path = require('node:path');
const con = require(path.join(__dirname, "..", "models/mysql.js"));
function ecomproduct(request, response) {
    lim=0;
    if (request.session.IsLoggedIn === true) {

        // response.status(409);
        response.render("ecomproduct", { Username: request.session.Username });
        request.session.Username = "";
    }
    else {
        response.render("ecomproduct", { Username: null });
    }
}

var lim = 0;
function allproducts(request, response) {
    let items = request.body.items;
    let page = request.body.page;
    if(page==1){
        lim=0;
    }
    else{
        lim = (page-1)*items;
    }
    con.query(`select * from products where isActive=true and isProved=true order by productname limit ${items} offset ${lim}`,function(error,data){
        if(error) throw error;
        response.send(JSON.stringify(data));
        lim += items;
        // console.log(lim);
    })
}

function getproductforhome(request, response) {
    let id = request.query.id;
    con.query(`select * from products where id=${id}`, function (error, result) {
        if (error) throw error;
        response.status(200);
        response.send(JSON.stringify(result));
    });
}

async function getcountofproducts(request,response){
    await con.query(`select count(id) as count from products where isActive=true`,(error,data)=>{
        response.status(200);
        response.json(data);
    })
}

module.exports = {ecomproduct,allproducts,getproductforhome,getcountofproducts}