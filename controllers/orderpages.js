const { now } = require('mongoose');
const path = require('node:path');
const con = require(path.join(__dirname, "..", "models/mysql.js"));

function orderedproducts(request, response) {
    var arr=[];
    con.query(`select * from orders `,function(error,data){
        if (error) throw error;
        for (let d = 0; d < data.length; d++) {
            con.query(`select * from products where id=${data[d].productid} and isActive=true;`,function(error,data1){

                if (error) throw error;

                let object = { 
                    productname : data1[0].productname,
                    price : data1[0].price,
                    fileName : data1[0].fileName,
                    orderid : data[d].orderid,
                    quantity: data[d].quantity,
                    orderdate : data[d].orderdate,
                    accepted : data[d].accepted,
                    packed : data[d].packed,
                    shipped : data[d].shipped,
                    deliverd : data[d].deliverd,
                    isActive : data[d].isActive
                }
                arr.push(object);

                if (d == data.length - 1) {
                    // console.log(arr);
                    response.status(200);
                    response.json(arr);
                }

            })
        }
    })
}

function orderedproductsforseller(request, response) {
    var arr = [];
    con.query(`select * from orders where sellerid=${request.session.sellerid} and isActive=true`, function (error, data) {
        // console.log(request.session.sellerid);
        if (error) throw error;
        for (let d = 0; d < data.length; d++) {
            con.query(`select * from products where id=${data[d].productid} ;`, function (error, data1) {

                if (error) throw error;

                let object = {
                    productname: data1[0].productname,
                    price: data1[0].price,
                    fileName: data1[0].fileName,
                    orderid: data[d].orderid,
                    quantity: data[d].quantity,
                    orderdate: data[d].orderdate,
                    accepted: data[d].accepted,
                    packed: data[d].packed,
                    shipped: data[d].shipped,
                    deliverd: data[d].deliverd,
                }
                arr.push(object);

                if (d == data.length - 1) {
                    // console.log(arr);
                    response.status(200);
                    response.json(arr);
                }

            })
        }
    })
}

async function orderdetails(request,response){
    const body  =  request.body;
    var arr=[];
    await con.query(`select * from carts where userid=${request.session.userid} and isActive=true`,function(error,data){
        for(let d=0;d<data.length;d++){
            console.log(data[d].productid);
            con.query(`select * from products where id=${data[d].productid}`,function(error,data1){
                if (data1[0].quantity - data[d].quantity>0){
                    con.query(`update products set quantity=${data1[0].quantity - data[d].quantity} where id=${data[d].productid}`);
                    con.query(`insert into orders values (${request.session.userid},${data[d].productid},${data1[0].sellerid},'${body.dadderess}','${body.mobilenumber}','${body.method}',${data[d].quantity},1,0,0,0,'${now()}',${Date.now()},1)`);
                    let object = { userid: request.session.userid, productid: data[d].productid, sellerid: data1[0].sellerid, dadderess: body.dadderess, mobilenumber: body.mobilenumber, method: body.method, quantity: data[d].quantity,price: data1[0].price,productname: data1[0].productname,inStock : 1 }
                    arr.push(object);
                    con.query(`update carts set isActive=false where userid=${request.session.userid}`, function (error, dataa) {
                        if (error) throw error;
                        if (d == data.length - 1) {
                            // console.log(arr);
                            response.status(200);
                            response.json(arr);
                        }
                    });
                }     
                else{
                    let object = {  productid: data[d].productid, inStock: 0 }
                    arr.push(object);
                    if (d == data.length - 1) {
                        // console.log(arr);
                        response.status(200);
                        response.json(arr);
                    }
                }      
            })
        }
    })
}

function updatetrack(request,response){
    const body  =  request.body;
    con.query(`update orders set ${body.column}=1 where orderid=${body.orderid}`,function(error,data){
        if(error) throw error;
        response.status(200);
        response.send();
    })
}

function cancelorder(request,response){
    const body = request.body;
    con.query(`select * from orders where orderid=${body.orderid}`,function(error,data){
        if(error) throw error;
        con.query(`update orders set isActive=false where orderid=${body.orderid}`);
        con.query(`select * from products where id=${data[0].productid} and isActive=true`,function(error,result){
            let temp = body.quantity + result[0].quantity;
            con.query(`update products set quantity=${temp} where id=${data[0].productid}`);
        })
    })
}

function orderedproductsfordistributor(request, response) {
    var arr = [];
    con.query(`select * from orders where isActive=true and shipped=1 and deliverd=0`, function (error, data) {
        // console.log(request.session.sellerid);
        if (error) throw error;
        for (let d = 0; d < data.length; d++) {
            con.query(`select * from products where id=${data[d].productid} ;`, function (error, data1) {

                if (error) throw error;

                let object = {
                    productname: data1[0].productname,
                    price: data1[0].price,
                    fileName: data1[0].fileName,
                    orderid: data[d].orderid,
                    quantity: data[d].quantity,
                    orderdate: data[d].orderdate,
                    accepted: data[d].accepted,
                    packed: data[d].packed,
                    shipped: data[d].shipped,
                    deliverd: data[d].deliverd,
                }
                arr.push(object);

                if (d == data.length - 1) {
                    // console.log(arr);
                    response.status(200);
                    response.json(arr);
                }

            })
        }
    })
}

module.exports= {orderedproducts,orderdetails,orderedproductsforseller,updatetrack,cancelorder,orderedproductsfordistributor}