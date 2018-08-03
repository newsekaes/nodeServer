# nodeServer
**最后一次更新时间：2018.8.3**
## 1. 基本组成：
1. http服务器
2. MongoDB数据库
3. 多进程`Worker`
4. 辅助的`file`工具
## 2. 现有功能简介
### 1. http服务：
简单的`post`和`get`请求封装，可直接在router.js里面添加新的路由信息
```
const Server = require('./core/server')
const server = new Server()
router.useServer(server)
```
### 2. MongoDB数据库：
确保环境中安装了MongoDB数据库。  
引入了MongoDB的官方Node.js驱动`mongodb`模块
```
const db = require('./core/db')
```
### 3. 多进程`Worker`的使用
将以下功能加入子进程中：
1. 深度遍历工作目录`readDir`
2. 获取当前所有cpu的使用率`getCPUs`
```
const worker = require('./core/worker')
```
### 4. `file`工具
暂时封装了`readDirDeep`功能
