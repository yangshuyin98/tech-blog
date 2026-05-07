# 阶段6：用户登录 - Service 层

## 目标
创建 UserService 接口及其实现类，封装登录的业务逻辑。

## 前置条件
- 阶段5 UserDao 创建完成

## 操作步骤

### 6.1 创建 UserService 接口

文件：`src/com/blog/service/UserService.java`

```java
package com.blog.service;

import com.blog.entity.User;

public interface UserService {
    /**
     * 用户登录
     * @param username 用户名
     * @param password 密码
     * @return 登录成功返回用户对象，失败返回 null
     */
    User login(String username, String password);
}
```

### 6.2 创建 UserService 实现类

文件：`src/com/blog/service/impl/UserServiceImpl.java`

```java
package com.blog.service.impl;

import com.blog.dao.UserDao;
import com.blog.dao.impl.UserDaoImpl;
import com.blog.entity.User;
import com.blog.service.UserService;

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
        // 调用 Dao 层查询用户
        return userDao.findByUsernameAndPassword(username.trim(), password);
    }
}
```

## 知识点

### Service 层与 Dao 层的区别

| 对比项 | Dao 层 | Service 层 |
|--------|--------|-----------|
| 职责 | 数据库操作 | 业务逻辑处理 |
| 关注点 | 怎么存取数据 | 业务规则是什么 |
| 举例 | SELECT * FROM user | 用户名不能为空、密码要加密 |

```
请求流程：
Controller → Service → Dao → 数据库
                ↑
           这里做业务判断
           （如：参数校验、密码加密、权限检查）
```

### 为什么 Service 要调用 Dao，而不是直接写 SQL？

如果 Service 直接写 SQL，就会变成这样：

```java
// 不好的做法：Service 里写 SQL
public User login(String username, String password) {
    String sql = "SELECT * FROM user WHERE username=? AND password=?";
    // ... JDBC 代码 ...
}
```

这样做有两个问题：
1. **代码重复**：每个 Service 方法都要写一遍 JDBC 代码
2. **职责混乱**：Service 管了不该管的事（数据库操作）

正确的做法是分层：

```java
// 好的做法：Service 调用 Dao
public User login(String username, String password) {
    return userDao.findByUsernameAndPassword(username, password);
}
```

## 检查清单

- [ ] `UserService.java` 接口创建成功
- [ ] `UserServiceImpl.java` 实现类创建成功
- [ ] `login` 方法包含参数校验逻辑
- [ ] Service 调用了 Dao，没有直接写 SQL
- [ ] 无编译错误
