/**
 * Created by maxwell on 16/6/18.
 */

$(function () {
    $('button#reg').click(function () {
        $('div#reg_box').slideToggle('normal');
    });
});

function check_form(){
    var pwd = document.getElementById('regPassword').value;
    var mail = document.getElementById('regMail').value;
    var form = document.getElementById('register');
    var filter  = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

    if (filter.test(mail)){
        if(pwd.length >= 6){
            form.submit();
        }
        else{
            alert('密码长度必须大于6位');
        }
    }
    else{
        alert('邮箱格式不正确');
    }
}