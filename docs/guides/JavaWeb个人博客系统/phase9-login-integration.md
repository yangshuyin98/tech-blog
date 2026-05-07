# 阶段9：登录功能集成与测试

## 目标
将前几个阶段的代码串联起来，完成完整的登录流程测试。

## 前置条件
- 阶段1-8 全部完成

## 操作步骤

### 9.1 检查项目结构

确认以下文件都已创建：

```
blog/
├── src/
│   ├── db.properties
│   └── com/blog/
│       ├── entity/
│       │   └── User.java
│       ├── dao/
│       │   ├── UserDao.java
│       │   └── impl/UserDaoImpl.java
│       ├── service/
│       │   ├── UserService.java
│       │   └── impl/UserServiceImpl.java
│       ├── servlet/
│       │   └── LoginServlet.java
│       └── util/
│           └── DBUtil.java
├── web/
│   ├── WEB-INF/web.xml
│   ├── login.jsp
│   └── main.jsp
└── lib/
    └── mysql-connector-java-8.0.x.jar
```

### 9.2 重新启动 Tomcat

1. 停止之前运行的 Tomcat
2. 点击 Run 重新启动
3. 等待控制台出现 `Server startup in [xxx] ms`

### 9.3 测试登录流程

**测试1：正常登录**

1. 浏览器访问 `http://localhost:8080/login.jsp`
2. 输入用户名：`admin`，密码：`123456`
3. 点击"登录"
4. 预期结果：跳转到 `main.jsp`，显示"欢迎，博主"

**测试2：密码错误**

1. 输入用户名：`admin`，密码：`wrong`
2. 点击"登录"
3. 预期结果：停留在 `login.jsp`，显示"用户名或密码错误"

**测试3：用户名为空**

1. 不输入用户名，输入密码：`123456`
2. 点击"登录"
3. 预期结果：浏览器提示"请填写此字段"（HTML5 required 验证）

**测试4：直接访问主页**

1. 在新浏览器窗口直接访问 `http://localhost:8080/main.jsp`
2. 预期结果：自动跳转回 `login.jsp`（因为 Session 中没有用户信息）

### 9.4 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 404 Not Found | Servlet 映射地址错误 | 检查 `@WebServlet("/login.do")` 或 web.xml 配置 |
| 500 Internal Server Error | 数据库连接失败 | 检查 `db.properties` 中的数据库配置 |
| 乱码 | 编码不一致 | 在 Servlet 中添加 `req.setCharacterEncoding("UTF-8")` |
| 登录成功但页面空白 | JSP 文件路径错误 | 检查 `resp.sendRedirect("main.jsp")` 的路径 |
| ClassNotFoundException | JDBC 驱动未加载 | 确认 lib 目录中有 mysql-connector jar 包 |

## 知识点

### 完整的登录请求流程

```
浏览器输入 admin/123456
        │
        ▼
点击"登录"按钮
        │
        ▼
form 提交 POST 请求到 login.do
        │
        ▼
LoginServlet.doPost()
        │
        ├── req.getParameter("username") → "admin"
        ├── req.getParameter("password") → "123456"
        │
        ▼
userService.login("admin", "123456")
        │
        ▼
userDao.findByUsernameAndPassword("admin", "123456")
        │
        ▼
DBUtil.queryOne("SELECT * FROM user WHERE username=? AND password=?", "admin", "123456")
        │
        ▼
数据库返回结果 → 封装成 User 对象
        │
        ▼
user != null → 登录成功
        │
        ├── session.setAttribute("currentUser", user)
        └── resp.sendRedirect("main.jsp")
                │
                ▼
        浏览器跳转到 main.jsp
                │
                ▼
        显示"欢迎，博主"
```

## 检查清单

- [ ] 项目结构完整，所有文件就位
- [ ] Tomcat 启动成功，无报错
- [ ] 正常登录测试通过（admin/123456）
- [ ] 密码错误测试通过（显示错误提示）
- [ ] 空用户名测试通过（浏览器 HTML5 验证）
- [ ] 直接访问主页测试通过（自动跳转登录页）
- [ ] 控制台无异常信息
