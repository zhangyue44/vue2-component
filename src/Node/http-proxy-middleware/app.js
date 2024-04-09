const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
// 设置cookie和session  秘钥必须相同
app.use(cookieParser("Cookie"));
// 配置session
app.use(
  session({
    secret: "Cookie", // 设置签名秘钥 内容可以任意填写
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 设置cookie的过期时间，例：80s后    session和相应的cookie失效过期
    resave: true, // 强制保存，如果session没有被修改也要重新保存
    saveUninitialized: true, // 如果原先没有session那么久设置，否则不设置
  })
);
// 设置允许跨域访问该服务.
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  // 第二个参数表示允许跨域的域名，* 代表所有域名
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS"); // 允许的 http 请求的方法
  // 允许前台获得的除 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma 这几张基本响应头之外的响应头
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Authorization, Content-Length, X-Requested-With, Accept, userId, Cookie, breadcrumb, platformid, tenantid"
  );
  // 内容类型：如果是post请求必须指定这个属性
  res.header("Content-Type", "application/json;charset=UTF-8");
  if (req.method == "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(
  "/",
  createProxyMiddleware({
    target: "https://10.19.145.115/",
    changeOrigin: true,
    secure: false,
    onProxyReq(proxyReq, req, res) {
      proxyReq.setHeader(
        "Cookie",
        "SESSION=3d3ed766-7fe0-4aff-8133-ee32de5a1d56; portal_sess=EJLO0neeJvlUACm_wUoEO2CsQqFNnxT4dGi1CNMOUhRaqvLSln4kjyjztGcQHzMw; portal_locale_cookie=zh_CN; portal_locale_cookie.sig=VGxNpP7F4XZ1Gp3jFG_eDaYRyjAPOrprGsuvEUOU4_s; portal_locale_cookie_egg=zh_CN; portal_locale_cookie_egg.sig=w1ywwaZdZHDklrBdqaDLkbkaT6pDsqBnY3Yx5WYGaDo; portal_type_cookie=iportal; portal_type_cookie.sig=UCZaF8EkRMH4dmm8_FyX0-kK5EmKE5pVSkOszTqKyzs; CASTGC=TGT-101-1-C182C3DA350B41919BC60AB7DCAA3766-nUIdPRPdxtbgDvUvUb3M6I7yll7a27ydDGwe45XkZoPNNlzbcz-cas"
      );
    },
  })
);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.listen(3990, () => {
  console.log(`localhost:3990`);
});
