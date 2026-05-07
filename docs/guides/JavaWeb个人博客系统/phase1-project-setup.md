# 阶段1：项目创建与环境搭建

## 目标
创建 JavaWeb 项目骨架，配置 Tomcat 服务器，确保项目能正常启动运行。

## 前置条件
- 已安装 JDK 1.8+
- 已安装 IntelliJ IDEA 或 Eclipse
- 已安装 Tomcat 9.0+
- 已安装 MySQL 5.7+ / 8.0+

## 操作步骤

### 1.1 创建 Java Web 项目

在 IDEA 中创建一个普通的 Java 项目（非 Maven），项目名称：`blog`。

**操作流程：**

1. 打开 IDEA → File → New → Project
2. 选择 Java → Next
3. 项目名填写 `blog`，选择项目存放路径 → Finish
4. 右键项目 → Add Framework Support → 勾选 Web Application (4.0)
5. IDEA 会自动创建 `web` 目录和 `WEB-INF/web.xml`

**项目结构说明：**

```
blog/
├── src/                    # Java 源代码目录
│   └── com/blog/          # 包名
├── web/                    # Web 资源目录
│   ├── WEB-INF/
│   │   └── web.xml        # Web 应用配置文件
│   └── index.jsp          # 默认首页
└── lib/                    # 第三方 jar 包目录
```



### 1.2 创建包结构

在 `src` 目录下创建以下包：

文件：`src/com/blog/entity/`（实体类包）
```
com.blog.entity
```

文件：`src/com/blog/dao/`（数据访问层包）
```
com.blog.dao
```

文件：`src/com/blog/service/`（业务逻辑层包）
```
com.blog.service
```

文件：`src/com/blog/servlet/`（控制层包）
```
com.blog.servlet
```

文件：`src/com/blog/util/`（工具类包）
```
com.blog.util
```

### 1.3 配置 Tomcat 服务器

1. IDEA → Run → Edit Configurations
2. 点击 `+` → Tomcat Server → Local
3. 配置 Tomcat 安装路径
4. 切换到 Deployment 选项卡 → 点击 `+` → Artifact
5. 选择 `blog:war exploded`
6. Application context 设置为 `/` 或 `/blog`
7. 点击 OK 保存

### 1.4 添加 MySQL JDBC 驱动

1. 下载 `mysql-connector-java-8.0.x.jar`
2. 将 jar 包复制到项目的 `lib/` 目录
3. 右键 lib 目录 → Add as Library → 确认

### 1.5 配置默认首页

文件：`web/WEB-INF/web.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!-- 欢迎页（默认访问页面） -->
    <welcome-file-list>
        <welcome-file>login.jsp</welcome-file>
    </welcome-file-list>

</web-app>
```

### 1.6 创建测试页面

文件：`web/login.jsp`

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>博客系统 - 登录</title>
</head>
<body>
    <h1>博客系统登录页面</h1>
    <p>项目搭建成功！</p>
</body>
</html>
```

### 1.7 启动测试

1. 点击 IDEA 右上角的 Run 按钮（绿色三角）
2. 浏览器自动打开，显示登录页面
3. 控制台无报错信息

## 知识点

### JavaWeb 三层架构

三层架构就像餐厅的分工：

| 层次 | 类比 | 职责 |
|------|------|------|
| Controller（控制层） | 服务员 | 接收顾客点单（请求），传递给厨房，把菜端给顾客（响应） |
| Service（业务逻辑层） | 厨师长 | 处理业务逻辑，协调各个工序 |
| Dao（数据访问层） | 采购员 | 负责从仓库（数据库）取食材（数据） |

### web.xml 的作用

`web.xml` 是 Web 应用的"说明书"，告诉 Tomcat：
- 默认打开哪个页面（welcome-file）
- Servlet 的访问地址（url-pattern）
- 过滤器、监听器等配置

## 检查清单

- [ ] 项目创建成功，目录结构正确
- [ ] 包结构创建完成（entity/dao/service/servlet/util）
- [ ] Tomcat 配置成功，能正常启动
- [ ] MySQL JDBC 驱动已添加到 lib 目录
- [ ] web.xml 配置了默认首页
- [ ] 浏览器能访问 login.jsp 页面，显示"项目搭建成功！"
- [ ] 控制台无报错信息
