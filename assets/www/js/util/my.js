
var serverId = "http://58.118.0.50:8080/mtoas1.0/";
//var serverId = "http://192.168.1.105:8080/mtoas1.0/";

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	document.addEventListener("backbutton", eventBackButton, false); // 返回键
}

// 返回键
function eventBackButton() {
		document.removeEventListener("backbutton", eventBackButton, false); // 注销返回键
		document.addEventListener("backbutton", exitConfirm, false);//绑定退出事件
		// 3秒后重新注册
		var intervalID = window.setInterval(function() {
			window.clearInterval(intervalID);
			document.removeEventListener("backbutton", exitConfirm, false); // 注销 退出事件
			document.addEventListener("backbutton", eventBackButton, false); // 返回键
		}, 2000);
}

function exitAlert(){
	$.mobile.loadingMessageTextVisible = true;
	$.mobile.showPageLoadingMsg("a", '再点击一次退出!', true);
	setTimeout(function (){
		$.mobile.hidePageLoadingMsg();
	}, 2000);
}

function exitConfirm(){
	 navigator.notification.confirm(
            '您确定要退出程序吗？', 
            exitApp,
            '退出程序', 
            '确定,取消'
        );
}

function exitApp( v ) {
 	if(v == 1) {
 		document.removeEventListener("backbutton", eventBackButton, false);//注销返回键
 		navigator.app.exitApp(); 
 	}
}


function saveUserInfoStorage (key,value){
	window.localStorage.setItem(key,value);
}
function getValueStorage(key){
	 var value = window.localStorage.getItem(key);
	 return value;
}
function deleteValueStorage(key){ 
	 window.localStorage.removeItem(key);
}















