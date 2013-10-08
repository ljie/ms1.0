
var submitTime =20000;

function _popup_tip( msg ){
		$.mobile.loadingMessageTextVisible = true;
		$.mobile.showPageLoadingMsg("a", msg, true);
		setTimeout(function (){
			$.mobile.hidePageLoadingMsg();
		}, 1000);
}

function popup_tip( msg ){
	$( "#index_popup" ).html("<p>"+msg+"<p>");
	$( "#index_popup" ).popup( 'open');
}

function popup_tip_hide(  ){
	$( "#index_popup" ).popup( 'close');
}

function loading_tip_show(  ){
	$.mobile.showPageLoadingMsg("a", "加载中...");
}
function loading_tip_hide(  ){
	$.mobile.hidePageLoadingMsg();
}

/**
 * 检查网络情况
 */
function checkConnection() {
	var networkState = navigator.network.connection.type;
	if (networkState == Connection.NONE) {
		navigator.notification.confirm('检测不到网路，检查网络是否链接', null, '提示','确定,返回');
		return false;
	}else{
		return true;
	}
}
/**
 *拜访备注 开始
 */
 
 function remark_reset(){
		$("#remark").val("");
		$("#linkman").val("");
		$("#contact_way").val("");
		$("#title").val("");
		$("#title_description").val("");
		$("#reCustomerId").text( '' );
		$("#reCustomerName").attr("style","display:none");
		$("#reCustomerName").text(" ");
		$("#projectId").text( '' );
		$("#projectName").attr("style","display: none");
		$("#projectName").text(" ");
}
function findProject(){
		if(!checkConnection()){
			return ;
		}
		var userId=getValueStorage("userId");
		var customerId=getValueStorage("reCustomerId");
		if(customerId==""){
			popup_tip( "请选中备注的企业!" );
		}else{
			loading_tip_show();
			$.ajax({
			   type: "POST",
			   url: serverId+"ms/findProject",
			   data: {userId:userId,customerId:customerId,},
			   success: function(msg){
				  	   	var n=msg.list.length;
					   	var phtml='<ul data-role="listview" data-inset="true" style="min-width:200px;list-style-type: circle" data-theme="d">';
						   	if(n==0){
						   		phtml+="<li style='font-weight:normal; color:red'><center>暂无数据</center></li>";
						   	}else{
						   		for(var i=0; i<n; i++){
						   			phtml += "<li data-theme='d' style='line-height:35px;'><a href='#' onclick='savaProject("+msg.list[i].id+",\""+msg.list[i].name+"\",1)' style='text-decoration:none; font-size:20px;'>"+msg.list[i].name+"</a></li>";
						   		}
					   	   }
					   phtml+="</ul>";
					   loading_tip_hide();
				   	   $("#enterprise_list_popup").html(phtml);
			   },
			   error: function () {
			   		loading_tip_hide();
	                popup_tip( "获取企业项目失败,请重新操作" );
	           },
	           complete: function() {
		       		$( "#enterprise_list_popup" ).popup( "open" );
	           }   
			});
		}
}

function savaProject(id, name, type){
		saveUserInfoStorage("projectId",id);
		saveUserInfoStorage("projectName",name);
		$("#enterprise_list_popup").popup( "close" )
		$("#projectId").text(id);
		$("#projectName").attr("style","display:block");
		$("#projectName").text("您选中的企业:"+name);
		$("#enterprise_list_popup").html( "" );
		
		
}
function remark_submit(){
		if(!checkConnection()){
			return ;
		}
		var userId=getValueStorage("userId");
		var reCustomerId=getValueStorage("reCustomerId");
		if(reCustomerId==""){
			popup_tip( "请选中备注的企业!" );
		}else{
			var visitState = $("#visitState").val();
			if(visitState==""){
				popup_tip("请选择类型!");
			}
			var linkman = $("#linkman").val();
			if(linkman==""){
				popup_tip("请填写联系人!");
			}
			var contact_way = $("#contact_way").val();
			var title = $("#title").val();
			var title_description = $("#title_description").val();
			var text = $("#remark").val();
			if(text==""){
				popup_tip("请填写备注!");
			}else{
				$.mobile.showPageLoadingMsg("a", "提交中...");
				$.ajax({
				   type: "POST",
				   url: serverId+"ms/insertVisitRemark",
				   data: {userId:userId,customerId:reCustomerId,text:text,visitState:visitState,linkman:linkman,contact_way:contact_way,title:title,title_description:title_description},
				   success: function(msg){
						_popup_tip("数据提交成功!");
						remark_reset(); 
						loading_tip_hide(); 
						$( "#visit_remark_panel" ).panel( "close" );
				   },
				   error: function () {
				   		loading_tip_hide(); 
		                popup_tip("提交错误");
		           }
				});
			}
		}
}
//*****************拜访备注 结束

