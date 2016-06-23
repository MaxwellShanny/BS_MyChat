var moment = require('moment');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var sql = require('./sql');

var ejs=require("ejs");
app.engine(".html", ejs.__express);
app.set('view engine', 'html');

app.use(express.static('public'));

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var onlineUsers = {};

app.get('/', function(req, res){
    res.render('login');
});

app.post('/add_class', function(req, res){
    var name = req.body.loginAccount;
    var pwd = req.body.loginPassword;

    sql.confirmUser(name, pwd, function(err, result){
        if(!err){
            if(result.ok){
                res.render('login');
            }
            else{
                res.send("<script type=\"text/javascript\">alert(\"用户名或密码错误！\"); window.location.href=\"/\"</script>");
            }
        }
    });
});

app.post('/login_form', function(req, res){
    var name = req.body.loginAccount;
    var pwd = req.body.loginPassword;

    sql.confirmUser(name, pwd, function(err, result){
        if(!err){
            if(result.ok){
                res.render('page', { name:name });
            }
            else{
                res.send("<script type=\"text/javascript\">alert(\"用户名或密码错误！\"); window.location.href=\"/\"</script>");
            }
        }
    });
});

app.post('/register_form', function(req, res){
    var name = req.body.regAccount;
    var pwd = req.body.regPassword;
    var mail = req.body.regMail;

    sql.existUser(name, function(err, result){
        if(!err){
            if(result.exist){
                res.send("<script type=\"text/javascript\">alert(\"用户名已存在！\"); window.location.href=\"/\"</script>");
            }
            else{
                sql.existMail(mail, function(err, result){
                    if(result.exist){
                        res.send("<script type=\"text/javascript\">alert(\"邮箱已存在！\"); window.location.href=\"/\"</script>");
                    }
                    else{
                        sql.addUser(name, pwd, mail, function(err, result){
                            if(!err){
                                if(result.ok){
                                    res.send("<script type=\"text/javascript\">alert(\"注册成功！\"); window.location.href=\"/\"</script>");
                                }
                            }
                        });
                    }
                });
            }
        }
    });
});

io.on('connection', function(socket){
    console.log('someone comes in');

    //监听用户登录
    socket.on('login', function(name){
        socket.name = name;
        
        //检查在线列表，如果不在里面就加入
        if(!onlineUsers.hasOwnProperty(name)) {
            onlineUsers[name] = socket;
        }
        
        console.log(name + ' connected');
    });

    //监听用户退出
    socket.on('disconnect', function(){
        //将退出的用户从在线列表中删除
        if(onlineUsers.hasOwnProperty(socket.name)) {
            //删除
            delete onlineUsers[socket.name];
        }

        console.log(socket.name + ' disconnected');
    });
    
    socket.on('add_group', function(group_name){
        var name = socket.name;
        sql.existGroup(name, group_name, function(err, result){
            if(!err){
                if(result.exist){
                    socket.emit('add_group', false);
                }
                else{
                    sql.addGroup(name, group_name, function(err, result){
                        if(!err){
                            if(result.ok)
                                socket.emit('add_group', true);
                        }
                    });
                }
            }  
        });
    });
    
    socket.on('add_friend', function(info){
        var name = socket.name;
        var friend_name = info.friend_name;
        var group_name = info.group_name;
        sql.existUser(name, function(err, result) {
            if(!err){
                if(!result.exist){
                    socket.emit('add_friend', false);
                }
                else{
                    sql.existFriend(name, friend_name, function (err, result) {
                        if (!err) {
                            if (result.exist) {
                                socket.emit('add_friend', false);
                            }
                            else {
                                sql.addFriend(name, friend_name, group_name, function (err, result) {
                                    if (!err) {
                                        if (result.ok)
                                            socket.emit('add_friend', true);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });

    socket.on('confirm_friend', function(info){
        var name = socket.name;
        var friend_name = info.friend_name;
        var group_name = info.group_name;
        sql.confirmFriend(name, friend_name, group_name, function(err, result){
            if(!err){
                if(result.ok)
                    socket.emit('confirm_friend', true);
            }
        });
    });

    socket.on('update_group_list', function(){
        var name = socket.name;
        sql.searchAllGroup(name, function(err, result){
            if(!err){
                if(result.ok)
                    socket.emit('update_group_list', result.data);
            }
        });
    });

    socket.on('update_friend_request', function(){
        var name = socket.name;
        sql.searchFriendRequest(name, function(err, result){
            if(!err){
                if(result.ok)
                    socket.emit('update_friend_request', result.data);
            }
        });
    });

    socket.on('update_friend_list', function(){
        var name = socket.name;
        sql.searchAllFriend(name, function(err, result){
            if(!err){
                if(result.ok)
                    socket.emit('update_friend_list', result.data);
            }
        });
    });

    socket.on('update_friend_nav', function(){
        var name = socket.name;
        var res = {};
        sql.searchAllGroup(name, function(err, result){
            if(!err){
                if(result.ok){
                    for(var i=0; i<result.data.length; i++){
                        res[result.data[i].group_name] = [];
                    }
                    sql.searchAllFriend(name, function(err, result){
                        if(!err){
                            if(result.ok){
                                for(var i=0; i<result.data.length; i++){
                                    res[result.data[i].group_name].push(result.data[i].friend_name);
                                }
                                socket.emit('update_friend_nav', res);
                            }
                        }
                    });
                }
            }
        });
    });

    socket.on('send_msg', function(info){
        var msg = info.msg;
        var friend_name = info.friend_name;
        var name = socket.name;
        var time = moment().format('YYYY-MM-DD HH:mm:ss');
        sql.addMsg(name, friend_name, msg, time, function(err, result){
            if(!err){
                if(result.ok){
                    if(onlineUsers.hasOwnProperty(friend_name)){
                        onlineUsers[friend_name].emit('notice_update_msg');
                    }
                }
            }
        });
    });
    
    socket.on('update_msg_notice', function(){
        var name = socket.name;
        sql.getMsgNotice(name, function(err, result){
            if(!err){
                if(result.ok)
                    socket.emit('update_msg_notice', result.data);
            }
        });
    });

    socket.on('update_msg', function(friend_name){
        var name = socket.name;
        sql.getMsg(name, friend_name, function(err, result){
            if(!err){
                if(result.ok)
                    socket.emit('update_msg', result.data);
            }
        });
    });
    
    socket.on('change_pwd', function(info){
        var name = socket.name;
        var old_pwd = info.old_pwd;
        var new_pwd = info.new_pwd;
        sql.confirmUser(name, old_pwd, function(err, result){
            if(!err){
                if(!result.ok){
                    socket.emit('change_pwd', false);
                }
                else{
                    sql.changePwd(name, new_pwd, function(err, result){
                        if(!err){
                            socket.emit('change_pwd', true);
                        }
                    });
                }
            }
        });
    });

    socket.on('change_mail', function(new_mail){
        var name = socket.name;
        sql.changeMail(name, new_mail, function(err, result){
            if(!err){
                socket.emit('change_mail', true);
            }
        });
    });
});

server.listen(3000, function(){
    console.log('listening on *:3000');
});