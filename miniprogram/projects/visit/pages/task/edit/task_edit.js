const cloudHelper = require('../../../../../helper/cloud_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const timeHelper = require('../../../../../helper/time_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const TaskBiz = require('../../../biz/task_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');
const dataHelper = require('../../../../../helper/data_helper.js');
const projectSetting = require('../../../public/project_setting.js');
const qrcodeLib = require('../../../../../lib/tools/qrcode_lib.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		isEdit: true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		ProjectBiz.initPage(this);

		if (!pageHelper.getOptions(this, options)) return;

		if (!await PassportBiz.loginMustBackWin(this)) return;


		this.setData(TaskBiz.initFormData(this.data.id)); // 初始化表单数据 

		this._loadDetail(this);

	},

	_loadDetail: async function (e) {
		await TaskBiz.loadDetail(this);

		let qrImageData = qrcodeLib.drawImg('task=' + this.data.task._id, {
			typeNumber: 1,
			errorCorrectLevel: 'L',
			size: 450
		});

		this.setData({
			qrImageData,
			week: timeHelper.week(this.data.task.TASK_OBJ.date)
		});

	},


	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		this.setData({
			isLoad: false
		}, async () => {
			await this._loadDetail(this);
		});
		wx.stopPullDownRefresh();
	},



	url: function (e) {
		pageHelper.url(e, this);
	},


	bindCheckTap: async function (e) {
		this.selectComponent("#task-form-show").checkForms();
	},

	bindSubmitCmpt: async function (e) {
		let forms = e.detail;
		let callback = async () => {
			try {
				let id = this.data.id;
				let params = {
					id,
					forms
				}
				await cloudHelper.callCloudSumbit('task/edit', params);

				let timeHelper = require('../../../../../helper/time_helper');
				await cloudHelper.transFormsTempPics(forms, 'task-day/' + timeHelper.time('Y-M-D') + '/', id, 'task/task_update_forms');

				let cb = () => {
					let node = {
						'TASK_OBJ': {
							'person': dataHelper.getDataByKey(forms, 'mark', 'person').val,
							'desc': dataHelper.getDataByKey(forms, 'mark', 'desc').val,
							'dept': dataHelper.getDataByKey(forms, 'mark', 'dept').val,
						}
					}
					pageHelper.modifyPrevPageListNodeObject(id, node);

					wx.navigateBack();
				};
				pageHelper.showNoneToast('修改完成，请耐心等待审批', 2000, cb);
			} catch (err) {
				console.log(err);
			}
		}

		wx.requestSubscribeMessage({
			tmplIds: [projectSetting.NOTICE_TEMP_APPT],
			async complete() {
				callback();
			}
		});
	},


})