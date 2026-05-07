# 阶段10：MD5 密码加密

## 目标
实现 MD5 密码加密，确保数据库中不存储明文密码。注册时加密存储，登录时加密后比对。

## 前置条件
- 阶段9登录功能集成完成

## 操作步骤

### 10.1 创建 MD5 工具类

文件：`src/com/blog/util/MD5Util.java`

```java
package com.blog.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MD5Util {

    /**
     * 对字符串进行 MD5 加密
     * @param source 原始字符串
     * @return 加密后的 32 位小写十六进制字符串
     */
    public static String md5(String source) {
        if (source == null) {
            source = "";
        }
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] bytes = md.digest(source.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                // 将每个字节转换为两位十六进制数
                String hex = Integer.toHexString(b & 0xFF);
                if (hex.length() == 1) {
                    sb.append("0");
                }
                sb.append(hex);
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 带盐值的 MD5 加密（解决碰撞问题）
     * @param source 原始字符串
     * @param salt 盐值
     * @return 加密后的字符串
     */
    public static String md5WithSalt(String source, String salt) {
        return md5(source + salt);
    }
}
```

### 10.2 更新数据库中的密码

将现有用户的明文密码替换为 MD5 加密后的值。

```sql
-- 先查看当前密码
SELECT id, username, password FROM user;

-- 将 admin 用户的密码更新为 MD5 加密值
-- MD5("123456") = "e10adc3949ba59abbe56e057f20f883e"
UPDATE user SET password = 'e10adc3949ba59abbe56e057f20f883e' WHERE username = 'admin';
```

### 10.3 更新 UserService 登录逻辑

修改 `UserServiceImpl`，在登录时对密码进行 MD5 加密后再查询。

文件：`src/com/blog/service/impl/UserServiceImpl.java`

```java
package com.blog.service.impl;

import com.blog.dao.UserDao;
import com.blog.dao.impl.UserDaoImpl;
import com.blog.entity.User;
import com.blog.service.UserService;
import com.blog.util.MD5Util;

public class UserServiceImpl implements UserService {

    private UserDao userDao = new UserDaoImpl();

    @Override
    public User login(String username, String password) {
        // 参数校验
        if (username == null || username.trim().isEmpty()) {
            return null;
        }
        if (password == null || password.trim().isEmpty()) {
            return null;
        }
        // 将密码进行 MD5 加密后再查询
        String encryptedPassword = MD5Util.md5(password);
        return userDao.findByUsernameAndPassword(username.trim(), encryptedPassword);
    }
}
```

### 10.4 测试加密登录

1. 重启 Tomcat
2. 使用 `admin` / `123456` 登录
3. 预期结果：登录成功（因为数据库里存的是 MD5 后的值，代码也先加密再比对）

## 知识点

### 为什么需要密码加密？

```
不加密（危险）：
数据库：admin | 123456        ← 数据库泄露，密码直接暴露

加密后（安全）：
数据库：admin | e10adc3949ba59abbe56e057f20f883e  ← 即使泄露，也无法反推原始密码
```

### MD5 的特点

| 特性 | 说明 |
|------|------|
| 不可逆 | 无法从加密结果反推出原始字符串 |
| 定长输出 | 不管输入多长，输出固定 32 位 |
| 雪崩效应 | 改一个字符，结果完全不同 |
| 碰撞可能 | 不同输入可能产生相同输出（概率极低） |

### 碰撞问题与盐值

MD5 存在"碰撞"问题：不同密码可能产生相同的 MD5 值。解决方案是加"盐值"：

```
普通 MD5：
MD5("123456") → e10adc3949ba59abbe56e057f20f883e

加盐 MD5：
MD5("123456" + "blog_salt") → 完全不同的结果
```

盐值就像"调料"：同样的食材（密码），加上不同的调料（盐值），做出来的菜（加密结果）完全不同。

### 登录加密流程

```
用户输入密码："123456"
        │
        ▼
MD5 加密 → "e10adc3949ba59abbe56e057f20f883e"
        │
        ▼
SQL: SELECT * FROM user WHERE password = "e10adc3949ba59abbe56e057f20f883e"
        │
        ▼
数据库中存的也是 "e10adc3949ba59abbe56e057f20f883e" → 匹配成功！
```

## 检查清单

- [ ] `MD5Util.java` 创建成功
- [ ] `md5()` 方法能正确生成 32 位小写十六进制字符串
- [ ] `md5WithSalt()` 方法实现正确
- [ ] 数据库中 admin 用户的密码已更新为 MD5 加密值
- [ ] `UserServiceImpl` 登录时先加密密码再查询
- [ ] 使用 admin/123456 能正常登录
- [ ] 数据库中看不到明文密码
