package com.bigdata.campus.stu.controller;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bigdata.campus.common.util.R;
import com.bigdata.campus.edu.entity.Clazz;
import com.bigdata.campus.edu.entity.Major;
import com.bigdata.campus.stu.service.SchoolRollUpdateService;
import com.bigdata.campus.stu.vo.SchoolRollUpdateVO;
import com.bigdata.campus.sys.entity.Department;
import com.bigdata.campus.sys.entity.Param;
import com.bigdata.campus.sys.service.impl.ParamService;
import com.github.pagehelper.PageInfo;

/**
 * 学籍异动
 * @author gaoyuan
 * 时间：2017.10.24
 * 版本：V1.0
 */
@Controller("SchoolRollUpdateController")
@RequestMapping("schoolRoll")
public class SchoolRollUpdateController {
	
	private static final Logger log = Logger.getLogger(SchoolRollUpdateController.class);
	@Autowired
	ParamService paramService;
	@Autowired
	SchoolRollUpdateService schoolRollUpdateService;
	
	/**
	 * @Description: 学籍异动初始化主界面
	 * @return String
	 * @exception
	 */
	@RequestMapping(value="schoolRollUpdateInit", method=RequestMethod.GET)
	public String schoolRollUpdateInit(Model model) throws Exception{
		log.info("初始化学籍异动界面。。。");
		//获取部门下拉
		List<Department> depts = schoolRollUpdateService.findDepts();
		//获取当前学年
		Param param = paramService.get("001");
		String nowYear = param.getVal();
		model.addAttribute("depts", depts);
		model.addAttribute("nowYear", nowYear);
		return "stu/schoolRollUpdate";
	}
	/**
	 * 加载学院下拉
	 * @return R
	 */
	@RequestMapping(value="findDept", method=RequestMethod.POST)
	@ResponseBody
	public R findDept(){
		R r = null;
		log.info("动态获取学院下拉列表。。。");
		List<Department> depts = schoolRollUpdateService.findDepts();
		r = R.ok().put("depts", depts);
		return r;
	}
	/**
	 * 加载专业下拉
	 * @param deptId
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value="changeMajor", method=RequestMethod.POST)
	@ResponseBody
	public R changeMajor(String deptId) throws Exception{
		log.info("动态获取专业下拉列表。。。");
		R r = null;
		List<Major> findMajorList = null;
		try {
			findMajorList = schoolRollUpdateService.findMajorList(deptId);
			r = R.ok().put("majorList", findMajorList);
		} catch (Exception e) {
			log.error("获取专业下拉异常", e);
			e.printStackTrace();
		}
		return r;
	}
	
	/**
	 * 加载班级下拉
	 * @return R
	 * @throws Exception 
	 */
	@RequestMapping(value="findclass", method=RequestMethod.POST)
	@ResponseBody
	public R findClass(Clazz clazz) throws Exception{
		R r = null;
		log.info("动态获取班级下拉列表。。。");
		List<Clazz> findClassList = schoolRollUpdateService.findClassList(clazz);
		r = R.ok().put("classList", findClassList);
		return r;
	}
	/**
	 * 获取年级下拉列表
	 * @return R
	 * @throws Exception 
	 */
	@RequestMapping(value="findYear", method=RequestMethod.POST)
	@ResponseBody
	public R findYear() throws Exception{
		R r = null;
		log.info("动态获取年级下拉列表。。。");
		//获取当前学年
		Param param = paramService.get("001");
		r = R.ok().put("yearList", param);
		return r;
	}
	
	/**
	 * 查询单个学生学籍
	 * @param schoolRollUpdateVO
	 * @return R
	 * @throws Exception
	 */
	@RequestMapping(value="findStudentMsg", method=RequestMethod.POST)
	@ResponseBody
	public R findStudentMsg(SchoolRollUpdateVO schoolRollUpdateVO)throws Exception{
		log.info("查询单个学生学籍开始。。。");
		R r = null;
		SchoolRollUpdateVO findStudent = null;
		try {
			findStudent = schoolRollUpdateService.findStudent(schoolRollUpdateVO);
			r = R.ok().putData(findStudent);
		} catch (Exception e) {
			log.error("查询单个学生学籍失败！", e);
			r = R.error("206001").put("errorMsg", "查询结果出现多个，请联系管理员！");
			e.printStackTrace();
		}
		return r;
	}
	
	/**
	 * 查询单个学生记录
	 * @param schoolRollUpdateVO
	 * @return R
	 * @throws Exception
	 */
	@RequestMapping(value="findTableByOne", method=RequestMethod.POST)
	@ResponseBody
	public R findStudentRecord(SchoolRollUpdateVO schoolRollUpdateVO)throws Exception{
		log.info("查询单个学生记录开始。。。");
		R r = null;
		List<SchoolRollUpdateVO> findTableByOne = null;
		try {
			findTableByOne = schoolRollUpdateService.findTableByOne(schoolRollUpdateVO);
			r = R.ok().put("list", findTableByOne);
		} catch (Exception e) {
			log.error("查询单个学生记录失败！", e);
			e.printStackTrace();
		}
		return r;
	}
	
	/**
	 * 保存学生学籍变更信息
	 * @param schoolRollUpdateVO
	 * @return R
	 * @throws Exception
	 */
	@RequestMapping(value="saveStudentMsg", method=RequestMethod.POST)
	@ResponseBody
	public R saveStudentMsg(SchoolRollUpdateVO schoolRollUpdateVO) throws Exception{
		log.info("保存学生学籍变更信息开始。。。");
		R r = null;
		int saveMsg = 0;//0报错 1成功 2重复
		try {
			saveMsg = schoolRollUpdateService.saveMsg(schoolRollUpdateVO);
			if(saveMsg == 1){
				log.info("信息保存成功");
				r = R.ok().put("success", "保存成功");
			}else if(saveMsg == 2){
				r = R.error().put("msg", "未作任何修改！");
			}else if(saveMsg == 0){
				log.error("信息保存失败！");
				r = R.error("206002").put("msg", "保存失败");
			}
		} catch (Exception e) {
			log.error("信息保存失败！");
			r = R.error("206003").put("msg", "保存失败");
			e.printStackTrace();
		}
		return r;
	}
	
	/**
	 * 学籍异动记录表格的获取
	 * @param stuSchoolRoll
	 * @return R
	 * @throws Exception
	 */
	@RequestMapping(value="findList", method=RequestMethod.POST)
	@ResponseBody
	public R findListByCondition(SchoolRollUpdateVO schoolRollUpdateVO) throws Exception{
		log.info("根据条件获取学籍异动清单开始。。。");
		R r = null;
		PageInfo<SchoolRollUpdateVO> findTableList = null;
		try {
			findTableList = schoolRollUpdateService.findTableList(schoolRollUpdateVO);
			r = R.ok().put("list", findTableList);
		} catch (Exception e) {
			log.error("学籍异动清单获取异常", e);
			e.printStackTrace();
		}
		return r;
	}
	
	/**
	 * 导出学籍异动清单
	 * @param schoolRollUpdateVO
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value="outPrint", method=RequestMethod.GET)
	public void outPrint(SchoolRollUpdateVO schoolRollUpdateVO, HttpServletResponse response) throws Exception{
		log.info("导出学籍异动清单。。。");
		schoolRollUpdateService.export(schoolRollUpdateVO, response);
	}
}
