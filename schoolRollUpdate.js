var curr = 1;
var pageSize = 10;
var params = null;
$(function(){
	//先渲染一个tab按钮
	$("#rollUpdate").attr('class','layui-this');
	$("#rollUpdatePage").show();
	//再每次点击渲染tab按钮
	$(".layui-tab-title").children().click(function(){
		$(".layui-tab-title").children().each(function(){
			$(this).attr('class','');
		})
		$(this).attr('class','layui-this');
	})
	//起止日期控件
	layui.use(['form', 'layedit', 'laydate','element'], function(){
     	 var form = layui.form();
     	  var $ = layui.jquery
     	  ,layer = layui.layer
     	  ,layedit = layui.layedit
     	  ,laydate = layui.laydate;
     	  
     	  var laydate = layui.laydate;
     	  
     	  var start = {
     	    min: '1995-06-16 23:59:59'
     	    ,max: '2099-06-16 23:59:59'
     	    ,istoday: false
     	    ,choose: function(datas){
     	      end.min = datas; //开始日选好后，重置结束日的最小日期
     	      end.start = datas //将结束日的初始值设定为开始日
     	    }
     	  };
     	  
     	  var end = {
     	    min: '1995-06-16 23:59:59'
     	    ,max: '2099-06-16 23:59:59'
     	    ,istoday: false
     	    ,choose: function(datas){
     	      start.max = datas; //结束日选好后，重置开始日的最大日期
     	    }
     	  };
     	  
     	  document.getElementById('startTime').onclick = function(){
     	    start.elem = this;
     	    laydate(start);
     	  }
     	  document.getElementById('endTime').onclick = function(){
     	    end.elem = this
     	    laydate(end);
     	  }
     });
	//查询记录处加载专业下拉列表
	$('#deptSelect').change(function(){
		$('#majorSelect').empty();
		$('#majorSelect').append('<option value="" id="noneMajor">请选择专业</option>');
		var deptId = $('#deptSelect').val();
		$.ajax({
			url: ctx +"/schoolRoll/changeMajor?deptId="+deptId,
			dataType: "json",
			type: 'post',
			success : function(data){
				var result = data.majorList;
				for(var i=0;i<result.length;i++){
					$("#majorSelect").append('<option value="'+result[i].majorId+'">'+result[i].majorName+'</option>');
					}
				}
			})
	})
	//个人信息处异步异步加载学院及专业信息
	$('#deptSpace').change(function(){
		$('#majorSpace').empty();
		$('#majorSpace').append('<option value="">请选择专业</option>');
		var deptId = $('#deptSpace').val();
		$.ajax({
			url: ctx +"/schoolRoll/changeMajor?deptId="+deptId,
			dataType: "json",
			type: 'post',
			success : function(data){
				var result = data.majorList;
				for(var i=0;i<result.length;i++){
					$("#majorSpace").append('<option value="'+result[i].majorId+'">'+result[i].majorName+'</option>');
				}
			}
		})
	})
	//个人信息处变更年级和专业 异步加载班级
	$('#majorSpace').change(function(){
		$('#classSpace').empty();
		$('#classSpace').append('<option value="">请选择班级</option>');
		$.ajax({
			url: ctx +"/schoolRoll/findclass",
			contentType: 'application/x-www-form-urlencoded',
			dataType: "json",
			type: 'post',
			data: {"grade": $('#classSpace').val(),"majorId": $('#majorSpace').val()},
			success: function(data){
				var result = data.classList;
				var length = result.length;
				for(var i =0; i < length; i ++){
					$("#classSpace").append('<option value="'+result[i].classId+'">'+result[i].className+'</option>');
				}
			}
		})
	})
	$('#yearSpace').change(function(){
		$('#classSpace').empty();
		$('#classSpace').append('<option value="">请选择班级</option>');
		$.ajax({
			url: ctx +"/schoolRoll/findclass",
			contentType: 'application/x-www-form-urlencoded',
			dataType: "json",
			type: 'post',
			data: {"grade": $('#classSpace').val(),"majorId": $('#majorSpace').val()},
			success: function(data){
				var result = data.classList;
				var length = result.length;
				for(var i =0; i < length; i ++){
					$("#classSpace").append('<option value="'+result[i].classId+'">'+result[i].className+'</option>');
				}
			}
		})
	})
	//查询单个学生
	$('#findStudent').click(function(){
		var stuNumber = $('#stuNumber').val();
		var idCard = $('#idCard').val();
		if(stuNumber == '' && idCard == ''){
			alert("请输入查询条件！");
			return;
		}
		
		loadStudent(stuNumber, idCard);
		loadTableByOne(stuNumber, idCard);
		
	})
	//查询学籍异动记录
	$('#searchBtn').click(function(){
		params ={
				'stuNumber' : $('#stuNumberForList').val(),
				'startTime' : $('#startTime').val(),
				'endTime' : $('#endTime').val(),
				'year' : $('#year').val(),
				'dept' : $('#deptSelect').val(),
				'major' : $('#majorSelect').val(),
				'status' : $('#statusSelect').val(),
		}

		curr = 1;
		loadTable();
	})
	//清空查询条件
	$('#clearBtn').click(function(){
		//loadTableByOne(stuNumber, idCard);
	
		
		$('#stuNumberForList').val('');
		$('#startTime').val('');
		$('#endTime').val('');
		
		params ={
				'stuNumber' : $('#stuNumberForList').val(),
				'startTime' : $('#startTime').val(),
				'endTime' : $('#endTime').val(),
				'year' : $('#year').val(),
				'dept' : $('#deptSelect').val(),
				'major' : $('#majorSelect').val(),
				'status' : $('#statusSelect').val(),
		}

		curr = 1;
		loadTable();
	
	
	
		
		//重置起止日期控件
		layui.use(['form', 'layedit', 'laydate','element'], function(){
	     	 var form = layui.form();
	     	  var $ = layui.jquery
	     	  ,layer = layui.layer
	     	  ,layedit = layui.layedit
	     	  ,laydate = layui.laydate;
	     	  
	     	  var laydate = layui.laydate;
	     	  
	     	  var start = {
	     	    min: '1995-06-16 23:59:59'
	     	    ,max: '2099-06-16 23:59:59'
     	       ,istoday: false
	     	    ,choose: function(datas){
	     	      end.min = datas; //开始日选好后，重置结束日的最小日期
	     	      end.start = datas //将结束日的初始值设定为开始日
	     	    }
	     	  };
	     	  
	     	  var end = {
	     	    min: '1995-06-16 23:59:59'
	     	    ,max: '2099-06-16 23:59:59'
	     	    ,istoday: false
	     	    ,choose: function(datas){
	     	      start.max = datas; //结束日选好后，重置开始日的最大日期
	     	    }
	     	  };
	     	  
	     	  document.getElementById('startTime').onclick = function(){
	     	    start.elem = this;
	     	    laydate(start);
	     	  }
	     	  document.getElementById('endTime').onclick = function(){
	     	    end.elem = this
	     	    laydate(end);
	     	  }
	     });
		$('#year').val('2017');
		$('#deptSelect').val('');
		$('#majorSelect').val('');
		$('#statusSelect').val('');
	})
	//导出
	$('#outBtn').click(function(){
		params ={
				'stuNumber' : $('#stuNumberForList').val(),
				'startTime' : $('#startTime').val(),
				'endTime' : $('#endTime').val(),
				'year' : $('#year').val(),
				'dept' : $('#deptSelect').val(),
				'major' : $('#majorSelect').val(),
				'status' : $('#statusSelect').val(),
		}
		window.location.href = getUrl({url: ctx + "/schoolRoll/outPrint", params : params});
	})
})
//导出拼接
	function getUrl(options){
		var url = options.url;
		var params = options.params;
		var i = 0;
		for(key in params){
			if(i == 0){
				url += '?' + key + '=' + params[key];
			}else{
				url += '&' + key + '=' + params[key];
			}
			i ++;
		}
		return url;
	}
