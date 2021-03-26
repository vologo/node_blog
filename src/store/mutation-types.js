// 使用常量替代 Mutation 事件类型
// 使用常量替代 mutation 事件类型在各种 Flux 实现中是很常见的模式。
// 这样可以使 linter 之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的 mutation 一目了然：
// loading 特效
export const SET_MAIN_LOADING = 'SET_MAIN_LOADING'
// 图片显示
export const SET_PICTURE_MODAL = 'SET_PICTURE_MODAL'
// 会员信息
export const SET_USER_INFO = 'SET_USER_INFO'
// 用不用常量取决于你——在需要多人协作的大型项目中，这会很有帮助。但如果你不喜欢，你完全可以不这样做。
// 设置token
export const SET_TOKEN = 'SET_TOKEN'
// 清除token
export const DEL_TOKEN = 'DEL_TOKEN'
// 获取并设置分类
export const SET_CATEGORY = 'SET_CATEGORY'
