const path = require('node:path');
const con = require(path.join(__dirname, "..", "models/mysql.js"));

async function ecomcart(request, response) {
    if (request.session.IsLoggedIn) {
        let store = [];
        await con.query(`select * from carts where userid=${request.session.userid} and isActive=true`,function(error,data){
                if(error) throw error;
                if (data.length == 0) {
                    response.render("ecomcart", { store: null });
                    return;
                }
                let arr = [];
                for (let i = 0; i < data.length; i++) {
                    arr.push(
                        new Promise((resolve, reject) => {
                            con.query(`select * from products where id=${data[i].productid} and isActive=true`,function(error,data1){
                                    if(error) throw error;
                                    data1[0].quantity = data[i].quantity;
                                    resolve(data1[0]);
                                })
                        })
                    )
                }
                Promise.all(arr).then((values) => {
                    // console.log(values);
                    response.render("ecomcart", { store: values });
                    return;
                })
            })
    }
    else {
        response.redirect("/ecomlogin");
    }
}

async function increement(request, response) {
    const userid = request.session.userid;
    const pid = request.query.id;
    var temp;

    await con.query(`select quantity from products where id=${pid} and isActive=true`,function(error,data){
        if(error) throw error;
        temp=data[0].quantity;
    })
    await con.query(`select * from carts where userid=${userid} and productid=${pid} and isActive=true`,function(error,data){
        if (error) throw error;
                    if (data[0].quantity >= temp) {
                        response.status(400);
                        response.send();
                    }
                    else {
                        con.query(`update carts set quantity = ${data[0].quantity + 1} where  userid=${userid} and productid=${pid}`, function (error, data) {
                            if(error) throw error;
                            response.status(200);
                            response.send();
                        });
                    }
            })
}

function decreement(request, response) {
    const userid = request.session.userid;
    const pid = request.query.id;
    var newQuantity;

    // console.log(userid, pid);
    // CartModel.find({ userid: userid, isActive: true })
    //     .then(data => {
    //         const filterdata = data[0].products.filter(function (d) {
    //             if (Number(d.productid) !== Number(pid)) {
    //                 return d.productid !== pid;
    //             }
    //             else {
    //                 if (d.quantity < 2) {
    //                     response.status(400);
    //                     response.send();
    //                 }
    //                 else {
    //                     d.quantity = d.quantity - 1;
    //                     return d;
    //                 }
    //             }
    //         })
    //         console.log(filterdata);
    //         CartModel.findOneAndUpdate({ userid: userid, isActive: true }, { products: filterdata }).then(() => { response.status(200); response.send(); }).catch((error) => { response.status(400); response.send(); })

    //     })
    con.query(`select * from carts where userid=${userid} and productid=${pid} and isActive=true`, function (error, data) {
        if (error) throw error;
        if (data[0].quantity < 2) {
            response.status(400);
            response.send();
        }
        else {
            con.query(`update carts set quantity = ${data[0].quantity - 1} where  userid=${userid} and productid=${pid} and isActive=true`, function (error, data) {
                if (error) throw error;
                response.status(200);
                response.send();
            });
        }
    })
}

function addtocart(request, response) {
    if (request.session.IsLoggedIn != true) {
        response.status(400);
        response.send();
    }
    else {
        const productid = request.query.productid;
        // ProductModel.find({ id: productid, isActive: true })
        //     .then(data1 => {
        // CartModel.find({ userid: request.session.userid, isActive: true })
        //     .then(data2 => 
        con.query(`select * from carts where userid=${request.session.userid} and isActive=true`,function(error,data2){
                if(error) throw error;
                if (data2.length == 0) {
                    // const object = { userid: request.session.userid, products: [{ productid: productid, quantity: 1 }], isActive: true };
                    // CartModel.create(object);
                    con.query(`insert into carts values(${request.session.userid},${productid},${1},true)`,function(error,data){if(error) throw error;});
                }
                else {
                    const filtered = data2.filter(function (p) {
                        return Number(p.productid) === Number(productid);
                    });
                    console.log(filtered);
                    if (filtered.length != 0) {
                        return;
                    }
                    else {
                        // const object = { productid: productid, quantity: 1 };
                        // data2[0].products.push(object);
                        // CartModel.findOneAndUpdate({ userid: request.session.userid, isActive: true }, { products: data2[0].products }).then(() => { response.status(200); response.send(); }).catch((error) => { response.status(400); response.send(); });
                        con.query(`insert into carts values(${request.session.userid},${productid},${1},true)`, function (error, data) { if (error) throw error; });
                    }
                }

            })
        // })
    }
    // const query = {};
    // const sort = { 10: -1 };
    // const limit = 5;
    // const cursor = ProductModel.find(query).sort(sort).limit(limit)
    // .then(data=>{
    //     console.log(data);
    // })
}

function getcartproducts(request, response) {
    CartModel.find({ userid: request.session.userid, isActive: true })
        .then(data => {
            // console.log(data);
            response.send(JSON.stringify(data));
        })
        .catch(error => {
            console.log("Error in get cartproducts ", error);
        })
}

function deleteCartProduct(request, response) {
    const id = request.query.id;
    con.query(`update carts set isActive=false where productid=${id}`,function(error,data){});
}

module.exports = { ecomcart, increement, decreement, addtocart, getcartproducts, deleteCartProduct}