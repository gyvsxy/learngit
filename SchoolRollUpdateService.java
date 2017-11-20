package com.bigdata.campus.stu.service;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bigdata.campus.common.base.CrudService;
import com.bigdata.campus.common.utils.DateUtil;
import com.bigdata.campus.common.utils.DateUtils;
import com.bigdata.campus.common.utils.excel.ExcelUtil;
import com.bigdata.campus.edu.dao.ClazzDao;
import com.bigdata.campus.edu.dao.MajorDao;
import com.bigdata.campus.edu.entity.Clazz;
import com.bigdata.campus.edu.entity.Major;
import com.bigdata.campus.stu.dao.SchoolRollUpdateDao;
import com.bigdata.campus.stu.vo.SchoolRollUpdateVO;
import com.bigdata.campus.sys.dao.DepartmentDao;
import com.bigdata.campus.sys.entity.Department;
import com.bigdata.campus.sys.entity.User;
import com.bigdata.campus.util.UserUtils;
import com.github.pagehelper.PageInfo;

/**
 * 功能描述：学籍异动的业务逻辑层
 * @author gaoyuan
 * 时间：2017.10.24
 */
@Service
public class SchoolRollUpdateService extends CrudService<SchoolRollUpdateDao, SchoolRollUpdateVO>{
	
	private static final Logger log = Logger.getLogger(SchoolRollUpdateService.class);
	@Autowired
	DepartmentDao departmentDao;
	@Autowired
	MajorDao majorDao;
	@Autowired
	ClazzDao clazzDao;
	
	/**
	* @Description: 获取所有教学单位下拉列表信息
	* @return List<Department>
	* @throws
	 */
	public List<Department> findDepts() {
		List<Department> deptList = departmentDao.deptNameList();
		return deptList;
	} 

	/**
	 * 获取专业下拉列表信息
	 * @param deptId
	 * @return List<Major>
	 * @throws Exception
	 */
	public List<Major> findMajorList(String deptId) throws Exception{
		List<Major> majorList = null;
		majorList = majorDao.findMajorName(deptId);
		return majorList;
	}
	/**
	 * 获取班级下拉列表信息
	 * @param Clazz
	 * @return List<Clazz>
	 * @throws Exception
	 */
	public List<Clazz> findClassList(Clazz clazz) throws Exception{
		String majorId = String.valueOf(clazz.getMajorId());
		String grade = clazz.getGrade();
		return clazzDao.findClassByMajor(majorId, grade);
	}
	
