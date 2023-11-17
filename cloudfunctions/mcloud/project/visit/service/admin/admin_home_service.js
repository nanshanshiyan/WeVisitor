/**
 * Notes: 后台HOME/登录模块 
 * Date: 2021-06-15 07:48:00 
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const UserModel = require('../../model/user_model.js');
const NewsModel = require('../../model/news_model.js');
const TaskModel = require('../../model/task_model.js');
const constants = require('../../public/constants.js');
const setupUtil = require('../../../../framework/utils/setup/setup_util.js');

class AdminHomeService extends BaseProjectAdminService {

	/**
	 * 首页数据归集
	 */
	async adminHome(admin) { 

		let where = {};

		if (admin.ADMIN_TYPE == 2) {
			where['TASK_OBJ.dept'] = ['in', admin.ADMIN_DEPT]; 
		}

		let waitTaskCnt = await TaskModel.count({ ...where, TASK_STATUS: TaskModel.STATUS.WAIT });
		let succTaskCnt = await TaskModel.count({ ...where, TASK_STATUS: TaskModel.STATUS.SUCC });
		let failTaskCnt = await TaskModel.count({ ...where, TASK_STATUS: TaskModel.STATUS.FAIL });
		let overTaskCnt = await TaskModel.count({ ...where, TASK_STATUS: TaskModel.STATUS.OVER });
		return { waitTaskCnt, succTaskCnt, failTaskCnt, overTaskCnt };


	}

	// 用户数据清理  
	async clearUserData(userId) {

	}


	//##################首页推荐
	// 首页推荐清理
	async clearVouchData() {
		await setupUtil.remove(constants.SETUP_HOME_VOUCH_KEY);

		NewsModel.edit({}, { NEWS_VOUCH: 0 });
		ActivityModel.edit({}, { ACTIVITY_VOUCH: 0 });
		VoteModel.edit({}, { VOTE_VOUCH: 0 });

	}


	/**添加首页推荐 */
	async updateHomeVouch(node) {
		if (node.ext) node.ext = '#' + node.ext;
		let key = constants.SETUP_HOME_VOUCH_KEY;
		let list = await setupUtil.get(key);
		if (!list || !Array.isArray(list)) list = [];

		// 重复性判断
		for (let k = 0; k < list.length; k++) {
			if (list[k].id == node.id) {
				// 已存在
				list[k] = node;
				return await setupUtil.set(key, list, 'vouch');
			}
		}

		// 赋值 
		let data = node;
		list.unshift(data);
		await setupUtil.set(key, list, 'vouch');

	}

	/**删除推荐数据 */
	async delHomeVouch(id) {
		let key = constants.SETUP_HOME_VOUCH_KEY;
		let list = await setupUtil.get(key);
		if (!list || !Array.isArray(list)) return;

		let newList = [];
		for (let k = 0; k < list.length; k++) {
			if (list[k].id != id) {
				newList.push(list[k]);
			}
		}

		return await setupUtil.set(key, newList, 'vouch');

	}
}

module.exports = AdminHomeService;