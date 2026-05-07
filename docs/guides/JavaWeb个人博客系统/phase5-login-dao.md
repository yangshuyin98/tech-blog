# 阶段5：用户登录 - Dao 层

## 目标
创建 UserDao 接口及其实现类，提供根据用户名和密码查询用户的方法。

## 前置条件
- 阶段3实体类创建完成
- 阶段4数据库工具类封装完成

## 操作步骤

### 5.1 创建 UserDao 接口

文件：`src/com/blog/dao/UserDao.java`

```java
package com.blog.dao;

import com.blog.entity.User;

public interface UserDao {
    /**
     * 根据用户名和密码查询用户（登录验证）
     * @param username 用户名
     * @param password 密码
     * @return 用户对象，未找到返回 null
     */
    User findByUsernameAndPassword(String username, String password);
}
```

### 5.2 创建 UserDao 实现类

文件：`src/com/blog/dao/impl/UserDaoImpl.java`

```java
package com.blog.dao.impl;

import com.blog.dao.UserDao;
import com.blog.entity.User;
import com.blog.util.DBUtil;

import java.util.Map;

public class UserDaoImpl implements UserDao {

    @Override
    public User findByUsernameAndPassword(String username, String password) {
        String sql = "SELECT * FROM user WHERE username = ? AND password = ?";
        try {
            Map<String, Object> row = DBUtil.queryOne(sql, username, password);
            if (row != null) {
                User user = new User();
                user.setId((Integer) row.get("id"));
                user.setUsername((String) row.get("username"));
                user.setPassword((String) row.get("password"));
                user.setNickname((String) row.get("nickname"));
                user.setAvatar((String) row.get("avatar"));
                user.setEmail((String) row.get("email"));
                user.setSignature((String) row.get("signature"));
                return user;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

## 知识点

### 接口与实现类

接口就像"菜单"，实现类就像"实际的菜"：

```
接口（菜单）：          实现类（实际的菜）：
┌──────────────┐       ┌────────────────────┐
│ UserDao      │       │ UserDaoImpl        │
├──────────────┤       ├────────────────────┤
│ findBy..()   │──────▶│ 具体的 SQL 查询代码  │
└──────────────┘       └────────────────────┘
```

**好处：**
- 如果以后要换成 MyBatis，只需写一个新的实现类，不用改 Service 层代码
- 方便单元测试（可以写一个 Mock 实现类）

### Dao 层的职责

Dao 层只做一件事：**和数据库打交道**。

```
Dao 不管的事：
  ✗ 密码是否正确（这是 Service 的事）
  ✗ 登录失败怎么提示用户（这是 Servlet 的事）
  ✗ 业务规则判断

Dao 只管的事：
  ✓ 拼 SQL
  ✓ 执行 SQL
  ✓ 把结果转成 Java 对象
```

### Map 转 Entity 的过程

```
数据库返回的 Map:          转换后的 User 对象:
{                         User {
  "id" → 1,                  id = 1,
  "username" → "admin",      username = "admin",
  "password" → "xxx",        password = "xxx",
  "nickname" → "博主"         nickname = "博主"
}                         }
```

## 检查清单

- [ ] `UserDao.java` 接口创建成功
- [ ] `UserDaoImpl.java` 实现类创建成功
- [ ] `findByUsernameAndPassword` 方法实现正确
- [ ] SQL 使用了参数化查询（`?` 占位符）
- [ ] Map 到 User 对象的转换完整，无遗漏字段
- [ ] 无编译错误