/**
 *当前 位置 开始
 */

function enterpriseList( type ){
		//1代表该用户计划企业。
		if(!checkConnection()){
			return ;
		}
		var userId=getValueStorage("userId");
		if(type==1){
				loading_tip_show();
				$.ajax({
				   	type: "POST",
				   	url: serverId+"ms/findPlanCustomer",
				   	data: {userId:userId,type:type},
				   	success: function(msg){
				  	   	var n=msg.list.length;
					   	var html='<ul data-role="listview" data-inset="true" style="min-width:200px;list-style-type: circle" data-theme="d">';
						   	if(n==0){
						   		html+="<li style='font-weight:normal; color:red'><center>暂无数据</center></li>";
						   	}else{
						   		for(var i=0; i<n; i++){
						   			html += "<li data-theme='d' style='line-height:35px;'><a href='#' onclick='savaChange("+msg.list[i].id+",\""+msg.list[i].name+"\",1)' style='text-decoration:none; font-size:20px;'>"+msg.list[i].name+"</a></li>";
						   		}
					   	   }
					   html+="</ul>";
				   	   $("#enterprise_list_popup").html(html);
				   },
				   error: function () {
				   		loading_tip_hide();
		                popup_tip("获取拜访企业失败");
		           },
		           complete: function() {
		           		loading_tip_hide();
			       		$( "#enterprise_list_popup" ).popup( "open" );
		           }   
				});
		}else if(type==2){
				//2代表该用户负责的企业。
				loading_tip_show();
				$.ajax({
					   type: "POST",
					   url: serverId+"ms/findAllCustomer",
					   data: {userId:userId},
					   success: function(msg){
					   	   var n=msg.list.length;
						   var htmlall='<ul data-role="listview" data-inset="true" style="min-width:200px;list-style-type: circle;" data-theme="b">';
							   if(n==0){
							   		htmlall+="<li style='font-weight:normal; color:red'><center>暂无数据</center></li>";
							   				
							   }else{
							   		for(var i=0; i<n; i++){
							   			htmlall += "<li data-theme='d' style='line-height:35px;'>"+
							   								"<a href='#' onclick='savaChange("+msg.list[i].id+",\""+msg.list[i].name+"\",2)' style='text-decoration:none;font-weight:normal;font-size:20px;'>"+
							   								 	msg.list[i].name
							   								 "</a></li>";
							   		}
						   	   }
						   htmlall+="</ul>";
					   	   $("#enterprise_list_popup").html(htmlall);
					   },
					   error: function () {
					   		loading_tip_hide();
			           },
					   complete: function() {
					   		loading_tip_hide();
				           $( "#enterprise_list_popup" ).popup( "open" );
			           } 
				});
		}else if(type==3){
				loading_tip_show();
				//3代表该用户计划中已拜访企业添加备注。
				var userId=getValueStorage("userId");
				$.ajax({
				   	type: "POST",
				   	url: serverId+"ms/findPlanCustomer",
				   	data: {userId:userId,type:type},
				   	success: function(msg){
				  	   	var n=msg.list.length;
					   	var html='<ul data-role="listview" data-inset="true" style="min-width:200px;list-style-type: circle" data-theme="d">';
						   	if(n==0){
						   		html+="<li style='font-weight:normal; color:red'><center>暂无数据</center></li>";
						   	}else{
						   		for(var i=0; i<n; i++){
						   			html += "<li data-theme='d' style='line-height:35px;'><a href='#' onclick='savaChange("+msg.list[i].id+",\""+msg.list[i].name+"\",3)' style='text-decoration:none; font-size:20px;'>"+msg.list[i].name+"</a></li>";
						   		}
					   	   }
					   html+="</ul>";
				   	   $("#enterprise_list_popup").html(html);
				   },
				   error: function () {
				   		loading_tip_hide();
		                popup_tip("获取拜访企业失败");
		           },
		           complete: function() {
		           		loading_tip_hide();
			       		$( "#enterprise_list_popup" ).popup( "open" );
		           }   
				});
		
		}else if(type==4){
				loading_tip_show();
				//4代表该用户计划中已拜访企业上传照片。
				var userId=getValueStorage("userId");
				$.ajax({
				   	type: "POST",
				   	url: serverId+"ms/findPlanCustomer",
				   	data: {userId:userId,type:type},
				   	success: function(msg){
				  	   	var n=msg.list.length;
					   	var html='<ul data-role="listview" data-inset="true" style="min-width:200px;list-style-type: circle" data-theme="d">';
						   	if(n==0){
						   		html+="<li style='font-weight:normal; color:red'><center>暂无数据</center></li>";
						   	}else{
						   		for(var i=0; i<n; i++){
						   			html += "<li data-theme='d' style='line-height:35px;'><a href='#' onclick='savaChange("+msg.list[i].id+",\""+msg.list[i].name+"\",4)' style='text-decoration:none; font-size:20px;'>"+msg.list[i].name+"</a></li>";
						   		}
					   	   }
					   html+="</ul>";
				   	   $("#enterprise_list_popup").html(html);
				   },
				   error: function () {
				   		loading_tip_hide();
		                popup_tip("获取拜访企业失败");
		           },
		           complete: function() {
		           		loading_tip_hide();
			       		$( "#enterprise_list_popup" ).popup( "open" );
		           }   
				});
		
		}else if(type==5){
				loading_tip_show();
				//5代表该用户计划中已拜访企业添加项目。
				var userId=getValueStorage("userId");
				$.ajax({
				   	type: "POST",
				   	url: serverId+"ms/findPlanCustomer",
				   	data: {userId:userId,type:type},
				   	success: function(msg){
				  	   	var n=msg.list.length;
					   	var html='<ul data-role="listview" data-inset="true" style="min-width:200px;list-style-type: circle" data-theme="d">';
						   	if(n==0){
						   		html+="<li style='font-weight:normal; color:red'><center>暂无数据</center></li>";
						   	}else{
						   		for(var i=0; i<n; i++){
						   			html += "<li data-theme='d' style='line-height:35px;'><a href='#' onclick='savaChange("+msg.list[i].id+",\""+msg.list[i].name+"\",5)' style='text-decoration:none; font-size:20px;'>"+msg.list[i].name+"</a></li>";
						   		}
					   	   }
					   html+="</ul>";
				   	   $("#enterprise_list_popup").html(html);
				   },
				   error: function () {
				   		loading_tip_hide();
		                popup_tip("获取拜访企业失败");
		           },
		           complete: function() {
		           		loading_tip_hide();
			       		$( "#enterprise_list_popup" ).popup( "open" );
		           }   
				});
		
		}
}
function savaChange(id, name,type){
		if(type==1||type==2){
			saveUserInfoStorage("customerId",id);
			saveUserInfoStorage("customerName",name);
			$("#enterprise_list_popup").popup( "close" )
			$("#selectCustomerId").text(id);
			$("#selectCustomerName").attr("style","display:block");
			$("#selectCustomerName").text("您选中的企业:"+name);
			$("#enterprise_list_popup").html( "" );
		}else if(type==3){
			saveUserInfoStorage("reCustomerId",id);
			saveUserInfoStorage("reCustomerName",name);
			$("#enterprise_list_popup" ).popup( "close" )
			$("#reCustomerId").text(id);
			$("#reCustomerName").attr("style","display:block");
			$("#reCustomerName").text("您选中的企业:"+name);
			$("#enterprise_list_popup").html( "" );
		}else if(type==4){
			saveUserInfoStorage("caCustomerId",id);
			saveUserInfoStorage("caCustomerName",name);
			$("#enterprise_list_popup" ).popup( "close" )
			$("#caCustomerId").text(id);
			$("#caCustomerName").attr("style","display:block");
			$("#caCustomerName").text("您选中的企业:"+name);
			$("#enterprise_list_popup").html( "" );
		}else if(type==5){
			saveUserInfoStorage("prCustomerId",id);
			saveUserInfoStorage("prCustomerName",name);
			$("#enterprise_list_popup" ).popup( "close" )
			$("#prCustomerId").text(id);
			$("#prCustomerName").attr("style","display:block");
			$("#prCustomerName").text("您选中的企业:"+name);
			$("#enterprise_list_popup").html( "" );
		}
		
}
function _onError(error) {}
function onSuccess_enterprise_arrive(position){
	var userId=getValueStorage("userId");
    var userName=getValueStorage("userName");
	var customerId=getValueStorage("customerId");
	var radio_type;
	var radios = document.getElementsByName('update-radio-choice');
	for (var iIndex = 0; iIndex < radios.length ; iIndex++ ){
        if(radios[iIndex].checked){
            radio_type = radios[iIndex].value
            break;
        }
    }
	var type;
	var flag=getValueStorage("flag");
	if(flag=="arrive"){
		type=1
	}
	if(flag=="leave"){
		type=2
	}
	 //提交行动轨迹
	$.ajax({
	   type: "POST",
	   url: serverId+"ms/insertTrack",
	   data: {
	   			userId: userId,
	   			userName: userName,
	   			latitude: position.coords.latitude,
			    longitude: position.coords.longitude,
	   			customerId:customerId,
	   			type:type,
	   			radio_type:radio_type
	   	},
	   success: function(msg){
			_popup_tip("操作成功!");
			loading_tip_hide();
			$( "#current_position_panel" ).panel( "close" );
			$("#selectCustomerId").text( '' );
			$("#selectCustomerName").attr("style","display:none");
			$("#selectCustomerName").text( '' );
	   },
	   error: function () {
	   		loading_tip_hide();
            popup_tip("插入轨迹发生错误");
       }
	});
}
function enterprise_arrive(){
		if(!checkConnection()){
			return ;
		}
		var customerId=$("#selectCustomerId").text();
      	if(customerId!=""){
	      		var flag=getValueStorage("flag");
		        if(flag=="leave"||flag==null||flag==""){
		        		$.mobile.showPageLoadingMsg("a", "提交中...");
		        		saveUserInfoStorage("flag","arrive");
		        		navigator.geolocation.getCurrentPosition(onSuccess_enterprise_arrive, _onError);
		        }else{
		        	popup_tip("未离开上一家企业!");
		        }
      	}else{
      			popup_tip("请先选中要到达的企业!");
      	}
}

