var nodemailer = require('nodemailer');
var fs = require('fs')
var path = require('path')
var transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
        user: '11111111@qq.com', // 你的账号
        pass: 'xxxxxxxx' //你的qq授权码
    }
});
var mailOptions = {
    from: '"nick" <111111@qq.com>', // 你的账号名 | 你的账号
    to: '222222@qq.com,333333@qq.com,', // 接受者,可以同时发送多个,以逗号隔开
    subject: 'MJML', // 标题
    html: fs.createReadStream(path.resolve(__dirname,'demo.html')) // 指定发送文件路径
};

transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('发送成功');
});
