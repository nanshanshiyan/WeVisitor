const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const helper = require('../../../../../../helper/helper.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const timeHelper = require('../../../../../../helper/time_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const projectSetting = require('../../../../public/project_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		//startDate: timeHelper.time('Y-M-D', -86400 * 0),
		//endDate: timeHelper.time('Y-M-D'),
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		if (options && helper.isDefined(options.status)) {
			this.setData({
				isLoad: true,
				_params: {
					sortType: 'status',
					sortVal: options.status,
				}
			});
		}

		await this._getSearchMenu();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () { },

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

	url: async function (e) {
		pageHelper.url(e, this);
	},


	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},

	bindDelTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');

		let params = {
			id
		}

		let callback = async () => {
			try {
				let opts = {
					title: '删除中'
				}
				await cloudHelper.callCloudSumbit('admin/task_del', params, opts).then(res => {

					pageHelper.delListNode(id, this.data.dataList.list);
					this.data.dataList.total--;
					this.setData({
						dataList: this.data.dataList
					});
					pageHelper.showSuccToast('删除成功');
				});
			} catch (e) {
				console.log(e);
			}
		}
		pageHelper.showConfirm('确认删除？删除不可恢复', callback);

	},

	bindStatusTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');
		let status = Number(pageHelper.dataset(e, 'status'));
		let params = {
			id,
			status
		}

		let cb = async () => {
			try {
				await cloudHelper.callCloudSumbit('admin/task_status', params).then(res => {
					pageHelper.modifyListNode(id, this.data.dataList.list, 'TASK_STATUS', status, '_id');
					this.setData({
						dataList: this.data.dataList
					});
					pageHelper.showSuccToast('设置成功');
				});
			} catch (e) {
				console.log(e);
			}
		}

		pageHelper.showConfirm('确认执行此操作?', cb);

	},

	_getSearchMenu: async function () {

		let sortItems1 = [
			{ label: '排序', type: 'status', value: '99' },
			{ label: '时间正序', type: 'sort', value: 'TASK_ADD_TIME|asc' },
			{ label: '时间倒序', type: 'sort', value: 'TASK_ADD_TIME|desc' }
		];

		let sortItems2 = [
			{ label: '部门', type: 'status', value: '99' },
		];
		let admin = this.data.admin;
		if (admin.type == 2 && admin.dept.length > 0) {
			for (let k = 0; k < admin.dept.length; k++) {
				sortItems2.push({ label: admin.dept[k], type: 'dept', value: admin.dept[k] });
			}
		}
		else {
			for (let k = 0; k < projectSetting.TASK_DEPT.length; k++) {
				sortItems2.push({ label: projectSetting.TASK_DEPT[k], type: 'dept', value: projectSetting.TASK_DEPT[k] });
			}

		}

		let sortMenus = [
			{ label: '全部', type: 'status', value: '99' },
			{ label: '待审批', type: 'status', value: '0' },
			{ label: '已通过待来访', type: 'status', value: '1' },
			{ label: '未通过', type: 'status', value: '2' },
			{ label: '已来访', type: 'status', value: '9' },
		];


		this.setData({
			search: '',
			sortItems: [sortItems1, sortItems2],
			sortMenus,
			isLoad: true
		})


	}

})