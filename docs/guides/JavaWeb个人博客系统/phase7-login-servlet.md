# 阶段7：用户登录 - Servlet 控制层

## 目标
创建 LoginServlet，接收前端登录请求，调用 Service 层验证用户，根据结果跳转页面。

## 前置条件
- 阶段6 UserService 创建完成
- web.xml 可用

## 操作步骤

### 7.1 创建 LoginServlet

文件：`src/com/blog/servlet/LoginServlet.java`

```java
package com.blog.servlet;

import com.blog.entity.User;
import com.blog.service.UserService;
import com.blog.service.impl.UserServiceImpl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/login.do")
public class LoginServlet extends HttpServlet {

    private UserService userService = new UserServiceImpl();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 1. 获取前端传递的参数
        String username = req.getParameter("username");
        String password = req.getParameter("password");

        // 2. 调用 Service 层验证登录
        User user = userService.login(username, password);

        // 3. 根据结果跳转
        if (user != null) {
            // 登录成功：将用户信息存入 Session，跳转到主页
            req.getSession().setAttribute("currentUser", user);
            resp.sendRedirect("main.jsp");
        } else {
            // 登录失败：设置错误信息，跳回登录页
            req.setAttribute("errorMsg", "用户名或密码错误");
            req.getRequestDispatcher("login.jsp").forward(req, resp);
        }
    }
}
```

### 7.2 配置 Servlet 映射（二选一）

**方式一：使用 @WebServlet 注解（推荐）**

已在上面的代码中通过 `@WebServlet("/login.do")` 完成配置，无需额外操作。

**方式二：在 web.xml 中手动配置**

文件：`web/WEB-INF/web.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!-- 欢迎页 -->
    <welcome-file-list>
        <welcome-file>login.jsp</welcome-file>
    </welcome-file-list>

    <!-- LoginServlet 配置（如果不用注解，就在这里配置） -->
    <servlet>
        <servlet-name>LoginServlet</servlet-name>
        <servlet-class>com.blog.servlet.LoginServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>LoginServlet</servlet-name>
        <url-pattern>/login.do</url-pattern>
    </servlet-mapping>

</web-app>
```

## 知识点

### Servlet 是什么？

Servlet 就像"门卫"：

```
浏览器 ──请求──▶ Servlet（门卫）──调用──▶ Service（业务员）──查询──▶ Dao（采购员）
                    │
                    ├── 检查请求参数
                    ├── 调用业务逻辑
                    ├── 决定跳转哪个页面
                    └── 返回响应给浏览器
```

### HttpServletRequest 和 HttpServletResponse

| 对象 | 类比 | 作用 |
|------|------|------|
| HttpServletRequest（请求） | 顾客的点菜单 | 获取参数、获取 Session |
| HttpServletResponse（响应） | 端给顾客的菜 | 设置响应内容、重定向、设置 Cookie |

### 转发（forward） vs 重定向（redirect）

```
转发（forward）：
浏览器 ──请求──▶ Servlet ──转发──▶ login.jsp
浏览器地址栏不变，服务器内部跳转

重定向（redirect）：
浏览器 ──请求──▶ Servlet ──响应302──▶ 浏览器 ──新请求──▶ main.jsp
浏览器地址栏改变，两次请求
```

| 特性 | 转发 | 重定向 |
|------|------|--------|
| 地址栏 | 不变 | 改变 |
| 请求次数 | 1 次 | 2 次 |
| 能否共享 Request 数据 | 能 | 不能 |
| 使用场景 | 登录失败回显错误信息 | 登录成功跳转主页 |

## 检查清单

- [ ] `LoginServlet.java` 创建成功
- [ ] Servlet 映射配置正确（注解或 web.xml）
- [ ] 能获取前端传递的 username 和 password 参数
- [ ] 调用了 UserService.login() 方法
- [ ] 登录成功：用户信息存入 Session，重定向到 main.jsp
- [ ] 登录失败：错误信息存入 Request，转发回 login.jsp
- [ ] 无编译错误
