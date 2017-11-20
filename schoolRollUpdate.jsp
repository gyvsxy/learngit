<%@ page contentType="text/html;charset=UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@ include file="/WEB-INF/views/include/inc.jsp"%>
<title>学籍异动</title>
<script type="text/javascript" src="${ctx}/js/stu/schoolRollUpdate.js"></script>
<link rel="stylesheet" href="${ctx}/CSS/main.css">
<style>
.layui-tab{margin: 10px 30px;}
.my-input-box {
    margin: 20px 0px;
}
.label-box {
    width: 100px;
}
.test {
    margin: 0px 0px;
}
#rollUpdateRecordPage{width:98%;}
.tableWrap{
    width: 100%;
    overflow-y: hidden;
}
</style>
</head>
<body>
	<!-- 选项卡 -->
	<div class="layui-tab layui-tab-brief">
	  <ul class="layui-tab-title">
	    <li id="rollUpdate" onclick="rollUpdate()">学生学籍变更</li>
	    <li id="rollUpdateRecord" onclick="rollUpdateRecord()">学籍变更记录</li>
	  </ul>
	</div>
	<!-- 学生学籍变更页面 -->
	<div id="rollUpdatePage" style="display: none">
		<div class="list-input">
			<label class="test-a" >学号：</label>
			<input type="text"  id="stuNumber" class="my-first-input" placeholder="请输入学号">
		</div>
		<div class="list-input">
			<label class="test-a" >身份证号：</label>
			<input type="text"  id="idCard" class="my-first-input" placeholder="请输入身份证号">
		</div>
		<input class="my-button resetmargin" type="button" id="findStudent" value="查询">
		<!-- 内容 -->
		<div class="layui-tab-item" id="studentMsgId" style="width:95%;height:400px;clear:both;margin:0 auto;position:relative; display: none">
			<!-- 左照片 -->
			<div style="position:absolute;width:130px;height:160px;top:22px;left:50px;">
 				<img id="photoPath" src="/dcweb/static/images/head.jpg"  style ="width:100%;height: 100%;">
 			</div>	
  			<!-- 中 -->
			<div style="float:left; width:400px;height:100%;margin-left:150px;">
				<span id="stuCodeSpace" style="display: none"></span>
				<div class="my-input-box">
					<div class="label-box">
		    			<label class="test">学号：</label>
		    		</div>
		    		<span id="stuNumberSpace"></span>
				</div>
				<div class="my-input-box">
					<div class="label-box">
		    		<label class="test">年制：</label>
		    		</div>
					<span id="yearsSpace"></span>
				</div>
				<div class="my-input-box">
					<div class="label-box">
		    		<label class="test">姓名：</label>
		    		</div>
					<input type="text" lay-verify="code" placeholder="请输入姓名" id="nameSpace" class="my-first-input">
				</div>
				<div class="my-input-box">
					<div class="label-box">
		    		<label class="test">性别：</label>
		    		</div>
				<select id="genderSpace" class="my-first-input">
						<option value=''>请选择性别</option>
							<option value="1">男</option>
							<option value="2">女</option>
					</select>
				</div>
				<div class="my-input-box">
					<div class="label-box">
		    		<label class="test">身份证号：</label>
		    		</div>
					<input type="text" lay-verify="code" placeholder="请输入身份证号" id="idCardSpace" class="my-first-input">
				</div>
				<div class="my-input-box">
					<div class="label-box">
		    		<label class="test">联系方式：</label>
		    		</div>
					<input type="text" lay-verify="code" placeholder="请输入联系方式" id="phoneSpace" class="my-first-input">
				</div>
			</div>
			<!-- 右 -->
			<div style="margin-left: 10px;float:left; width:400px;height:100%;">
				<div class="my-input-box">
					<div class="label-box">
		    		<label class="test">院系：</label>
		    		</div>
					<select id="deptSpace" class="my-first-input">
					</select>
				</div>
				<div class="my-input-box">
					<div class="label-box">
		    		<label class="test">专业：</label>
		    		</div>
					<select id="majorSpace" class="my-first-input">
					</select>
				</div>
				<div class="my-input-box">
					<div class="label-box">
		    		<label class="test">年级：</label>
		    		</div>
					<select id="yearSpace" class="my-first-input">
					</select>
				</div>
				<div class="my-input-box">
					<div class="label-box">
		    		<label class="test">班级：</label>
		    		</div>
					<select id="classSpace" class="my-first-input">
					</select>
				</div>
				<div class="my-input-box">
					<div class="label-box">
		    		<label class="test">学籍状态：</label>
		    		</div>
					<select id="statusSpace" class="my-first-input">
						<option value="">请选择学籍</option>
						<option value="1">在校</option>
						<option value="2">休学</option>
						<option value="3">退学</option>
						<option value="4">毕业</option>
						<option value="5">开除</option>
						<option value="6">入伍</option>
					</select>
				</div>
				<div class="my-input-box">
					<div class="label-box">
		    		<label class="test" >备注：</label>
		    		</div>
					 <textarea name="comment" style="min-height:20px;width:205px;position:relative" class="innerComment" id="remarkSpace" maxlength='100'></textarea>
				</div>
				<div class="my-input-box" style="text-align:center">
					<input type="button" value="保存" class="down-btn" onclick="saveStudentMsg()">
				</div>
			</div>
			<!-- 个人学籍变更记录 -->
			<div class="tableWrap" >
			<table id="change_table" class="layui-table my-table" align="center" style="width:1600px;margin-left:30px;">
				<thead>
					<tr>
						<th class='mulcheck0'>序号</th>
						<th style="width:150px;">操作时间</th>
						<th style="width:100px;">操作人</th>
						<th style="width:100px;">姓名</th>
						<th>性别</th>
						<th style="width:130px;">学号</th>
						<th style="width:180px;">身份证号</th>
						<th style="width:130px;">联系方式</th>
						<th>年级</th>
						<th style="width:130px;">院系</th>
						<th style="width:130px;">专业</th>
						<th style="width:130px;">班级</th>
						<th style="width:80px;">学籍状态</th>
						<th style="width:130px;">备注</th>
					</tr>
				</thead>
				<tbody id="recordByOne" align="center">
				</tbody>
			</table>
			</div>	
		</div>
      </div>
	<!-- 学籍变更记录页面 -->
	<div id="rollUpdateRecordPage" style="display: none">
		<div class="list-input">
			<label class="test-a" >学号：</label>
			<input type="text"  id="stuNumberForList" class="my-first-input" placeholder="请输入学号">
		</div>
		<!-- 年级 -->
		<div class="list-input">
			<label class="test-a">年级：</label>
			<input id="year" onFocus="WdatePicker({isShowClear:false,readOnly:true,dateFmt:'yyyy'})" value='${nowYear}' class="query_input my-first-input"/>
        </div>
		<!--学院下拉框 -->
		<div class="list-input">
			<label class="test-a">学院：</label> 
			<select id="deptSelect" class="my-first-input dept" onchange="selectDept()">
				<option value=''>请选择学院</option>
				<c:forEach items="${depts}" var="d">
						<option value="${d.dept_id}">${d.dept_name}</option>
					</c:forEach>
			</select>
		</div>
		<!-- 专业下拉框 -->
		<div class="list-input" >
			<label class="test-a">专业：</label> 
			<select id="majorSelect" class="my-first-input" onchange="selectMajor()">
				<option value='' id="noneMajor">请选择专业</option>
			</select>
		</div>
		<!-- 学籍状态 -->
		<div class="list-input" >
			<label class="test-a">学籍状态：</label> 
			<select id="statusSelect" class="my-first-input" onchange="selectStatus()">
				<option value=''>请选择学籍状态</option>
				<option value='1'>在校</option>
				<option value='2'>休学</option>
				<option value='3'>退学</option>
				<option value='4'>毕业</option>
				<option value='6'>入伍</option>
				<option value='5'>开除</option>
			</select>
		</div>
		<!-- 日期选择 -->
		<div class="list-input" style="width:420px;margin-left: 30px;">
			<label class="test-a" style="width:84px;">起止日期：</label>
			<input type="text"  id="startTime" name="beginDate" lay-verify="date" placeholder="请选择开始日期" autocomplete="off"  onclick="layui.laydate({elem: this})">			
			-
			<input type="text" id="endTime" name="endDate" lay-verify="date" placeholder="请选择结束日期" autocomplete="off"  onclick="layui.laydate({elem: this})">	
		</div>	
		<div class="list-input">
		<input  type="button" class="my-button" id="searchBtn" value="查询" style="margin-left:30px;">
		<input  type="button"  class="my-button" id="clearBtn" value="清空">
		<input  type="button"  class="my-button" id="outBtn" value="导出" >
		</div>
		<!-- 表格 -->
		<div class="tableWrap" >
			<table class="layui-table my-table" align="center" style="width:1600px;margin-left:30px;">
				<thead>
					<tr>
						<th class='mulcheck0'>序号</th>
						<th style="width:150px;">操作时间</th>
						<th style="width:100px;">操作人</th>
						<th style="width:100px;">姓名</th>
						<th>性别</th>
						<th style="width:130px;">学号</th>
						<th style="width:180px;">身份证号</th>
						<th style="width:130px;">联系方式</th>
						<th>年级</th>
						<th style="width:130px;">院系</th>
						<th style="width:130px;">专业</th>
						<th style="width:130px;">班级</th>
						<th style="width:80px;">学籍状态</th>
						<th style="width:130px;">备注</th>
					</tr>
				</thead>
				<tbody id="tableBody" align="center">
				</tbody>
			</table>
		</div>
		<!-- 分页 -->
		<div class="foot">
			<div id="page"></div></div>
		</div><br>
		
	</div>
</body>
</html>