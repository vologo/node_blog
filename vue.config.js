// module.exports = {
//   // All options for webpack-dev-server are supported
//   // https://webpack.js.org/configuration/dev-server/
//   devServer: {
//     // https://github.com/chimurai/http-proxy-middleware#proxycontext-config
//     // axios跨域代理配置表，在这里可以配置特定的请求代理到对应的API接口
//     proxy: {
//       // 代理所有的以'/api'开头的浏览器请求
//       '/api': {
//         // 服务端域名和端口
//         target: 'http://localhost:3000',
//         // 如果设置成true：请求头中host会设置成target
//         changeOrigin: true,
//         logLevel: 'debug'
//         // 用'/'替换浏览器请求url中的'/api'，例如浏览器请求为http://localhost:8082/api/xxx,
//         // 则对应的服务端接口为http://localhost:8082/xxx
//         // pathRewrite: {
//         //   '^/api': '/api'
//         // }
//       }
//     }
//   }
// }
