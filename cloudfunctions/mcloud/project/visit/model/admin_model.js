/**
 * Notes: 收藏实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-05-24 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class AdminModel extends BaseProjectModel {

}

// 集合名
AdminModel.CL = BaseProjectModel.C('admin');

AdminModel.DB_STRUCTURE = {
	_pid: 'string|true',
	ADMIN_ID: 'string|true',
	ADMIN_NAME: 'string|true', 
	ADMIN_DESC: 'string|true',
	ADMIN_PHONE: 'string|false|comment=手机',
	ADMIN_PASSWORD: 'string|true|comment=密码',
	ADMIN_STATUS: 'int|true|default=1|comment=状态：0=禁用 1=启用',

	ADMIN_LOGIN_CNT: 'int|true|default=0|comment=登录次数',
	ADMIN_LOGIN_TIME: 'int|true|default=0|comment=最后登录时间',
	ADMIN_TYPE: 'int|true|default=0|comment=类型 0=普通管理员,1=超级管理员,2=审批人员,3=门卫',

	ADMIN_DEPT: 'array|true|default=[]|comment=审批部门',

	ADMIN_TOKEN: 'string|false|comment=当前登录token',
	ADMIN_TOKEN_TIME: 'int|true|default=0|comment=当前登录token time',

	ADMIN_ADD_TIME: 'int|true',
	ADMIN_EDIT_TIME: 'int|true',
	ADMIN_ADD_IP: 'string|false',
	ADMIN_EDIT_IP: 'string|false',
};

// 字段前缀
AdminModel.FIELD_PREFIX = "ADMIN_";

module.exports = AdminModel;