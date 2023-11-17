/**
 * Notes: 健康监测模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-08-12 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const cloudUtil = require('../../../framework/cloud/cloud_util.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const TaskModel = require('../model/task_model.js');
const UserModel = require('../model/user_model.js');

class TaskService extends BaseProjectService {

	// 取得处理流程
	getTaskLogList(task) {
		let taskLogList = [];
		if (task.TASK_TYPE == 0) {
			taskLogList.push(
				{
					desc: '用户提交',
					time: timeUtil.timestamp2Time(task.TASK_ADD_TIME, 'Y-M-D h:m')
				}
			);
		}
		else {
			taskLogList.push(
				{
					desc: '后台录入',
					time: timeUtil.timestamp2Time(task.TASK_ADD_TIME, 'Y-M-D h:m')
				}
			);
		}

		if (task.TASK_STATUS == TaskModel.STATUS.SUCC) {
			let desc = '已派工给 [' + task.TASK_MEMBER_CATE_NAME + '] ' + task.TASK_MEMBER_NAME + '，正在等待处理';
			if (task.TASK_MEMBER_PHONE) desc += ' ，电话' + task.TASK_MEMBER_PHONE + ' ';
			taskLogList.push(
				{
					desc,
					time: timeUtil.timestamp2Time(task.TASK_MEMBER_TIME, 'Y-M-D h:m')
				}
			);
		}

		if (task.TASK_STATUS >= TaskModel.STATUS.RUN)
			taskLogList.push(
				{
					desc: '[' + task.TASK_MEMBER_CATE_NAME + '] ' + task.TASK_MEMBER_NAME + ' 开始处理',
					time: timeUtil.timestamp2Time(task.TASK_RUN_TIME, 'Y-M-D h:m'),
					content: task.TASK_RUN_OBJ.content,
					img: task.TASK_RUN_OBJ.img,
				}
			);
		if (task.TASK_STATUS >= TaskModel.STATUS.OVER)
			taskLogList.push(
				{
					desc: '已来访',
					time: timeUtil.timestamp2Time(task.TASK_OVER_TIME, 'Y-M-D h:m'),
					content: task.TASK_OVER_OBJ.content,
					img: task.TASK_OVER_OBJ.img,
				}
			);

		return taskLogList;
	}


	async getTaskCountByType(userId) {
		let status0Cnt = await TaskModel.count({ TASK_STATUS: 0, TASK_USER_ID: userId });
		let status1Cnt = await TaskModel.count({ TASK_STATUS: 1, TASK_USER_ID: userId });
		let status2Cnt = await TaskModel.count({ TASK_STATUS: 2, TASK_USER_ID: userId });
		let status9Cnt = await TaskModel.count({ TASK_STATUS: 9, TASK_USER_ID: userId });
		let task = {
			status0Cnt,
			status1Cnt,
			status2Cnt,
			status9Cnt
		}
		return task;
	}

	async getTaskDetail(userId, id, isAdmin = false) {
		let where = {
			_id: id
		}
		if (!isAdmin) where.TASK_USER_ID = userId;

		return await TaskModel.getOne(where);
	}


	/**添加 */
	async insertTask(userId, {
		forms
	}) {

		this.AppError('[访客]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	/**修改 */
	async editTask({
		id,
		forms
	}, formsName = 'TASK_FORMS', objName = 'TASK_OBJ') {

		this.AppError('[访客]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	// 更新forms信息
	async updateTaskForms({
		id,
		hasImageForms
	}, formsName = 'TASK_FORMS', objName = 'TASK_OBJ') {
		this.AppError('[访客]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**删除数据 */
	async delTask(userId, id, isAdmin) {
		this.AppError('[访客]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}



	/** 取得我的 */
	async getMyTaskList(userId, {
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {
		orderBy = orderBy || {
			'TASK_ADD_TIME': 'desc'
		};
		let fields = '*';

		let where = {};
		where.and = {
			_pid: this.getProjectId(), //复杂的查询在此处标注PID 
			TASK_USER_ID: userId
		};

		if (util.isDefined(search) && search) {
			where.or = [
				{ ['TASK_OBJ.type']: ['like', search] },
				{ ['TASK_OBJ.address']: ['like', search] },
				{ ['TASK_OBJ.person']: ['like', search] }
			];
		} else if (sortType && sortVal !== '') {
			// 搜索菜单
			switch (sortType) {
				case 'type': {
					where.and['TASK_OBJ.type'] = sortVal;
					break;
				}
				case 'status': {
					where.and.TASK_STATUS = Number(sortVal);
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'TASK_ADD_TIME');
					break;
				}
			}
		}
		let result = await TaskModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);

		return result;
	}


	async getTaskList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {
		orderBy = orderBy || {
			'TASK_ADD_TIME': 'desc'
		};
		let fields = '*';

		let where = {};
		where.and = {
			_pid: this.getProjectId(), //复杂的查询在此处标注PID  
		};

		if (util.isDefined(search) && search) {
			where.or = [
				{ ['TASK_OBJ.title']: ['like', search] },
				{ ['TASK_OBJ.building']: ['like', search] },
			];
		} else if (sortType && sortVal !== '') {
			// 搜索菜单
			switch (sortType) {
				case 'type': {
					where.and['TASK_OBJ.type'] = sortVal;
					break;
				}
				case 'status': {
					where.and.TASK_STATUS = Number(sortVal);
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'TASK_ADD_TIME');
					break;
				}
			}
		}
		let result = await TaskModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);

		return result;
	}

}

module.exports = TaskService;