/*时间格式转换*/
var format = function(time, format) {
    var t = new Date(time);
    var tf = function(i) {
        return (i < 10 ? '0': '') + i
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g,
    function(a) {
        switch (a) {
        case 'yyyy':
            return tf(t.getFullYear());
            break;
        case 'MM':
            return tf(t.getMonth() + 1);
            break;
        case 'mm':
            return tf(t.getMinutes());
            break;
        case 'dd':
            return tf(t.getDate());
            break;
        case 'HH':
            return tf(t.getHours());
            break;
        case 'ss':
            return tf(t.getSeconds());
            break;
        }
    });
}
//切换至修改页面
function rollUpdate(){
	$("#rollUpdatePage").show();
	$("#rollUpdateRecordPage").hide();

}
//切换至记录页面
function rollUpdateRecord(){
	$("#rollUpdateRecordPage").show();
	$("#rollUpdatePage").hide();
}
//清理个人信息
function clearSelect(){
	$('#photoPath').attr('src', '/dcweb/static/images/head.jpg');
	$('#stuCodeSpace').text('');
	$('#stuNumberSpace').text('');
	$('#yearsSpace').text('');
	$('#nameSpace').val('');
	$('#genderSpace').val('');
	$('#idCardSpace').val('');
	$('#phoneSpace').val('');
	$('#deptSpace').empty();
	$('#deptSpace').append('<option value="">请选择院系</option>');
	$('#majorSpace').empty();
	$('#majorSpace').append('<option value="">请选择专业</option>');
	$('#yearSpace').empty();
	$('#yearSpace').append('<option value="">请选择年级</option>');
	$('#classSpace').empty();
	$('#classSpace').append('<option value="">请选择班级</option>');
	$('#statusSpace').val('');
	$('#remarkSpace').val('');

}

