module.exports = {
	PID: 'A00', // 餐厅订座

	NAV_COLOR: '#ffffff',
	NAV_BG: '#2CB6A5',

	MEET_NAME: '订座',

	MENU_ITEM: ['首页', '预定日历', '我的'], // 第1,4,5菜单
 
	NEWS_CATE: '1=本店动态,2=菜品推介',
	MEET_TYPE: '1=订座预约',

	DEFAULT_FORMS: [{
			type: 'line',
			title: '姓名',
			desc: '请填写您的姓名',
			must: true,
			len: 50,
			onlySet: {
				mode: 'all',
				cnt: -1
			},
			selectOptions: ['', ''],
			mobileTruth: true,
			checkBoxLimit: 2,
		},
		{
			type: 'line',
			title: '手机',
			desc: '请填写您的手机号码',
			must: true,
			len: 50,
			onlySet: {
				mode: 'all',
				cnt: -1
			},
			selectOptions: ['', ''],
			mobileTruth: true,
			checkBoxLimit: 2,
		}
	]
}