function onSuccess_enterprise_leave(position){
	saveUserInfoStorage("flag","leave");
	var userId=getValueStorage("userId");
    var userName=getValueStorage("userName");
	var customerId=getValueStorage("customerId");
	var type;
	var flag=getValueStorage("flag");
	if(flag=="arrive"){
		type=1
	}
	if(flag=="leave"){
		type=2
	}
	//提交行动轨迹
	$.ajax({
	   type: "POST",
	   url: serverId+"ms/insertTrack",
	   data: { 
	   			userId: userId,
	   			userName: userName,
	   			latitude: position.coords.latitude,
			    longitude: position.coords.longitude,
	   			customerId:customerId,
	   			type:type
	   	},
	   success: function(msg){
			_popup_tip("操作成功!");
			loading_tip_hide();
			$( "#current_position_panel" ).panel( "close" );
			$("#selectCustomerId").text( '' );
			$("#selectCustomerName").attr("style","display:none");
			$("#selectCustomerName").text( '' );
	   },
	   error: function () {
	   		loading_tip_hide();
            popup_tip("插入轨迹发生错误");
       }
	});
	
}
function enterprise_leave(){
		if(!checkConnection()){
			return ;
		}
		var customerId=$("#selectCustomerId").text();
      	if(customerId!=""){
	      		var flag=getValueStorage("flag");
		        if(flag=="arrive"){
		        	$.mobile.showPageLoadingMsg("a", "提交中...");
		        	navigator.geolocation.getCurrentPosition(onSuccess_enterprise_leave, _onError);
		        }else{
		        	popup_tip("您还未到达这家企业!");
		        }
	     }else{
	       		popup_tip("请先选中要离开的企业!");
	     } 
}

