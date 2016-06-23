/**
 * Created by maxwell on 16/6/18.
 */

var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit:20,
    host:'localhost',
    user:'root',
    password:'123456',
    database:'db'
});

exports.existUser = function(name, callback){
    var query = 'select name from user where name=' + mysql.escape(name);
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack)
            callback(err, {"exist":false})
        }
        else{
            if(res.length == 0){
                callback(null, {"exist":false})
            }
            else{
                callback(null, {"exist":true})
            }
        }
    });
}

exports.existMail = function(mail, callback){
    var query = 'select name from user where email=' + mysql.escape(mail);
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack)
            callback(err, {"exist":false})
        }
        else{
            if(res.length == 0){
                callback(null, {"exist":false})
            }
            else{
                callback(null, {"exist":true})
            }
        }
    });
}

exports.addUser = function(name, pwd, mail, callback){
    var query = 'insert into user value(' + mysql.escape(name) + ',' + mysql.escape(pwd) + ',' + mysql.escape(mail) + ')';
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            query = 'insert into friend value(' + mysql.escape(name) + ',' + mysql.escape('sys_class') + ',' + mysql.escape('my_friends') + ',3)';
            pool.query(query, function(err, res){
                callback(null, {"ok":true});
            });
        }
    });
}

exports.confirmUser = function(name, pwd, callback){
    var query = 'select name from user where name=' + mysql.escape(name) + ' and pwd=' + mysql.escape(pwd);
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack)
            callback(err, {"ok":false})
        }
        else{
            if(res.length == 0){
                callback(null, {"ok":false})
            }
            else{
                callback(null, {"ok":true})
            }
        }
    });
}

exports.existGroup = function(name, group_name, callback){
    var query = 'select name1 from friend where name1=' + mysql.escape(name) + ' and group_name=' + mysql.escape(group_name);
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack)
            callback(err, {"exist":false})
        }
        else{
            if(res.length == 0){
                callback(null, {"exist":false})
            }
            else{
                callback(null, {"exist":true})
            }
        }
    });
}

exports.addGroup = function(name, group_name, callback){
    var query = 'insert into friend value(' + mysql.escape(name) + ',' + mysql.escape('sys_class') + ',' + mysql.escape(group_name) + ',3)';
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            callback(null, {"ok":true});
        }
    });
}

exports.deleteGroup = function(name, group_name, callback){
    var query = 'select name1 from friend where name1=' + mysql.escape(name) + ' and group_name=' + mysql.escape(group_name);
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            if(res.length > 1){
                callback(null, {"ok":false})
            }
            else{
                query = 'delete from friend where name1=' + mysql.escape(name) + ' and group_name=' + mysql.escape(group_name);
                pool.query(query, function(err, res){
                    callback(null, {"ok":true});
                });
            }
        }
    });
}

exports.editGroup = function(name, old_group_name, new_group_name, callback){
    var query = 'update friend set group_name=' + new_group_name + ' where name1=' + mysql.escape(name) + ' and group_name=' + mysql.escape(old_group_name);
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            callback(null, {"ok":true});
        }
    });
}

exports.existFriend = function(name, friend_name, callback){
    var query = 'select name1 from friend where name1=' + mysql.escape(name) + ' and name2=' + mysql.escape(friend_name);
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack)
            callback(err, {"exist":false})
        }
        else{
            if(res.length == 0){
                callback(null, {"exist":false})
            }
            else{
                callback(null, {"exist":true})
            }
        }
    });
}

exports.addFriend = function(name, friend_name, group_name, callback){
    var query = 'insert into friend value(' + mysql.escape(name) + ',' + mysql.escape(friend_name) + ',' + mysql.escape(group_name) + ',1)';
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            var query = 'insert into friend value(' + mysql.escape(friend_name) + ',' + mysql.escape(name) + ',null,0)';
            pool.query(query, function(err, res){
                if(err) {
                    console.log(query);
                    console.error(err.stack);
                    callback(err, {"ok": false});
                }
                else
                    callback(null, {"ok": true});
            });
        }
    });
}

