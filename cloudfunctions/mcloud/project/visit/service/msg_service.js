/**
 * Notes: 消息模块业务逻辑 
 * Date: 2022-09-26 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const miniLib = require('../../../framework/lib/mini_lib.js');
const projectConfig = require('../public/project_config.js');

class MsgService extends BaseProjectService {

	getUserId(userId) {
		if (userId.includes('^^^'))
			return userId.split('^^^')[1];
		else
			return userId;
	}


	// 审批结果
	async apptResult(userId, taskId, person, desc, date, result) {
		userId = userId.replace('visit^^^', '');

		let page = '/projects/visit/pages/task/edit/task_edit?id=' + taskId;
		let body = {
			touser: userId,
			page,
			data: {
				thing7: { //来访人
					value: miniLib.fmtThing(person),
				},
				time5: { //访问时间
					value: date,
				},
				thing6: { //来访事由
					value: miniLib.fmtThing(desc),
				},
				phrase2: { //审批结果
					value: miniLib.fmtPhrase(result)
				},
			},

			templateId: projectConfig.NOTICE_TEMP_APPT,
		}
		// 异步消息提醒
		miniLib.sendMiniOnceTempMsg(body, 'apptResult');
	}



}

module.exports = MsgService;