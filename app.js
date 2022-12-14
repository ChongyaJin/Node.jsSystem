//导入express
const express = require('express')
const app = express()
const joi = require('joi')
//导入cors
const cors = require('cors')
app.use(cors())

//解析表单数据中间件,只能解析
app.use(express.urlencoded({extended: false}))

//一定要在路由之前封装res.cc
app.use((req, res, next) => {
    //status默认值1表示失败
    //err的值可能是错误对象或字符串
    res.cc = function(err, status = 1){
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})


//一定要在路由之前配置token中间件
const expressJWT = require('express-jwt')
const config = require('./config')


app.use(expressJWT({ secret: config.jwtSecretKey}).unless({ path: [/^\/api/]}))




//导入使用路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

//导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

//导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)

//导入并使用文章的路由模块
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)


//定义错误级别中间件
app.use((err, req, res, next) => {
    //验证失败
    if(err instanceof joi.ValidationError) return res.cc(err)
    //身份认证失败错误
    if(err.name === 'UnauthorizedError') return res.cc('身份认证失败')
    //未知错误
    res.cc(err)
})

app.listen(3007, () => {
    console.log('api sever running at http://127.0.0.1:3007');
})
