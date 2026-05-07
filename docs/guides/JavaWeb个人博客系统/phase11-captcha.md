# 阶段11：验证码功能

## 目标
实现登录时的图片验证码功能，防止暴力破解和机器人登录。

## 前置条件
- 阶段10 MD5 加密完成

## 操作步骤

### 11.1 创建验证码生成工具类

文件：`src/com/blog/util/CaptchaUtil.java`

```java
package com.blog.util;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Random;

public class CaptchaUtil {

    // 验证码字符集（去掉了容易混淆的字符：0/O, 1/I/l）
    private static final String CHARS = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    private static final int WIDTH = 120;
    private static final int HEIGHT = 40;
    private static final int CODE_LENGTH = 4;

    /**
     * 生成验证码图片并输出到 OutputStream
     * @param os 输出流
     * @return 生成的验证码字符串
     */
    public static String generate(OutputStream os) throws IOException {
        BufferedImage image = new BufferedImage(WIDTH, HEIGHT, BufferedImage.TYPE_INT_RGB);
        Graphics g = image.getGraphics();

        // 设置背景色
        g.setColor(getRandomColor(220, 250));
        g.fillRect(0, 0, WIDTH, HEIGHT);

        // 设置字体
        g.setFont(new Font("Arial", Font.BOLD, 30));

        // 生成随机验证码
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < CODE_LENGTH; i++) {
            String ch = String.valueOf(CHARS.charAt(random.nextInt(CHARS.length())));
            code.append(ch);
            g.setColor(getRandomColor(20, 130));
            g.drawString(ch, 25 * i + 15, 30);
        }

        // 画干扰线
        for (int i = 0; i < 6; i++) {
            g.setColor(getRandomColor(40, 180));
            int x1 = random.nextInt(WIDTH);
            int y1 = random.nextInt(HEIGHT);
            int x2 = random.nextInt(WIDTH);
            int y2 = random.nextInt(HEIGHT);
            g.drawLine(x1, y1, x2, y2);
        }

        // 画噪点
        for (int i = 0; i < 30; i++) {
            g.setColor(getRandomColor(100, 200));
            int x = random.nextInt(WIDTH);
            int y = random.nextInt(HEIGHT);
            g.drawOval(x, y, 2, 2);
        }

        g.dispose();
        ImageIO.write(image, "JPEG", os);
        return code.toString();
    }

    /**
     * 生成指定范围内的随机颜色
     */
    private static Color getRandomColor(int min, int max) {
        Random random = new Random();
        int r = min + random.nextInt(max - min);
        int g = min + random.nextInt(max - min);
        int b = min + random.nextInt(max - min);
        return new Color(r, g, b);
    }
}
```

### 11.2 创建验证码 Servlet

文件：`src/com/blog/servlet/CaptchaServlet.java`

```java
package com.blog.servlet;

import com.blog.util.CaptchaUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/captcha.do")
public class CaptchaServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 设置响应头，禁止缓存
        resp.setHeader("Pragma", "no-cache");
        resp.setHeader("Cache-Control", "no-cache");
        resp.setDateHeader("Expires", 0);
        resp.setContentType("image/jpeg");

        // 生成验证码图片
        String code = CaptchaUtil.generate(resp.getOutputStream());

        // 将验证码存入 Session（转为小写，方便比对）
        req.getSession().setAttribute("captcha", code.toLowerCase());
    }
}
```

### 11.3 更新 LoginServlet 增加验证码校验

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
}
```

### 11.4 更新登录页面增加验证码输入框

文件：`web/login.jsp`

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>博客系统 - 登录</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
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
        .captcha-group {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .captcha-group input {
            flex: 1;
        }
        .captcha-group img {
            cursor: pointer;
            border-radius: 5px;
            height: 44px;
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
        .btn-login:hover { opacity: 0.9; }
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
    <% if (request.getAttribute("errorMsg") != null) { %>
    <div class="error-msg"><%= request.getAttribute("errorMsg") %></div>
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
        <div class="form-group">
            <label for="captcha">验证码</label>
            <div class="captcha-group">
                <input type="text" id="captcha" name="captcha" placeholder="请输入验证码" required>
                <img src="captcha.do" alt="验证码" id="captchaImg"
                     onclick="this.src='captcha.do?'+Math.random()"
                     title="看不清？点击换一张">
            </div>
        </div>
        <button type="submit" class="btn-login">登 录</button>
    </form>
</div>
</body>
</html>
```

## 知识点

### 验证码的作用

```
没有验证码：
机器人 ──每秒100次请求──▶ 服务器 → 暴力破解密码

有验证码：
机器人 ──需要识别图片──▶ 服务器 → 大大降低破解速度
```

### Session 存储验证码的流程

```
1. 浏览器请求 captcha.do → Servlet 生成验证码图片和文字
2. 文字存入 Session: session.setAttribute("captcha", "aB3k")
3. 图片返回给浏览器显示
4. 用户输入验证码，提交表单
5. LoginServlet 从 Session 取出验证码，与用户输入比对
6. 比对通过 → 继续登录；比对失败 → 提示错误
```

### 点击换一张的实现

```javascript
onclick="this.src='captcha.do?'+Math.random()"
```

原理：每次点击时给 URL 加一个随机参数，浏览器认为是新请求，就不会用缓存的图片。

## 检查清单

- [ ] `CaptchaUtil.java` 创建成功
- [ ] `CaptchaServlet.java` 创建成功，映射到 `/captcha.do`
- [ ] `LoginServlet` 增加了验证码校验逻辑
- [ ] `login.jsp` 增加了验证码输入框和图片
- [ ] 验证码图片能正常显示
- [ ] 点击验证码图片能换一张
- [ ] 输入正确验证码能登录
- [ ] 输入错误验证码显示"验证码错误"
- [ ] 验证码不区分大小写
