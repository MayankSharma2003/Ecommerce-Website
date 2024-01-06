const path = require('node:path');
const con = require(path.join(__dirname, "..", "models/mysql.js"));
const mail = require(path.join(__dirname, "..", "utils/sendMail.js"));
const queries = require(path.join(__dirname, "..", "utils/queries.js"));

function sellersignup(request, response) {
    const seller = request.body; 
    if (seller.authorityname == "" || seller.email == "" || seller.password == "" || seller.userid == "" || seller.state == "" || seller.district == "" || seller.adderess=="") {
        response.status(400);
        response.send();
    }
    else {
        // con.query(`select * from sellers where email='${seller.email}'`, function (error, data) {
        //     if (error) throw error;
        queries.selectuser(seller,"sellers")
            .then(function (data) {
                if (data.length === 0) {
                    mail.sendMail([{ Email: seller.email, Name: seller.authorityname }],
                        "Seller Verification",
                        `<h2>Verify yourself by clicking the link....</h2>
                        <a href="http://127.0.0.1:8000/verifySellerEmail/${seller.id}">Click here..</a>`);
                    con.query(`insert into sellers values('${seller.email}','${seller.authorityname}', '${seller.district}', '${seller.state}', '${seller.userid}', '${seller.password}',0,1,0,'${seller.id}','${seller.adderess}')`,
                        function (error, data) {
                            if (error) throw error;
                            response.status(200);
                            response.send();
                        })
                }
                else {
                    response.status(400);
                    response.send();
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
}

function sellerlogin(request, response) {
    const seller = request.body;
    if (seller.email == "" || seller.password == "") {
        response.status(400);
        response.send();
    }
    queries.selectuser(seller,"sellers")
        .then(function (dataa) {
            console.log(dataa);
            let data = dataa.filter(function (d) {
                return d.password == seller.password && d.isActive == true && d.isVerified == false;
            })
            if (data.length != 0) {
                response.status(304);
                response.send();
            }
            else {
                findlogin(seller.email, request, function () {
                    if (seller.email == "" || seller.password == "") {
                        response.status(400);
                        response.send();
                    }
                    else {
                        request.session.selleremail = seller.email;
                        request.session.sellerpassword = seller.password;
                        queries.selectuser(seller,"sellers")
                            .then(function (dataa) {
                                let data = dataa.filter(function (d) {
                                    return d.password == seller.password && d.isProved == true && d.isVerified == true && d.isActive == true;
                                })
                                if (data.length != 0) {
                                    request.session.sellerid = data[0].id;
                                    request.session.IsSellerLoggedIn = true;
                                    response.status(200);
                                    response.send();
                                }
                                else {
                                    response.status(400);
                                    response.send();
                                }
                            })
                    }
                })
            }
        })

}
async function findlogin(email, request, callback) {
    await con.query(`select * from sellers where email='${email}' AND isActive=true;`, function (error, data) {
        if (data.length != 0) {
            request.session.authorityname = data[0].authorityname;
        }
        callback();
    })
}

function verifySellerEmail(request, response) {
    const { sellerId } = request.params;
    queries.updateuser(sellerId,"sellers")
    .then(function(data){
        response.redirect("../sellerlogin");
    })
    .catch(function(error){
        throw error;
    })
}

function sellerproducts(request,response){
    const product = request.body;
    const image = request.file;
    request.session.fileName = image.filename;
    product.fileName = image.filename;
    con.query(`insert into products values ('${product.productname}','${product.description}', '${product.price}', '${product.quantity}', '${product.fileName}', '${Date.now()}', true, false, '${request.session.sellerid}');`,function(error,result){
        if(error) throw error;
        response.redirect("/sellerproducts");
    })
}

function getauthorityname(request,response){
    const sellerid = request.query.sellerid;
    con.query(`select * from sellers where id='${sellerid}' and isActive=true`,function(error,result){
        if(error) throw error;
        response.send(JSON.stringify(result));
    })
}

function allproductsforseller(request,response){
    const sellerid = request.session.sellerid;
    con.query(`select * from products where sellerid='${sellerid}' and isActive=true and isProved=true`, function (error, result) {
        if (error) throw error;
        response.send(JSON.stringify(result));
    })
}

function update(request,response){
    const product = request.body;
    con.query(`update products set productname='${product.name}' where id='${product.id}'`, function (error, results) { if (error) { response.status(400), response.send() }; response.status(200), response.send() });
    con.query(`update products set description='${product.description}' where id='${product.id}'`, function (error, results) { if (error) { response.status(400), response.send() }; response.status(200), response.send() });
    con.query(`update products set price='${product.price}' where id='${product.id}'`, function (error, results) { if (error) { response.status(400), response.send() }; response.status(200), response.send() });
    con.query(`update products set quantity='${product.quantity}' where id='${product.id}'`, function (error, results) { if (error) { response.status(400), response.send() }; response.status(200), response.send() });
}

function deletee(request,response){
    const id = request.query.id;
    con.query(`update products set isActiVe=false where id='${id}'`, function (error, results) { if (error) {response.status(400),response.send()}; });
    con.query(`update carts set isActiVe=false where productid='${id}'`, function (error, results) { if (error) { response.status(400), response.send() };  });
    con.query(`update orders set isActiVe=false where productid='${id}'`, function (error, results) { if (error) { response.status(400), response.send() };  });
}

function productsforrequest(request, response) {
    const sellerid = request.session.sellerid;
    con.query(`select * from products where sellerid='${sellerid}'`, function (error, result) {
        if (error) throw error;
        response.send(JSON.stringify(result));
    })
}

function getproductsforreport(request,response){
    const sellerid = request.session.sellerid;
    const pattern = request.query.pattern;
    con.query(`select p.productname,p.price,sum(o.quantity) as quantity from products as p,orders as o  where o.sellerid=${sellerid} and  o.sellerid=p.sellerid and o.isActive=true and p.isActive=true and o.orderdate like '%${pattern}%' and o.productid=p.id  group by p.productname; `,function(error,result){
        if(error) throw error;
        // console.log(`select p.productname,p.price,sum(o.quantity) as quantity from products as p,orders as o  where o.sellerid=${sellerid} and  o.sellerid=p.sellerid and o.isActive=true and p.isActive=true and o.orderdate like '%${pattern}%' and o.productid=p.id  group by p.productname ;`);
        response.status(200);
        response.json(result);
    });
}

function distributorlogin(request,response){
    request.session.IsDistributorLoggedIn=true;
    response.send();
}

module.exports = { sellersignup, sellerlogin, verifySellerEmail, sellerproducts ,getauthorityname, allproductsforseller,update,deletee,productsforrequest,getproductsforreport,distributorlogin}