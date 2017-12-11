# 前言
 **该项目是学习 [ustbhuangyi](https://github.com/ustbhuangyi) 老师的课程敲出来的，纯属学习目的。有兴趣的朋友可以去慕课网搜索他的课程进行学习，请尊重作者的劳动成果。**


敲代码过程主要目的是学习Vue和其他相关技术的使用，对文件、代码结构等都没有细想，比较混乱。但除此之外学习了很多东西，如Vue以外的Vuex和Vue-router的简单使用、真实数据的抓取等等。当然学习过程中也有和老师不同的想法、对问题的不同处理方式。也锻炼了自己发现问题和解决问题的能力。总的来说，完成该项目我受益良多。

# 项目介绍
### 项目展示与运行
#### 展示
> PC端请使用浏览器开发工具手机模式浏览

[项目演示地址](http://39.108.96.190)

<img src="https://github.com/BillyChannn/vue-music/blob/master/static/screenshots/QRcode.png?raw=true" alt="QRcode"></img>

#### 运行
```
git clone https://github.com/billychannn/vue-music
cd vue-music
npm install
npm run dev

// 注意：
// 因为数据是由网上抓取，有些接口需要使用服务器代理，所以使用 npm run dev
// 会出现首页推荐列表和歌词等的获取失败,
// 想要获取完整的展示效果，运行以下代码，并进入相应端口查看效果
npm run build
node server.js

```
### 技术栈
> Vue全家桶：vue2 + vuex + vue-router

> 打包工具： webpack

> css预处理器： sass

> 主要第三方库： better-scroll, vue-lazyload


### 主要模块
- 歌单推荐
- 歌手列表
- 热门榜单
- 搜索模块
- 用户中心
- 播放器内核


# TODO
- [ ] 项目重构
- [ ] 模仿该项目，仿造一个网易云音乐App

# BUG
- 实际使用手机端，音乐会无法播放。

# 界面截图展示
### 推荐页面
<img src="https://github.com/billychannn/vue-music/blob/master/static/screenshots/recommend.gif?raw=true" alt="recommend" width="375" height="667"></img>

### 歌手列表
<img src="https://github.com/billychannn/vue-music/blob/master/static/screenshots/singerList.gif?raw=true" alt="singerList" width="375" height="667"></img>

### 排行列表
<img src="https://github.com/billychannn/vue-music/blob/master/static/screenshots/topList.gif?raw=true" alt="topList" width="375" height="667"></img>
### 搜索页面
<img src="https://github.com/billychannn/vue-music/blob/master/static/screenshots/search.gif?raw=true" alt="search" width="375" height="667"></img>
### 播放器内核
<img src="https://github.com/billychannn/vue-music/blob/master/static/screenshots/player1.gif?raw=true" alt="player1" width="375" height="667"></img>
<img src="https://github.com/billychannn/vue-music/blob/master/static/screenshots/player2.gif?raw=true" alt="player2" width="375" height="667"></img>
<img src="https://github.com/billychannn/vue-music/blob/master/static/screenshots/player3.gif?raw=true" alt="player3" width="375" height="667"></img>

# 项目结构
> 待项目重构后更新
