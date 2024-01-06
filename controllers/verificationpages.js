const path = require('node:path');
const con = require(path.join(__dirname, "..", "models/mysql.js"));
const mail = require(path.join(__dirname, "..", "utils/sendMail.js"));
const queries = require(path.join(__dirname, "..", "utils/queries.js"));

function ecomsignup(request, response) {
    const user = request.body;
    if (user.username == "" || user.email == "" || user.password == "") {
        response.status(400);
        response.send();
    }
    else {
        // con.query(`select * from users where email='${user.email}'`,function(error,data){
        //     if(error) throw error;
        queries.selectuser(user,"users")
            .then(function (data) {
                console.log(data);
                if (data.length === 0) {
                    mail.sendMail([{ Email: user.email, Name: user.username }],
                        "User Verification",
                        `<h2>Verify yourself by clicking the link....</h2>
                        <a href="http://127.0.0.1:8000/verifyEmail/${user.id}">Click here..</a>`);
                    con.query(`insert into users values('${user.username}','${user.email}','${user.password}','${user.id}',0,1,0)`,
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
        // })
    }
}

function ecomlogin(request, response) {
    const user = request.body;
    if (user.email == "" || user.password == "") {
        response.status(400);
        response.send();
    }
    // con.query(`select * from users where email='${user.email}' AND password='${user.password}' AND isVerified=true AND isAdmin=true`, function (error, data) {
    //     if (data.length != 0) {
    //         response.status(304);
    //         response.send();
    //     }
    //     else    
    //         {
    //         findlogin(user.email, request, function () {
    //             if (user.email == "" || user.password == "") {
    //                 response.status(400);
    //                 response.send();
    //             }
    //             else {
    //                 request.session.email = user.email;
    //                 request.session.password = user.password;
    //                 con.query(`select * from users where email='${user.email}' AND password='${user.password}' and isActive=true and isAdmin=false and isVerified=true`, function (error, data) {
    //                     console.log(data);
    //                     if (data.length != 0) {
    //                         request.session.userid = data[0].id;
    //                         request.session.IsLoggedIn = true;
    //                         response.status(200);
    //                         response.send();
    //                     }
    //                     else {
    //                         response.status(400);
    //                         response.send();
    //                         }
    //                 })
    //             }
    //         })
    //         }
    // });

    queries.selectuser(user,"users")
        .then(function (dataa) {
            console.log(dataa);
            let data = dataa.filter(function (d) {
                return d.password == user.password && d.isAdmin == true && d.isVerified == true;
            })
            if (data.length != 0) {
                request.session.IsAdminLoggedIn = true;
                response.status(304);
                response.send();
                return;
            }
            else {
                findlogin(user.email, request, function () {
                    if (user.email == "" || user.password == "") {
                        response.status(400);
                        response.send();
                    }
                    else {
                        request.session.email = user.email;
                        request.session.password = user.password;
                        queries.selectuser(user,"users")
                            .then(function (dataa) {
                                let data = dataa.filter(function (d) {
                                    return d.password == user.password && d.isAdmin == false && d.isVerified == true && d.isActive == true;
                                })
                                if (data.length != 0) {
                                    request.session.userid = data[0].id;
                                    request.session.IsLoggedIn = true;
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
    await con.query(`select * from users where email='${email}' AND isActive=true;`, function (error, data) {
        if (data.length != 0) {
            request.session.Username = data[0].username;
        }
        callback();
    })
}

function verifyEmail(request, response) {
    const { userId } = request.params;
    queries.updateuser(userId, "users")
        .then(function (data) {
            response.redirect("../ecomlogin");
        })
        .catch(function (error) {
            throw error;
        })
}

function changepassword(request, response) {
    const password = request.body.password;
    const userId = request.session.userid;
    con.query(`update users set password='${password}' where id=${userId}`,function(error,data){
        if(error) throw error;
        response.status(200);
        response.send();
    })
}

function forgotpassword(request, response) {
    const email = request.body.email;
    console.log(email);
    con.query(`select * from users where email='${email}' and isActive=true`,(error,data) => {
            console.log(data);
            if (data.length == 0) {
                response.status(400);
                response.send();
            }
            else {
                mail.sendMail([{ Email: email, Name: data[0].username }],
                    "Forgot Password",
                    `<h2>Verify yourself by clicking the link....</h2>
                    <a href="http://127.0.0.1:8000/verifyEmailForPassword/${data[0].id}">Click here..</a>`);
                response.status(200);
                response.send();
            }
        })
}



function verifyEmailForPassword(request, response) {
    const { userId } = request.params;
    request.session.userid = userId;
    response.redirect("/resetpassword");
}

function confirmation(request, response) {
    response.send("Please..Verify your email");
}

module.exports = { ecomsignup, ecomlogin, verifyEmail ,changepassword,verifyEmailForPassword,forgotpassword,confirmation}