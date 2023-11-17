const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const validate = require('../../../../../../helper/validate.js');
const projectSetting = require('../../../../public/project_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		deptOptions: projectSetting.TASK_DEPT
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (!AdminBiz.isAdmin(this, true)) return;
		if (!pageHelper.getOptions(this, options)) return;

		this._loadDetail();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	bindDeptCmpt: function (e) {
		this.setData({
			formDept: e.detail
		})
	},

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
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	_loadDetail: async function () {
		if (!AdminBiz.isAdmin(this, true)) return;

		let id = this.data.id;
		if (!id) return;

		let params = {
			id
		};
		let opt = {
			title: 'bar'
		};
		let mgr = await cloudHelper.callCloudData('admin/mgr_detail', params, opt);
		if (!mgr) {
			this.setData({
				isLoad: null
			})
			return;
		};

		this.setData({
			isLoad: true,

			// 表单数据 
			formName: mgr.ADMIN_NAME,
			formType: mgr.ADMIN_TYPE,
			formDept: mgr.ADMIN_DEPT,
			formDesc: mgr.ADMIN_DESC,
			formPhone: mgr.ADMIN_PHONE,

			formPassword: ''

		});
	},

	/** 
	 * 数据提交
	 */
	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this, true)) return;

		let data = this.data;

		// 数据校验 
		data = validate.check(data, AdminBiz.CHECK_FORM_MGR_EDIT, this);
		if (!data) return;

		if (data.type == 2 && this.data.formDept.length == 0) {
			return pageHelper.showModal('请选择审批部门', '温馨提示');
		}
		data.dept = this.data.formDept;

		try {
			let adminId = this.data.id;
			data.id = adminId;

			await cloudHelper.callCloudSumbit('admin/mgr_edit', data).then(res => {

				let callback = () => {
					// 更新列表页面数据
					let node = {
						'ADMIN_DEPT': data.dept,
						'ADMIN_TYPE': data.type,
						'ADMIN_NAME': data.name,
						'ADMIN_DESC': data.desc,
						'ADMIN_PHONE': data.phone,
					}
					pageHelper.modifyPrevPageListNodeObject(adminId, node);

					wx.navigateBack();
				}
				pageHelper.showSuccToast('修改成功', 1500, callback);
			});


		} catch (err) {
			console.log(err);
		}

	},
})