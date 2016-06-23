/**
 * Created by maxwell on 16/6/18.
 */
function to_chat(friend_name)
{
    update_msg(friend_name);
    document.getElementById("chat_name").innerHTML=friend_name;
    document.getElementById("chat_ok").onclick=function(){
        send_msg(friend_name);
    }
    document.getElementById("account").style.display = 'none';
    document.getElementById("friend").style.display = 'none';
    document.getElementById("chat").style.display = 'block';
}

function to_account()
{
    document.getElementById("account").style.display = 'block';
    document.getElementById("friend").style.display = 'none';
    document.getElementById("chat").style.display = 'none';
}

function to_friend()
{
    document.getElementById("account").style.display = 'none';
    document.getElementById("friend").style.display = 'block';
    document.getElementById("chat").style.display = 'none';
}

$(function () {
    $('a#friends').click(function () {
        if($(this)[0].innerHTML=='▶ 我的好友'){
            $(this)[0].innerHTML='▼ 我的好友'; 
            update_friend_nav();
        }
        else
            $(this)[0].innerHTML='▶ 我的好友';
        $('div#friend_nav').slideToggle('normal');
    });
});