	/**
	 * 获取单个学生学籍信息
	 * @param schoolRollUpdateVO
	 * @return SchoolRollUpdateVO
	 */
	@Transactional(readOnly = false)
	public SchoolRollUpdateVO findStudent(SchoolRollUpdateVO schoolRollUpdateVO){
		log.info("获取单个学生学籍信息业务。。。");
		SchoolRollUpdateVO studentMsg = dao.get(schoolRollUpdateVO);
		if(studentMsg != null){
			int updateIncompleteStudent = updateIncompleteStudent(studentMsg);
			if(updateIncompleteStudent > 0){
				log.info("信息补全完成。。。");
			}else{
				log.info("信息补全失败。。。");
			}
		}
		return studentMsg;
	}
	/**
	 * 由于数据库更改的问题  学籍表的姓名、性别、手机号、班级没有数据，所以在单个查询时直接进行添加
	 * @param schoolRollUpdateVO
	 * @return int
	 */
	@Transactional(readOnly = false)
	public int updateIncompleteStudent(SchoolRollUpdateVO schoolRollUpdateVO){
		int flag = 0;
		if(dao.findIncompleteMsg(schoolRollUpdateVO) != null){
			flag = dao.updateIncompleteMsg(schoolRollUpdateVO);
		}
		return flag;
	}
	/**
	 * 保存修改单个学生学籍信息
	 * @param schoolRollUpdateVO
	 * @return boolean
	 */ 
	@Transactional(readOnly = false)
	public int saveMsg(SchoolRollUpdateVO schoolRollUpdateVO){
		log.info("保存修改单个学生学籍信息业务。。。");
		int flag = 0;
		//先对比有没有做修改   没做修改不允许提交
		SchoolRollUpdateVO findDifferentMsg = dao.findDifferentMsg(schoolRollUpdateVO);
		if(findDifferentMsg.getName().equals(schoolRollUpdateVO.getName()) &&
		   findDifferentMsg.getGender().equals(schoolRollUpdateVO.getGender()) &&
		   findDifferentMsg.getIdCard().equals(schoolRollUpdateVO.getIdCard()) &&
		   findDifferentMsg.getPhone().equals(schoolRollUpdateVO.getPhone()) &&
		   findDifferentMsg.getDept().equals(schoolRollUpdateVO.getDept()) &&
		   findDifferentMsg.getMajor().equals(schoolRollUpdateVO.getMajor()) &&
		   findDifferentMsg.getClassGrade().equals(schoolRollUpdateVO.getClassGrade()) &&
		   findDifferentMsg.getYear().equals(schoolRollUpdateVO.getYear()) &&
		   findDifferentMsg.getStatus().equals(schoolRollUpdateVO.getStatus()) &&
		   schoolRollUpdateVO.getRemark().equals(findDifferentMsg.getRemark())
			){
			//如果都相等
			flag = 2;
			return flag;
		}
		User principal = UserUtils.getPrincipal();
		Date date = new Date();
		schoolRollUpdateVO.setCreateBy(principal);
		schoolRollUpdateVO.setCreateDate(date);
		//②新增一条记录 stu_school_roll表 
		int updateSCHOOL_ROLL = dao.insertSCHOOL_ROLL(schoolRollUpdateVO);
		//①修改stu_student表
			//先将majorId转为majorCode
		Major major = majorDao.selectByPrimaryKey(schoolRollUpdateVO.getMajor());
		schoolRollUpdateVO.setCountryCode(major.getCountryCode());
			//再修改
		int updateSTU_STUDENT = dao.updateSTU_STUDENT(schoolRollUpdateVO);
		//③修改edu_student_class表
		int updateSTUDENT_CLASS = dao.updateSTUDENT_CLASS(schoolRollUpdateVO);
		if(updateSTU_STUDENT > 0 && updateSCHOOL_ROLL > 0 && updateSTUDENT_CLASS > 0){
			flag = 1;
		}
		return flag;
	}
	
	/**
	 * 获取个人记录清单
	 * @param stuSchoolRoll
	 * @return List<STUSchoolRoll>
	 */
	public List<SchoolRollUpdateVO> findTableByOne(SchoolRollUpdateVO schoolRollUpdateVO){
		log.info("获取个人记录业务。。。");
		return dao.recordList(schoolRollUpdateVO);
	}
	/**
	 * 获取学籍异动记录清单
	 * @param stuSchoolRoll
	 * @return PageInfo<STUSchoolRoll>
	 */
	public PageInfo<SchoolRollUpdateVO> findTableList(SchoolRollUpdateVO schoolRollUpdateVO){
		log.info("获取学籍异动记录业务。。。");
		this.startPage(schoolRollUpdateVO);
		//时间区间一方为空的处理
		if(schoolRollUpdateVO.getStartTime() != null){
			if("".equals(schoolRollUpdateVO.getEndTime()) || schoolRollUpdateVO.getEndTime() == null){
				schoolRollUpdateVO.setEndTime(DateUtils.getDate());
			}
		}
		if(schoolRollUpdateVO.getEndTime() != null){
			if("".equals(schoolRollUpdateVO.getStartTime()) || schoolRollUpdateVO.getStartTime() == null){
				schoolRollUpdateVO.setStartTime("1995-01-01");
			}
		}
		return new PageInfo<SchoolRollUpdateVO>(dao.recordList(schoolRollUpdateVO));
	}
	