//*************当前 位置 结束

/**
 *拜访计划 开始
 */
function visit_plan(){
		if(!checkConnection()){
			return ;
		}
		var userId=getValueStorage("userId");
		$.ajax({
			   type: "POST",
			   url: serverId+"ms/findPlanCustomer",
			   data: {userId:userId,type:1},
			   success: function(msg){
			  	   var n=msg.list.length;
				   var htmlplan="";
					   if(n==0){
					   }else{
					   		for(var i=0; i<n; i++){
					   			htmlplan += "<div data-role='collapsible' data-collapsed='true' data-theme='b' data-content-theme='d'>"+
												"<h3>"+msg.list[i].name+"<span class='ui-icon ui-icon-shadow ui-icon-plus'></span></h3>"+
												"<p>介绍："+msg.list[i].intro+"</p>"+
												"<p>地址："+msg.list[i].address+"</p>"+
												"<p>备注："+msg.list[i].remarks+"</p>"+
											"</div>"	
					   		}
				   	   }
			   	   $("#visit_plan_panel_content").html(htmlplan).trigger( "create" );
			   	   $("#visit_plan_panel").panel("open");
			   },
			   error: function () {
	           }
		});
}
function visit_plan_show(){
	visit_plan();
}

//*************拜访 计划  结束

