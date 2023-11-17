/**
 * Notes: 后台管理模块 基类
 * Date: 2021-03-15 07:48:00 
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseAdminService = require('../../../../framework/platform/service/base_admin_service.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const util = require('../../../../framework/utils/util.js');
const config = require('../../../../config/config.js');
const cloudBase = require('../../../../framework/cloud/cloud_base.js');
const AdminModel = require('../../model/admin_model.js');

class BaseProjectAdminService extends BaseAdminService {

	getProjectId() {
		return util.getProjectId();
	}

	/** 是否管理员 */
	async isAdmin(token) {
		if (config.IS_DEMO) { // 演示版本
			let admin = {};
			admin.ADMIN_NAME = 'demo-admin';
			admin.ADMIN_DESC = '体验用户';
			admin.ADMIN_ID = '1';
			admin.ADMIN_PHONE = '13900000000';
			admin.ADMIN_LOGIN_CNT = 0;
			admin.ADMIN_LOGIN_TIME = '';
			admin.ADMIN_TYPE = 0;
			admin.ADMIN_STATUS = 1;
			admin.ADMIN_DEPT = [];
			return admin;
		}

		let where = {
			ADMIN_TOKEN: token,
			ADMIN_TOKEN_TIME: ['>', timeUtil.time() - config.ADMIN_LOGIN_EXPIRE * 1000], // token有效时间
			ADMIN_STATUS: 1,
		}
		let admin = await AdminModel.getOne(where, 'ADMIN_DEPT,ADMIN_ID,ADMIN_PHONE,ADMIN_NAME,ADMIN_TYPE,ADMIN_DESC');
		if (!admin)
			this.AppError('管理员不存在', appCode.ADMIN_ERROR);

		return admin;
	}


	async genDetailQr(type, id) {
		let cloud = cloudBase.getCloud();

		let page = `projects/${this.getProjectId()}/pages/${type}/detail/${type}_detail`;
		console.log('page=', page);
		let result = await cloud.openapi.wxacode.getUnlimited({
			scene: id,
			width: 280,
			check_path: false,
			//env_version: 'trial', //release,trial,develop
			page
		});

		let cloudPath = `${this.getProjectId()}/${type}/${id}/qr.png`;
		console.log('cloudPath=', cloudPath);
		let upload = await cloud.uploadFile({
			cloudPath,
			fileContent: result.buffer,
		});

		if (!upload || !upload.fileID) return;

		return upload.fileID;
	}
}

module.exports = BaseProjectAdminService;