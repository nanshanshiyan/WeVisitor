const TASK_DEPT = ['行政部', '生产部', '财务部', '总办', '人力资源部', '市场部', '综合部', '研发部', '其他'];

module.exports = { // 来访申请visit
	PROJECT_COLOR: '#0055BE',
	NAV_COLOR: '#ffffff',
	NAV_BG: '#0055BE',

	// ## 小程序订阅消息
	//来访申请结果通知(27527) 来访人/访问时间/来访事由/审批结果 
	NOTICE_TEMP_APPT: 'ZgWZ-TMpr7UOyE4S5qsVZjhKgXS3ek83hTWoMwqyE0Y',

	// setup
	SETUP_CONTENT_ITEMS: [
		{ title: '关于我们', key: 'SETUP_CONTENT_ABOUT' },
	],

	// 用户
	USER_REG_CHECK: false,
	USER_FIELDS: [

	],

	NEWS_NAME: '通知公告',
	NEWS_CATE: [
		{ id: 1, title: '通知公告', style: 'leftbig1' },
	],
	NEWS_FIELDS: [],


	TASK_NAME: '来访申请',
	TASK_DEPT: TASK_DEPT,
	TASK_FIELDS: [
		{ mark: 'date', title: '申请来访日期', type: 'date', must: true },
		{ mark: 'hour', title: '申请来访时间点', type: 'hourminute', def: '09:00', must: true },
		{ mark: 'dept', title: '拜访部门', type: 'select', selectOptions: TASK_DEPT, must: true },
		{ mark: 'person', title: '申请人', type: 'text', must: true },
		{ mark: 'phone', title: '申请人电话', type: 'text', must: true },
		{ mark: 'num', title: '来访人数', type: 'int', def: 1, must: true },
		{ mark: 'desc', title: '来访事由', type: 'textarea', must: true },
		{ mark: 'img', type: 'image', title: '相关图片', max: 8, must: false },
	],

	TASK_OVER_FIELDS: [
		{ mark: 'content', title: '完成情况说明', type: 'textarea', must: true },
		{ mark: 'img', type: 'image', title: '相关图片', max: 8, must: true },
	]

}