/**
 *客户 绑定 开始
 */
 function onSuccess_enterprise_submit( position ){
 	var name = $("#name").val();
	var intro = $("#intro").val();
	var address = $("#address").val();
	var remarks = $("#remarks").val();
	var radio_type;
	var radios = document.getElementsByName('_radio-choice');
	for (var iIndex = 0; iIndex < radios.length ; iIndex++ ){
        if(radios[iIndex].checked){
            radio_type = radios[iIndex].value
            break;
        }
    }
	if(name==""){
		popup_tip("请填写企业名称!");
	}else{
		$.mobile.showPageLoadingMsg("a", "提交中...");
		$.ajax({
		   type: "POST",
		   url: serverId+"ms/insertBusinessCustomer",
		   data: { 
		   			name: name,
		   			intro: intro,
		   			address: address,
		   			remarks: remarks,
		   			remarks_type: radio_type,
		   			latitude: position.coords.latitude,
			   		longitude: position.coords.longitude,
		   	},
		   success: function(msg){
				_popup_tip("数据提交成功!");
				enterprise_reset();
				loading_tip_hide();
				$( "#visit_custom_panel" ).panel( "close" );
		   },
		   error: function () {
		   		loading_tip_hide();
                popup_tip("提交错误");
           }
		});
	}
 }
 function enterprise_submit(){
 		if(!checkConnection()){
			return ;
		}
		navigator.geolocation.getCurrentPosition(onSuccess_enterprise_submit, _onError);
 }
 function enterprise_reset(){
 		$("#name").val("");
		$("#intro").val("");
		$("#address").val("");
		$("#linkman").val("");
		$("#phone").val("");
		$("#remarks").val("");
 }
 //*****************客户绑定  结束
 

 /**
 *拍照上传 开始
 */
 	var pictureSource; 
    var destinationType; 
    var url;
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
    }

    function onPhotoDataSuccess(imageData) {
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';
        smallImage.src = imageData;
        url=imageData;

    }
    
    function capturePhoto() {
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
            quality : 50,
            destinationType : navigator.camera.DestinationType.FILE_URI,//这里要用FILE_URI，才会返回文件的URI地址          
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType : Camera.EncodingType.JPEG,
            popoverOptions : CameraPopoverOptions,
            saveToPhotoAlbum : true
        });
    }
    
    function onFail(message) {
    }

    function uploadPhoto() {
    	if(!checkConnection()){
			return ;
		}
    	var userId=getValueStorage("userId");
		var caCustomerId=getValueStorage("caCustomerId");
		
		imageURI=url;
        var options = new FileUploadOptions();
        options.fileKey = "fileAddPic";//用于设置参数，对应form表单里控件的name属性
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        
        //这里的uri根据自己的需求设定，是一个接收上传图片的地址
        var uri = encodeURI(serverId+"ms/uploadPic/"+userId+"/"+caCustomerId);
        options.chunkedMode = false;
        var ft = new FileTransfer();
        ft.upload(imageURI, uri, win, fail, options);
    }

    function win(r) {
        popup_tip("图片上传成功");
        $( "#visit_camera_panel" ).panel( "close" );
    }

    function fail(error) {
        popup_tip("图片上传失败！");
        $( "#visit_remark_panel" ).panel( "close" );
    }
 
//*****************拍照上传 结束
 
 
 /**
 *添加项目 开始
 */
 function addprojectreset(){
		$("#projectname").val("");
		$("#projectintro").val("");
		$("#prCustomerId").text( "" );
		$("#prCustomerName").attr("style","display:none");
		$("#prCustomerName").text(" ");
}

function addprojectsubmit(){
		if(!checkConnection()){
			return ;
		}
		var userId=getValueStorage("userId");
		var prCustomerId=getValueStorage("prCustomerId");
		
		if(prCustomerId==""){
			popup_tip("请选中项目的企业!");
		}else{
			var projectname = $("#projectname").val();
			if(projectname==""){
				popup_tip("请商机名称!");
			}else{
				var projectintro = $("#projectintro").val();
				if(projectintro==""){
					popup_tip("请填写商机描述!");
				}else{
					$.mobile.showPageLoadingMsg("a", "提交中...");
					$.ajax({
					   type: "POST",
					   url: serverId+"ms/insertProject",
					   data: {userId:userId,customerId:prCustomerId,projectname:projectname,projectintro:projectintro},
					   success: function(msg){
							_popup_tip("数据提交成功!");
							loading_tip_hide();
							$( "#add_project_panel" ).panel( "close" );
							addprojectreset();
					   },
					   error: function () {
					   		loading_tip_hide();
			                popup_tip("提交错误");
			           }
					});
				}
			}
		}
}

//*****************添加项目 结束