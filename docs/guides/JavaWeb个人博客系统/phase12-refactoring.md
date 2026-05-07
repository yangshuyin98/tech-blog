# 阶段12：代码重构与配置优化

## 目标
抽取公共代码形成方法，配置网站默认访问页面，将数据库信息抽取到属性文件中。

## 前置条件
- 阶段11验证码功能完成

## 操作步骤

### 12.1 优化 DBUtil - 增加泛型查询方法

文件：`src/com/blog/util/DBUtil.java`（在原有基础上增加以下方法）

```java
/**
 * 查询单个值（如 COUNT、SUM 等聚合函数的结果）
 */
public static Object queryScalar(String sql, Object... params) throws SQLException {
    Map<String, Object> row = queryOne(sql, params);
    if (row != null && !row.isEmpty()) {
        return row.values().iterator().next();
    }
    return null;
}

/**
 * 查询整数结果
 */
public static Integer queryInt(String sql, Object... params) throws SQLException {
    Object result = queryScalar(sql, params);
    if (result instanceof Number) {
        return ((Number) result).intValue();
    }
    return null;
}
```

### 12.2 抽取验证码校验方法

在 LoginServlet 中验证码校验逻辑可以抽取为独立方法，方便复用。

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
        req.setCharacterEncoding("UTF-8");

        // 1. 获取前端参数
        String username = req.getParameter("username");
        String password = req.getParameter("password");
        String inputCode = req.getParameter("captcha");

        // 2. 校验验证码
        String sessionCode = (String) req.getSession().getAttribute("captcha");
        if (sessionCode == null || !sessionCode.equals(inputCode == null ? "" : inputCode.toLowerCase())) {
            req.setAttribute("errorMsg", "验证码错误");
            req.getRequestDispatcher("login.jsp").forward(req, resp);
            return;
        }

        // 3. 调用 Service 层验证登录
        User user = userService.login(username, password);

        // 4. 根据结果跳转
        if (user != null) {
            req.getSession().setAttribute("currentUser", user);
            req.getSession().removeAttribute("captcha");
            resp.sendRedirect("main.jsp");
        } else {
            req.setAttribute("errorMsg", "用户名或密码错误");
            req.getRequestDispatcher("login.jsp").forward(req, resp);
        }
    }
    /**
     * 校验验证码
     */
    private boolean checkCaptcha(HttpServletRequest req, String inputCode) {
        String sessionCode = (String) req.getSession().getAttribute("captcha");
        if (sessionCode == null || inputCode == null) {
            return false;
        }
        return sessionCode.equals(inputCode.toLowerCase());
    }
}
```

### 12.3 配置网站默认访问页面

修改 `web.xml`，设置默认访问 `login.jsp`。

文件：`web/WEB-INF/web.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!-- 默认访问页面 -->
    <welcome-file-list>
        <welcome-file>login.jsp</welcome-file>
    </welcome-file-list>

</web-app>
```

> 注：如果使用 `@WebServlet` 注解，Servlet 映射不需要在 web.xml 中配置。

### 12.4 确保数据库配置文件可读

确认 `db.properties` 在 classpath 中。如果使用 IDEA，需要将 `src` 目录标记为 Resources Root：

1. 右键 `src` 目录
2. Mark Directory as → Resources Root

或者将 `db.properties` 放在 `web/WEB-INF/classes/` 目录下。

## 知识点

### 为什么要重构？

重构就像"整理房间"：

```
重构前：                      重构后：
┌─────────────────┐          ┌─────────────────┐
│ doSomething() { │          │ doSomething() { │
│   // 100行代码   │          │   step1();      │
│   // 混在一起    │   ──▶    │   step2();      │
│   // 看不懂     │          │   step3();      │
│ }               │          │ }               │
└─────────────────┘          └─────────────────┘
```

好处：
- 代码更清晰（方法名就是注释）
- 方便复用（其他地方也能调用 step1()）
- 方便测试（可以单独测试每个方法）

### 属性文件（.properties）

属性文件是 Java 中最简单的配置文件格式：

```properties
# key=value 格式
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/blog
username=root
password=123456
```

好处：修改配置不用改 Java 代码，改完重启即可生效。

## 检查清单

- [ ] DBUtil 增加了 `queryScalar` 和 `queryInt` 方法
- [ ] LoginServlet 中验证码校验逻辑抽取为独立方法
- [ ] `web.xml` 配置了默认访问页面
- [ ] `db.properties` 在 classpath 中可正常读取
- [ ] 直接访问 `http://localhost:8080/` 能跳转到登录页
- [ ] 所有功能正常工作（登录、验证码、加密）