/**
 * 查询单个学生信息
 * @returns
 */
function loadStudent(stuNumber, idCard){
	clearSelect();

	$.ajax({
		url: ctx +"/schoolRoll/findStudentMsg",
		dataType: "json",
		type: 'post',
		contentType: 'application/x-www-form-urlencoded',
		data: {'stuNumber':stuNumber,'idCard':idCard},
		success: function(data){
			if(data.code == '1'){
				alert(data.errorMsg);
				return;
			}
			var msg = data.data;
			if(msg == null){
				alert("查询无结果");
				
				$('#studentMsgId').hide();
				return;
				
			}
			
			//显示个人信息栏
			$('#studentMsgId').show();
			if(msg.photoPath.substring(0,4) == 'http'){
				$('#photoPath').attr('src', msg.photoPath);
			}else{
				$('#photoPath').attr('src', ctx + msg.photoPath);
			}
			$('#stuCodeSpace').text(msg.stuCode);
			$('#stuNumberSpace').text(msg.stuNumber);
			$('#yearsSpace').text(msg.years+'年制');
			$('#nameSpace').val(msg.name);
			$('#genderSpace').val(msg.gender);
			$('#idCardSpace').val(msg.idCard);
			$('#phoneSpace').val(msg.phone);
			//异步加载学院
			$.ajax({
				url: ctx +"/schoolRoll/findDept",
				dataType: "json",
				type: 'post',
				success: function(data){
					var result = data.depts;
					var length = result.length;
					for(var i =0; i < length; i ++){
						if(msg.dept == result[i].dept_id){
							$("#deptSpace").append('<option selected="selected" value="'+result[i].dept_id+'">'+result[i].dept_name+'</option>');
						}else{
							$("#deptSpace").append('<option value="'+result[i].dept_id+'">'+result[i].dept_name+'</option>');
						}
					}
				}
			})
			//异步加载专业
			$.ajax({
				url: ctx +"/schoolRoll/changeMajor?deptId="+msg.dept,
				dataType: "json",
				type: 'post',
				success: function(data){
					var result = data.majorList;
					var length = result.length;
					for(var i =0; i < length; i ++){
						if(msg.major == result[i].majorId){
							$("#majorSpace").append('<option selected="selected" value="'+result[i].majorId+'">'+result[i].majorName+'</option>');
						}else{
							$("#majorSpace").append('<option value="'+result[i].majorId+'">'+result[i].majorName+'</option>');
						}
					}
				}
			})
			//加载年级
			$.ajax({
				url: ctx +"/schoolRoll/findYear",
				dataType: "json",
				type: 'post',
				success: function(data){
					var result = data.yearList;
						if(msg.year == result.val){
							$("#yearSpace").append('<option selected="selected" value="'+result.val+'">'+result.val+'</option>');
						}else{
							var i = result.val - msg.year;
							for(var j = 0; j < i; j ++){
								var k = result.val-j;
								$("#yearSpace").append('<option value="'+k+'">'+k+'</option>');
							}
							$("#yearSpace").append('<option selected="selected" value="'+msg.year+'">'+msg.year+'</option>');
						}
				}
			})
			//异步加载班级
			$.ajax({
				url: ctx +"/schoolRoll/findclass",
				contentType: 'application/x-www-form-urlencoded',
				dataType: "json",
				type: 'post',
				data: {"grade": msg.year,"majorId": msg.major},
				success: function(data){
					var result = data.classList;
					var length = result.length;
					for(var i =0; i < length; i ++){
						if(msg.classGrade == result[i].classId){
							$("#classSpace").append('<option selected="selected" value="'+result[i].classId+'">'+result[i].className+'</option>');
						}else{
							$("#classSpace").append('<option value="'+result[i].classId+'">'+result[i].className+'</option>');
						}
					}
				}
			})
			$('#statusSpace').val(msg.status);
			$('#remarkSpace').val(msg.remark);
//加载下面的表格
			loadTableByOne(stuNumber, idCard);
//			$.ajax({
//				url: ctx +"/schoolRoll/findTableByOne",
//				dataType: "json",
//				type: 'post',
//				contentType: 'application/x-www-form-urlencoded',
//				data: {'stuNumber':stuNumber,'idCard':idCard},
//				success: function(data){
//					var str = '';
//					var list = data.list;
//					for(var i = 0; i < list.length; i ++){
//						var nums = ((10*(curr-1))+i+1);
//						var formatDate= format(list[i].createDate, 'yyyy-MM-dd HH:mm:ss');
//						var status = '';
//						if(list[i].status == 1){
//							status = '在校';
//						}else if(list[i].status == 2){
//							status = '休学';
//						}else if(list[i].status == 3){
//							status = '退学';
//						}else if(list[i].status == 4){
//							status = '毕业';
//						}else if(list[i].status == 5){
//							status = '开除';
//						}else if(list[i].status == 6){
//							status = '入伍';
//						}
//						//非空判断
//						if(list[i].username == null){
//							list[i].username = '';
//						}
//						if(list[i].className == null){
//							list[i].className = '';
//						}
//						if(list[i].phone == null){
//							list[i].phone = '';
//						}
//						if(list[i].remark == null){
//							list[i].remark = '';
//						}
//						str += '<tr><td>'+nums+'</td>' +
//							   '<td>'+formatDate+'</td>' +
//							   '<td>'+list[i].username+'</td>' +
//							   '<td>'+list[i].name+'</td>' +
//							   '<td>'+list[i].gender+'</td>' +
//							   '<td>'+list[i].stuNumber+'</td>' +
//							   '<td>'+list[i].idCard+'</td>' +
//							   '<td>'+list[i].phone+'</td>' +
//							   '<td>'+list[i].year+'</td>' +
//							   '<td>'+list[i].deptName+'</td>' +
//							   '<td>'+list[i].majorName+'</td>' +
//							   '<td>'+list[i].className+'</td>' +
//							   '<td>'+status+'</td>' +
//							   '<td>'+list[i].remark+'</td></tr>';
//					}
//					$('#recordByOne').html(str);
//					},
//				error: function(){
//					alert("个人记录加载失败");
//				}
//				})
		}
	})
}

