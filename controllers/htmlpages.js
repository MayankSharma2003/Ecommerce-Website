const path = require('node:path');

function homepage(request, response) {
    response.sendFile(path.join(__dirname,"..","public/ecomhome.html"))
}

function ecomlogin(request, response) {
    if (request.session.IsLoggedIn) {
        response.redirect('/ecomproduct');
        return;
    }
    response.sendFile(path.join(__dirname, "..", "public/ecomlogin.html"));
}

function ecomlogout(request, response) {
    request.session.IsLoggedIn = false;
    response.redirect("ecomlogin");
}

function ecomsignup(request, response) {
    response.sendFile(path.join(__dirname, "..", "public/ecomsignup.html"));
}

function ecomforgot(request, response) {
    response.sendFile(path.join(__dirname, "..", "public/ecomforgot.html"));
}

function resetpassword(request, response) {
    
   
        response.render("resetpassword");

}

function ecomadmin(request, response) {
    if (request.session.IsAdminLoggedIn) {
        response.sendFile(path.join(__dirname, "..", "public/ecomadmin.html"));        
        return;
    }
    else if (request.session.IsSellerLoggedIn){
        response.redirect("/sellerproducts");
    }
    else
        response.redirect('/ecomproduct');
    return;
}

function sellerlogin(request, response) {
    if (request.session.IsSellerLoggedIn) {
        response.render("sellerproducts", { authorityname: request.session.authorityname });
        request.session.authorityname = "";
    }
    else if (request.session.IsDistributorLoggedIn) {
            response.sendFile(path.join(__dirname, "..", "public/distributor.html"));
    }
    else
        response.sendFile(path.join(__dirname, "..", "public/sellerlogin.html"));
}

function sellersignup(request, response) {
    response.sendFile(path.join(__dirname, "..", "public/sellersignup.html"));
}

function sellerproducts(request,response){
    if(request.session.IsSellerLoggedIn){
        response.render("sellerproducts", { authorityname: request.session.authorityname });
        request.session.authorityname = "";
    }
    else {
        response.redirect("/sellerlogin");
    }
}

function sellerlogout(request,response){
    request.session.IsSellerLoggedIn = false;
    response.redirect("sellerlogin");
}

function sellerrequest(request,response){
    if (request.session.IsSellerLoggedIn) {
        response.sendFile(path.join(__dirname, "..", "public/sellerrequest.html"))
    }
    else {
        response.redirect("/sellerlogin");
    }
}

function placingorder(request,response){
    if (request.session.IsLoggedIn) {
        response.sendFile(path.join(__dirname, "..", "public/placingorder.html"));
    }
    else{
        response.redirect("ecomlogin");
    }
}

function myorders(request, response) {
    if (request.session.IsLoggedIn) {
        response.sendFile(path.join(__dirname, "..", "public/myorders.html"));
    }
    else {
        response.redirect("ecomlogin");
    }
}

function sellerorderdetails(request, response) {
    if (request.session.IsSellerLoggedIn) {
        response.sendFile(path.join(__dirname, "..", "public/sellerorderdetails.html"));
    }
    else {
        response.redirect("sellerlogin");
    }
}

function report(request,response){
    if (request.session.IsSellerLoggedIn){
        response.sendFile(path.join(__dirname, "..", "public/report.html"));
    }
    else{
        response.redirect("sellerlogin");
    }
}

function distributor(request, response) {
    if (request.session.IsDistributorLoggedIn) {
        response.sendFile(path.join(__dirname, "..", "public/distributor.html"));
    }
    else {
        response.redirect("/sellerlogin");
    }
}

function distributorlogout(request, response) {
    request.session.IsDistributorLoggedIn = false;
    response.redirect("sellerlogin");
}

module.exports = {homepage,ecomlogin,ecomlogout,ecomsignup,ecomforgot,resetpassword,ecomadmin,sellerlogin,sellersignup,sellerproducts,sellerlogout,sellerrequest,placingorder,myorders,sellerorderdetails,report,distributor,distributorlogout};