/*
 * @Author: 鲁遥
 * @Date: 2021-05-06 18:23:48
 * @LastEditTime: 2021-05-10 16:22:09
 * @LastEditors: your name
 * @Description: 
 * @FilePath: /mall/mall-serve/app.js
 */
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const cors = require('koa2-cors')


const index = require('./routes/index')
const users = require('./routes/users')
const goods = require('./routes/goods')



const { connect } = require('./db/init')
connect();


// error handler
onerror(app)

// middlewares
app.use(cors({
  origin: function (ctx) { //设置允许来自指定域名请求
    // if (ctx.url === '/test') {
    //     return '*'; // 允许来自所有域名请求
    // }
    // return 'http://localhost:8080'; //只允许http://localhost:8080这个域名的请求
    return "*"
  },
  maxAge: 5, //指定本次预检请求的有效期，单位为秒。
  credentials: true, //是否允许发送Cookie
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段

}))
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes

app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(goods.routes(), goods.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