//保存学籍修改
function saveStudentMsg(){
	var stuParam = {
		'stuCode' : $('#stuCodeSpace').text(),
		'stuNumber' : $('#stuNumberSpace').text(),
		'name' : $('#nameSpace').val(),
		'gender' : $('#genderSpace').val(),
		'idCard' : $('#idCardSpace').val(),
		'phone' : $('#phoneSpace').val(),
		'dept' : $("#deptSpace").val(),
		'major' : $("#majorSpace").val(),
		'year' : $("#yearSpace").val(),
		'classGrade' : $("#classSpace").val(),
		'status' : $('#statusSpace').val(),
		'remark' : $('#remarkSpace').val(),
	}
	if($('#nameSpace').val() != '' && $('#genderSpace').val() != '' && $('#idCardSpace').val() != '' &&
	   $('#phoneSpace').val() != '' && $("#majorSpace").val() != '' && $("#yearSpace").val() != '' &&
	   $("#classSpace").val() != '' && $('#statusSpace').val() != ''){
		//开始保存
		$.ajax({
			url: ctx +"/schoolRoll/saveStudentMsg",
			dataType: "json",
			type: 'post',
			contentType: 'application/x-www-form-urlencoded',
			data: stuParam,
			success: function(data){
				if(data.code == '0'){
					alert(data.success);
					loadTableByOne($('#stuNumber').val(), $('#idCard').val());
//					//加载下面的表格
//					$.ajax({
//						url: ctx +"/schoolRoll/findTableByOne",
//						dataType: "json",
//						type: 'post',
//						contentType: 'application/x-www-form-urlencoded',
//						data: {'stuNumber':$('#stuNumber').val(),'idCard':$('#idCard').val()},
//						success: function(data){
//							var str = '';
//							var list = data.list;
//							for(var i = 0; i < list.length; i ++){
//								var nums = ((10*(curr-1))+i+1);
//								var formatDate= format(list[i].createDate, 'yyyy-MM-dd HH:mm:ss');
//								var status = '';
//								if(list[i].status == 1){
//									status = '在校';
//								}else if(list[i].status == 2){
//									status = '休学';
//								}else if(list[i].status == 3){
//									status = '退学';
//								}else if(list[i].status == 4){
//									status = '毕业';
//								}else if(list[i].status == 5){
//									status = '开除';
//								}else if(list[i].status == 6){
//									status = '入伍';
//								}
//								//非空判断
//								if(list[i].username == null){
//									list[i].username = '';
//								}
//								if(list[i].className == null){
//									list[i].className = '';
//								}
//								if(list[i].phone == null){
//									list[i].phone = '';
//								}
//								if(list[i].remark == null){
//									list[i].remark = '';
//								}
//								str += '<tr><td>'+nums+'</td>' +
//									   '<td>'+formatDate+'</td>' +
//									   '<td>'+list[i].username+'</td>' +
//									   '<td>'+list[i].name+'</td>' +
//									   '<td>'+list[i].gender+'</td>' +
//									   '<td>'+list[i].stuNumber+'</td>' +
//									   '<td>'+list[i].idCard+'</td>' +
//									   '<td>'+list[i].phone+'</td>' +
//									   '<td>'+list[i].year+'</td>' +
//									   '<td>'+list[i].deptName+'</td>' +
//									   '<td>'+list[i].majorName+'</td>' +
//									   '<td>'+list[i].className+'</td>' +
//									   '<td>'+status+'</td>' +
//									   '<td>'+list[i].remark+'</td></tr>';
//							}
//							$('#recordByOne').html(str);
//							},
//						error: function(){
//							alert("个人记录加载失败");
//						}
//						})
				}else if(data.code == '100000'){
					alert(data.msg);
				}else{
					alert(data.msg+',错误码：'+data.code);
				}
			}
		})
	}else{
		alert('请将信息填写完整！');
	}
	
}