exports.confirmFriend = function(name, friend_name, group_name, callback){
    console.log(name);
    console.log(group_name);
    console.log(friend_name);
    var query = 'update friend set state=2, group_name=' + mysql.escape(group_name) + ' where name1=' + mysql.escape(name) + ' and name2=' + mysql.escape(friend_name);
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            var query = 'update friend set state=2 where name1=' + mysql.escape(friend_name) + ' and name2=' + mysql.escape(name);
            pool.query(query, function(err, res){
                if(err) {
                    console.log(query);
                    console.error(err.stack);
                    callback(err, {"ok": false});
                }
                else{
                    console.log('1');
                    callback(null, {"ok": true});
                }
            });
        }
    });
}

exports.rejectFriend = function(name, friend_name, callback) {
    var query = 'delete from friend where name1=' + mysql.escape(name) + ' and name2=' + mysql.escape(friend_name);
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            var query = 'delete from friend where name1=' + mysql.escape(friend_name) + ' and name2=' + mysql.escape(name);
            pool.query(query, function(err, res){
                if(err) {
                    console.log(query);
                    console.error(err.stack);
                    callback(err, {"ok": false});
                }
                else
                    callback(null, {"ok": true});
            });
        }
    });
}

exports.deleteFriend = function(name, friend_name, callback) {
    var query = 'delete from friend where name1=' + mysql.escape(name) + ' and name2=' + mysql.escape(friend_name);
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            var query = 'delete from friend where name1=' + mysql.escape(friend_name) + ' and name2=' + mysql.escape(name);
            pool.query(query, function(err, res){
                if(err) {
                    console.log(query);
                    console.error(err.stack);
                    callback(err, {"ok": false});
                }
                else
                    callback(null, {"ok": true});
            });
        }
    });
}

exports.moveFriend = function(name, friend_name, group_name, callback) {
    var query = 'update friend set group_name=' + mysql.escape(group_name) + ' where name1=' + mysql.escape(name) + ' and name2=' + mysql.escape(friend_name);
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            callback(null, {"ok": true});
        }
    });
}

exports.searchAllGroup = function(name, callback){
    var query = 'select group_name from friend where name1=' + mysql.escape(name) + ' and state=3';
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            callback(null, {"ok": true, data:res});
        }
    });
}

exports.searchFriendRequest = function(name, callback){
    var query = 'select name2 as friend_name from friend where name1=' + mysql.escape(name) + ' and state=0';
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            callback(null, {"ok": true, data:res});
        }
    });
}

exports.searchAllFriend = function(name, callback){
    var query = 'select name2 as friend_name, group_name from friend where name1=' + mysql.escape(name) + ' and state=2';
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            callback(null, {"ok": true, data:res});
        }
    });
}

exports.addMsg = function(name, friend_name, msg, time, callback){
    var query = 'insert into message value(' + mysql.escape(friend_name) + ',' + mysql.escape(name) + ',' + mysql.escape(time) + ',' + mysql.escape(msg) + ')';
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            callback(null, {"ok": true});
        }
    });
}

exports.getMsgNotice = function(name, callback){
    var query = 'select sender_name as friend_name, count(*) as num from message where name=' + mysql.escape(name) + ' group by sender_name';
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            callback(null, {"ok": true, data:res});
        }
    });
}

exports.getMsg = function(name, friend_name, callback){
    var query = 'select sender_name as friend_name, send_time as time, content as msg from message where name=' + mysql.escape(name) + ' and sender_name=' + mysql.escape(friend_name);
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            query = 'delete from message where name=' + mysql.escape(name) + ' and sender_name=' + mysql.escape(friend_name);
            pool.query(query, function (err, res2) {
                if(err){
                    console.log(query);
                    console.error(err.stack);
                    callback(err, {"ok":false});
                }
                else{
                    callback(null, {"ok": true, data:res});
                }
            });
        }
    });
}

exports.changePwd = function(name, new_pwd, callback){
    var query = 'update user set pwd=' + mysql.escape(new_pwd) + ' where name=' + mysql.escape(name);
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            callback(null, {"ok": true});
        }
    });
}

exports.changeMail = function(name, new_mail, callback){
    var query = 'update user set email=' + mysql.escape(new_mail) + ' where name=' + mysql.escape(name);
    pool.query(query, function (err, res) {
        if(err){
            console.log(query);
            console.error(err.stack);
            callback(err, {"ok":false});
        }
        else{
            callback(null, {"ok": true});
        }
    });
}