	/**
	 * 导出学籍异动数据
	 * @param schoolRollUpdateVO
	 * @param response
	 * @throws Exception
	 */
	public void export(SchoolRollUpdateVO schoolRollUpdateVO, HttpServletResponse response) throws Exception{
		log.info("导出学籍异动数据业务。。。");
		try{
		String exportName = "学籍变更记录"+ DateUtil.getStringDate(DateUtil.getNowTimestamp(), DateUtil.yyyyMMdd);
		//获取表格数据
		List<SchoolRollUpdateVO> entityList = dao.recordList(schoolRollUpdateVO);
		//填充数据
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("sheetName", "sheet1");
		list.add(map);
		SchoolRollUpdateVO entity = null;
		for (int i = 0; i < entityList.size(); i++) {
			entity = entityList.get(i);
			Map<String, Object> dataMap = new HashMap<String, Object>();
			dataMap.put("createDate", DateUtils.formatDateTime(entity.getCreateDate()));
			dataMap.put("username", entity.getUsername());
			dataMap.put("name", entity.getName());
			dataMap.put("gender", entity.getGender());
			dataMap.put("stuNumber", entity.getStuNumber());
			dataMap.put("idCard", entity.getIdCard());
			dataMap.put("phone", entity.getPhone());
			dataMap.put("year", entity.getYear());
			dataMap.put("deptName", entity.getDeptName());
			dataMap.put("majorName", entity.getMajorName());
			dataMap.put("className", entity.getClassName());
			dataMap.put("status", "1".equals(entity.getStatus()) ? "在校" :
								  "2".equals(entity.getStatus()) ? "休学" :
								  "3".equals(entity.getStatus()) ? "退学" :
								  "4".equals(entity.getStatus()) ? "毕业" :
								  "5".equals(entity.getStatus()) ? "开除" :
								  "6".equals(entity.getStatus()) ? "入伍" : "");
			dataMap.put("remark", entity.getRemark());
			list.add(dataMap);
		}
			//填充数据到输出控件
			String columnNames[] = {"操作时间", "操作人", "姓名", "性别", "学号", "身份证号", "联系方式", "年级", 
					"院系", "专业", "班级", "学籍状态", "备注"};
			String keys[] = {"createDate", "username", "name", "gender", "stuNumber", "idCard", 
					"phone", "year", "deptName", "majorName", "className", "status", "remark"};
			ByteArrayOutputStream output = new ByteArrayOutputStream();
			try {
				//将数据写入输出流
				ExcelUtil.createWorkBook(list, keys, columnNames).write(output);;
			} catch (Exception e) {
				log.error("导出数据填充错误", e);
				throw e;
			}
			byte[] b = output.toByteArray();
			InputStream input = new ByteArrayInputStream(b);
			//设置response参数  可以打开下载页面
			response.reset();
			response.setContentType("application/vnd.ms-excel;charset=utf-8");
			response.setHeader("Content-Disposition", "attachment;filename="+ new String(
					(exportName +"("+schoolRollUpdateVO.getStartTime() +"~"+ schoolRollUpdateVO.getEndTime()+ ").xls").getBytes(), "iso-8859-1"));
			ServletOutputStream servletOutput = response.getOutputStream();
			BufferedInputStream bufferedInput = null;
			BufferedOutputStream bufferedOutput = null;
			try {
				bufferedInput = new BufferedInputStream(input);//数据
				bufferedOutput = new BufferedOutputStream(servletOutput);//response参数
				byte[] buf = new byte[1024];
				int bytesRead;
				while (-1 != (bytesRead = bufferedInput.read(buf, 0, buf.length))) {
	                bufferedOutput.write(buf, 0, bytesRead);
	            }
			} catch (Exception e) {
				log.error("IO流写入出错", e);
				throw e;
			}finally {
				if(bufferedInput != null){
					bufferedInput.close();
				}
				if(bufferedOutput != null){
					bufferedOutput.close();
				}
			}
		} catch (Exception e) {
			log.error("导出数据失败", e);
			throw e;
		}
	}
}