//返回按钮
function backBtn(){
	//清空
	clearSelect();
	//隐藏个人信息栏
	$('#studentMsgId').hide();
}

/**
 * 查询学籍异动记录
 * @returns
 */
function loadTable(currs){
	var data = params;
	if(currs != null){
		curr = currs;
	}
	data.pageNum = curr;
	data.pageSize = pageSize;
	$.ajax({
		url: ctx +"/schoolRoll/findList",
		dataType: "json",
		type: 'post',
		contentType: 'application/x-www-form-urlencoded',
		data: data,
		success: function(data){
			
				var str = '';
				var list = data.list.list;
				for(var i = 0; i < list.length; i ++){
					var nums = ((10*(curr-1))+i+1);
					var formatDate= format(list[i].createDate, 'yyyy-MM-dd HH:mm:ss');
					var status = '';
					if(list[i].status == 1){
						status = '在校';
					}else if(list[i].status == 2){
						status = '休学';
					}else if(list[i].status == 3){
						status = '退学';
					}else if(list[i].status == 4){
						status = '毕业';
					}else if(list[i].status == 5){
						status = '开除';
					}else if(list[i].status == 6){
						status = '入伍';
					}
					//非空判断
					if(list[i].username == null){
						list[i].username = '';
					}
					if(list[i].className == null){
						list[i].className = '';
					}
					if(list[i].phone == null){
						list[i].phone = '';
					}
					if(list[i].remark == null){
						list[i].remark = '';
					}
					str += '<tr><td>'+nums+'</td>' +
						   '<td>'+formatDate+'</td>' +
						   '<td>'+list[i].username+'</td>' +
						   '<td>'+list[i].name+'</td>' +
						   '<td>'+list[i].gender+'</td>' +
						   '<td>'+list[i].stuNumber+'</td>' +
						   '<td>'+list[i].idCard+'</td>' +
						   '<td>'+list[i].phone+'</td>' +
						   '<td>'+list[i].year+'</td>' +
						   '<td>'+list[i].deptName+'</td>' +
						   '<td>'+list[i].majorName+'</td>' +
						   '<td>'+list[i].className+'</td>' +
						   '<td>'+status+'</td>' +
						   '<td>'+list[i].remark+'</td></tr>';
				}
			$('#tableBody').html(str);
			layui.use(['laypage', 'layer'], function(){
				var laypage = layui.laypage,
				layer = layui.layer;
				laypage({
					cont : 'page',
					pages : data.list.pages,
					skip : true,
					curr : curr,
					jump : function(obj, first) {
						newpage = obj.curr;
						if (!first) {
							loadTable(newpage);
						}
					}
				})
			})
		},
	})
}
//加载下面的表格
 function loadTableByOne(stuNumber, idCard){
	 $.ajax({
			url: ctx +"/schoolRoll/findTableByOne",
			dataType: "json",
			type: 'post',
			contentType: 'application/x-www-form-urlencoded',
			data: {'stuNumber':stuNumber,'idCard':idCard},
			success: function(data){
				
				var str = '';
				var list = data.list;
				if(list.length == 0) {
					$("#change_table").hide();
				}else {
					$("#change_table").show();
				}
				for(var i = 0; i < list.length; i ++){
					var nums = ((10*(curr-1))+i+1);
					var formatDate= format(list[i].createDate, 'yyyy-MM-dd HH:mm:ss');
					var status = '';
					if(list[i].status == 1){
						status = '在校';
					}else if(list[i].status == 2){
						status = '休学';
					}else if(list[i].status == 3){
						status = '退学';
					}else if(list[i].status == 4){
						status = '毕业';
					}else if(list[i].status == 5){
						status = '开除';
					}else if(list[i].status == 6){
						status = '入伍';
					}
					//非空判断
					if(list[i].username == null){
						list[i].username = '';
					}
					if(list[i].className == null){
						list[i].className = '';
					}
					if(list[i].phone == null){
						list[i].phone = '';
					}
					if(list[i].remark == null){
						list[i].remark = '';
					}
					str += '<tr><td>'+nums+'</td>' +
						   '<td>'+formatDate+'</td>' +
						   '<td>'+list[i].username+'</td>' +
						   '<td>'+list[i].name+'</td>' +
						   '<td>'+list[i].gender+'</td>' +
						   '<td>'+list[i].stuNumber+'</td>' +
						   '<td>'+list[i].idCard+'</td>' +
						   '<td>'+list[i].phone+'</td>' +
						   '<td>'+list[i].year+'</td>' +
						   '<td>'+list[i].deptName+'</td>' +
						   '<td>'+list[i].majorName+'</td>' +
						   '<td>'+list[i].className+'</td>' +
						   '<td>'+status+'</td>' +
						   '<td>'+list[i].remark+'</td></tr>';
				}
				$('#recordByOne').html(str);
				},
			error: function(){
				alert("个人记录加载失败");
			}
			})
 }