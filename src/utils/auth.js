// base64是一种编码转换方式,将ASCII字符转换成普通文本
// base64由字母'a-z','A-Z','0-9','+'和'/',以及'=',共65个字符组成基本字符集,其他字符可根据一定的规则转换成该字符集中的字符
import { Base64 } from 'js-base64'
import Vue from 'vue'
// token编码函数
export const _encode = () => {
  // vue-ls插件获取localSession
  const token = Vue.ls.get('token')
  // base64编码码 添加Basic抬头
  return 'Basic' + Base64.encode(token + ':')
}
