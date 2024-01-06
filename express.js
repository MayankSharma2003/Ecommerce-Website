const express = require("express");
const app = express();
const multer = require("multer");
var session = require("express-session");
const upload = multer({ dest: 'uploads/' });

const con = require("./models/mysql");
con.connect(function (error) {
    if (error) throw error;
    console.log("Connected");
});

app.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.set("view engine", "ejs");
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(upload.single('pic'));
app.use(
    session({
        secret: "Hello",
        resave: true,
        saveUninitialized: true,
    })
);

const htmlpages = require("./controllers/htmlpages");
const verificationpages = require("./controllers/verificationpages");
const productpages = require("./controllers/productpages");
const sellerpages = require("./controllers/sellerpages");
const adminpages = require("./controllers/adminpages");
const cartpages = require("./controllers/cartpages");
const orderpages = require("./controllers/orderpages");

app.get("/", htmlpages.homepage);
app.get("/ecomlogin", htmlpages.ecomlogin);
app.get("/ecomlogout", htmlpages.ecomlogout)
app.get("/ecomsignup", htmlpages.ecomsignup);
app.get("/ecomforgot", htmlpages.ecomforgot);
app.get("/resetpassword", htmlpages.resetpassword);
app.get("/ecomadmin", htmlpages.ecomadmin);
app.get("/sellerlogin",htmlpages.sellerlogin);
app.get("/sellersignup",htmlpages.sellersignup);
app.get("/sellerproducts",htmlpages.sellerproducts);
app.get("/sellerlogout",htmlpages.sellerlogout);
app.get("/sellerrequest",htmlpages.sellerrequest);
app.get("/placingorder",htmlpages.placingorder);
app.get("/myorders", htmlpages.myorders);
app.get("/sellerorderdetails",htmlpages.sellerorderdetails);
app.get("/report",htmlpages.report);
app.get("/distributor",htmlpages.distributor);
app.get("/distributorlogout", htmlpages.distributorlogout);

app.get("/ecomcart",cartpages.ecomcart);
app.get("/addtocart",cartpages.addtocart);
app.get("/increement",cartpages.increement);
app.get("/decreement",cartpages.decreement);
app.get("/deleteCartProduct",cartpages.deleteCartProduct);

app.get("/orderedproducts", orderpages.orderedproducts);
app.get("/orderedproductsforseller", orderpages.orderedproductsforseller);
app.post("/orderdetails",orderpages.orderdetails);
app.post("/updatetrack",orderpages.updatetrack);
app.post("/cancelorder",orderpages.cancelorder);
app.get("/orderedproductsfordistributor",orderpages.orderedproductsfordistributor)

app.post("/ecomsignup",verificationpages.ecomsignup);
app.post("/ecomlogin", verificationpages.ecomlogin);
app.get("/verifyEmail/:userId",verificationpages.verifyEmail);
app.post("/changepassword", verificationpages.changepassword);
app.get("/verifyEmailForPassword/:userId", verificationpages.verifyEmailForPassword);
app.post("/forgotpassword", verificationpages.forgotpassword);
app.get("/confirmation", verificationpages.confirmation);

app.get("/ecomproduct", productpages.ecomproduct);
app.post("/allproducts", productpages.allproducts);
app.get("/getproductforhome",productpages.getproductforhome);
app.get("/getcountofproducts",productpages.getcountofproducts)

app.post("/sellersignup",sellerpages.sellersignup);
app.post("/sellerlogin",sellerpages.sellerlogin);
app.get("/verifySellerEmail/:sellerId", sellerpages.verifySellerEmail);
app.post("/sellerproducts",sellerpages.sellerproducts);
app.get("/getauthorityname",sellerpages.getauthorityname);
app.get("/allproductsforseller",sellerpages.allproductsforseller);
app.post("/update",sellerpages.update);
app.get("/deletee",sellerpages.deletee);
app.get("/productsforrequest", sellerpages.productsforrequest);
app.get("/getproductsforreport", sellerpages.getproductsforreport);
app.get("/distributorlogin",sellerpages.distributorlogin);

app.get("/getseller",adminpages.getseller);
app.post("/selleraccepted",adminpages.selleraccepted);
app.post("/sellerrejected", adminpages.sellerrejected);
app.get("/getproduct", adminpages.getproduct);
app.post("/productaccepted", adminpages.productaccepted);
app.post("/productrejected", adminpages.productrejected);
app.get("/getallusers", adminpages.getallusers);
app.get("/getallsellers", adminpages.getallsellers);

app.get("*", function (request, response) {
    response.sendFile(__dirname + "/public/404.html");
});

app.listen(8000, function () {   
    console.log("Server is running on port 8000");
});
