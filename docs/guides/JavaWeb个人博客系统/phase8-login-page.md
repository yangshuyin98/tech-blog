# 阶段8：前端登录页面

## 目标
创建美观的登录页面（JSP），实现表单提交和错误信息展示。

## 前置条件
- 阶段7 LoginServlet 创建完成

## 操作步骤

### 8.1 创建登录页面

文件：`web/login.jsp`

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>博客系统 - 登录</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: "Microsoft YaHei", sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .login-box {
            background: #fff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            width: 400px;
        }
        .login-box h2 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
            font-size: 28px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-size: 14px;
        }
        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
        }
        .btn-login {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 5px;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            transition: opacity 0.3s;
        }
        .btn-login:hover {
            opacity: 0.9;
        }
        .error-msg {
            color: #e74c3c;
            text-align: center;
            margin-bottom: 15px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="login-box">
        <h2>博客系统登录</h2>
        <%-- 显示错误信息 --%>
        <% if (request.getAttribute("errorMsg") != null) { %>
            <div class="error-msg">
                <%= request.getAttribute("errorMsg") %>
            </div>
        <% } %>
        <form action="login.do" method="post">
            <div class="form-group">
                <label for="username">用户名</label>
                <input type="text" id="username" name="username" placeholder="请输入用户名" required>
            </div>
            <div class="form-group">
                <label for="password">密 码</label>
                <input type="password" id="password" name="password" placeholder="请输入密码" required>
            </div>
            <button type="submit" class="btn-login">登 录</button>
        </form>
    </div>
</body>
</html>
```

### 8.2 创建主页（登录成功后跳转目标）

文件：`web/main.jsp`

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.blog.entity.User" %>
<html>
<head>
    <title>博客后台 - 主页</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: "Microsoft YaHei", sans-serif;
            background: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 {
            font-size: 22px;
        }
        .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .content {
            padding: 40px;
            text-align: center;
        }
        .content h2 {
            color: #333;
            margin-bottom: 20px;
        }
        .content p {
            color: #666;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <%
        User user = (User) session.getAttribute("currentUser");
        if (user == null) {
            response.sendRedirect("login.jsp");
            return;
        }
    %>
    <div class="header">
        <h1>博客后台管理系统</h1>
        <div class="user-info">
            <span>欢迎，<%= user.getNickname() %></span>
        </div>
    </div>
    <div class="content">
        <h2>登录成功！</h2>
        <p>欢迎进入博客后台管理系统</p>
    </div>
</body>
</html>
```

## 知识点

### JSP 表达式

```jsp
<%= 表达式 %>
```

作用：在页面上输出 Java 表达式的值。等价于 `out.print(表达式)`。

```jsp
<%-- 这两种写法等价 --%>
<p>欢迎，<%= user.getNickname() %></p>
<p>欢迎，<% out.print(user.getNickname()); %></p>
```

### JSP 脚本片段

```jsp
<% Java代码 %>
```

作用：在页面中嵌入 Java 代码。可以做条件判断、循环等。

### form 表单提交

```html
<form action="login.do" method="post">
    <input type="text" name="username">
    <input type="password" name="password">
    <button type="submit">登录</button>
</form>
```

- `action`：提交到哪个 Servlet（对应 `@WebServlet` 的地址）
- `method`：提交方式（get / post）
- `name`：参数名（对应 `req.getParameter("username")`）

## 检查清单

- [ ] `login.jsp` 创建成功，页面美观
- [ ] 表单 action 指向 `login.do`，method 为 `post`
- [ ] 用户名和密码输入框 name 属性正确
- [ ] 错误信息能正常显示（`<%= errorMsg %>`）
- [ ] `main.jsp` 创建成功，包含 Session 校验
- [ ] 未登录时访问 main.jsp 会自动跳回 login.jsp
- [ ] 页面无乱码
