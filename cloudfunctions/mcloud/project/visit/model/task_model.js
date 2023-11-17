/**
 * Notes:  健康监测实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-08-12 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class TaskModel extends BaseProjectModel {

}

// 集合名
TaskModel.CL = BaseProjectModel.C('task');

TaskModel.DB_STRUCTURE = {
	_pid: 'string|true',
	TASK_ID: 'string|true',

	TASK_TYPE: 'int|true|default=0|comment=类型 0=用户创建，1=系统创建',
  
	TASK_USER_ID: 'string|false|comment=用户ID',

	TASK_STATUS: 'int|true|default=0|comment=状态 0=待处理,1=审批通过,2=审批不通过, 9=已来访', 
	 
      
	TASK_FORMS: 'array|true|default=[]', 
	TASK_OBJ: 'object|true|default={}',  
 
	TASK_SUCC_ADMIN_ID: 'string|false|comment=审批人ID', 
	TASK_SUCC_ADMIN_NAME: 'string|false', 
	TASK_SUCC_TIME: 'int|true|default=0', 

	TASK_FAIL_ADMIN_ID: 'string|false|comment=审批人ID', 
	TASK_FAIL_ADMIN_NAME: 'string|false', 
	TASK_FAIL_TIME: 'int|true|default=0',  
 
	TASK_OVER_ADMIN_ID: 'string|false|comment=审批人ID', 
	TASK_OVER_ADMIN_NAME: 'string|false', 
	TASK_OVER_TIME: 'int|true|default=0',  

	TASK_ADD_TIME: 'int|true',
	TASK_EDIT_TIME: 'int|true',
	TASK_ADD_IP: 'string|false',
	TASK_EDIT_IP: 'string|false',
};

// 字段前缀
TaskModel.FIELD_PREFIX = "TASK_";

/**
 * 状态 0=待处理,1=审批通过,2=审批不通过, 9=已来访
 */
TaskModel.STATUS = {
	WAIT: 0,
	SUCC: 1,
	FAIL: 2,
	OVER: 9
};

TaskModel.STATUS_DESC = {
	WAIT: '待处理',
	SUCC: '审批通过',
	FAIL: '审批不通过',
	OVER: '已来访',
};




module.exports = TaskModel;