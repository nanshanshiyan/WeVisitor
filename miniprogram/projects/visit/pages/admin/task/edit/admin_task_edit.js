const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const TaskBiz = require('../../../../biz/task_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const dataHelper = require('../../../../../../helper/data_helper.js');
const projectSetting = require('../../../../public/project_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

		fields: projectSetting.TASK_FIELDS,
		isLoad: false,


	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		if (!AdminBiz.isAdmin(this)) return;
		if (!pageHelper.getOptions(this, options)) return;
		pageHelper.getOptions(this, options, 'idx');

		this.setData(TaskBiz.initFormData(this.data.id)); // 初始化表单数据 

		this._loadDetail();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	async _loadDetail() {
		let id = this.data.id;
		if (!id) return;

		let params = {
			id,
		};
		let opt = {
			title: 'bar'
		};
		let task = await cloudHelper.callCloudData('admin/task_detail', params, opt);
		if (!task) {
			this.setData({
				isLoad: null
			})
			return;
		}

		this.setData({
			isLoad: true,
			task,
		});

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	async onPullDownRefresh() {
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	},

	bindCheckTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		this.selectComponent("#task-form-show").checkForms();
	},

	bindSubmitCmpt: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;

		let forms = e.detail;

		let callback = async () => {
			try {
				let id = this.data.id;
				let opts = {
					title: '提交中'
				}
				let params = {
					id,
					forms
				} 
				await cloudHelper.callCloudSumbit('admin/task_edit', params, opts);

				// 图片
				await cloudHelper.transFormsTempPics(forms, 'task/', id, 'admin/task_update_forms');

				let cb = () => {
					let node = {
						'TASK_OBJ': { 
							'desc': dataHelper.getDataByKey(forms, 'mark', 'desc').val,
							'person': dataHelper.getDataByKey(forms, 'mark', 'person').val, 
							'dept': dataHelper.getDataByKey(forms, 'mark', 'dept').val,
						}
					}
					pageHelper.modifyPrevPageListNodeObject(id, node);

					wx.navigateBack();
				};
				pageHelper.showNoneToast('修改完成', 2000, cb);


			} catch (err) {
				console.log(err);
			};
		}


		callback();
	},


})