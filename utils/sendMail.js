const Mailjet = require("node-mailjet");
const mailjet = new Mailjet({
    apiKey: "c377058ca293e80069f7471376833c47",
    apiSecret:"371f85fc21efdb30909fa214d7293739"
});

module.exports.sendMail = async function(email,subject,body){
    return await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: 'mayank.213074@maimt.com',
                    Name: 'Mayank',
                },
                To: email,
                Subject: subject,
                HTMLPart: body
            },
        ],
    })
    .then(response=>{
        console.log(response.body);
    })
}