# 阶段4：数据库工具类封装

## 目标
封装 JDBC 工具类 `DBUtil`，提供获取连接、执行查询、执行增删改的通用方法，避免每个 Dao 类重复写 JDBC 代码。

## 前置条件
- 阶段1项目搭建完成
- MySQL JDBC 驱动已添加到 lib 目录

## 操作步骤

### 4.1 创建数据库配置文件

将数据库连接信息抽取到独立的配置文件中，方便修改。

文件：`src/db.properties`

```properties
# 数据库连接配置
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/blog?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
username=root
password=123456
```

> 注意：`username` 和 `password` 请根据你的 MySQL 实际配置修改。

### 4.2 创建 DBUtil 工具类

文件：`src/com/blog/util/DBUtil.java`

```java
package com.blog.util;

import java.io.InputStream;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

public class DBUtil {

    private static String driver;
    private static String url;
    private static String username;
    private static String password;

    // 静态代码块：类加载时读取配置文件
    static {
        try {
            Properties props = new Properties();
            InputStream is = DBUtil.class.getClassLoader().getResourceAsStream("db.properties");
            props.load(is);
            driver = props.getProperty("driver");
            url = props.getProperty("url");
            username = props.getProperty("username");
            password = props.getProperty("password");
            Class.forName(driver);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取数据库连接
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }

    /**
     * 关闭资源
     */
    public static void close(Connection conn, Statement stmt, ResultSet rs) {
        try {
            if (rs != null) rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        try {
            if (stmt != null) stmt.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        try {
            if (conn != null) conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * 执行查询，返回 List<Map<String, Object>>
     * 每一行数据封装成一个 Map，key 是列名，value 是列值
     */
    public static List<Map<String, Object>> queryList(String sql, Object... params) throws SQLException {
        List<Map<String, Object>> list = new ArrayList<>();
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(sql);
            // 设置参数
            if (params != null) {
                for (int i = 0; i < params.length; i++) {
                    pstmt.setObject(i + 1, params[i]);
                }
            }
            rs = pstmt.executeQuery();
            ResultSetMetaData meta = rs.getMetaData();
            int columnCount = meta.getColumnCount();
            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                for (int i = 1; i <= columnCount; i++) {
                    row.put(meta.getColumnLabel(i), rs.getObject(i));
                }
                list.add(row);
            }
        } finally {
            close(conn, pstmt, rs);
        }
        return list;
    }

    /**
     * 执行查询，返回单条记录
     */
    public static Map<String, Object> queryOne(String sql, Object... params) throws SQLException {
        List<Map<String, Object>> list = queryList(sql, params);
        return list.isEmpty() ? null : list.get(0);
    }

    /**
     * 执行增删改操作，返回受影响行数
     */
    public static int executeUpdate(String sql, Object... params) throws SQLException {
        Connection conn = null;
        PreparedStatement pstmt = null;
        try {
            conn = getConnection();
            pstmt = conn.prepareStatement(sql);
            if (params != null) {
                for (int i = 0; i < params.length; i++) {
                    pstmt.setObject(i + 1, params[i]);
                }
            }
            return pstmt.executeUpdate();
        } finally {
            close(conn, pstmt, null);
        }
    }
}
```

### 4.3 测试数据库连接

创建一个临时测试类验证工具类是否正常工作。

文件：`src/com/blog/test/DBTest.java`

```java
package com.blog.test;

import com.blog.util.DBUtil;
import java.util.List;
import java.util.Map;

public class DBTest {
    public static void main(String[] args) {
        try {
            // 测试查询用户表
            String sql = "SELECT * FROM user";
            List<Map<String, Object>> users = DBUtil.queryList(sql);
            System.out.println("查询到 " + users.size() + " 条用户记录：");
            for (Map<String, Object> user : users) {
                System.out.println("  用户名：" + user.get("username") + "，昵称：" + user.get("nickname"));
            }

            // 测试查询文章表
            sql = "SELECT * FROM article";
            List<Map<String, Object>> articles = DBUtil.queryList(sql);
            System.out.println("查询到 " + articles.size() + " 篇文章：");
            for (Map<String, Object> article : articles) {
                System.out.println("  标题：" + article.get("title") + "，阅读量：" + article.get("view_count"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

运行 `DBTest.main()` 方法，控制台应输出用户和文章数据。

## 知识点

### 为什么要封装 JDBC？

原始 JDBC 代码的痛点：

```
每次操作数据库都要写：
1. 获取连接 ──→ 重复代码
2. 创建 PreparedStatement ──→ 重复代码
3. 设置参数 ──→ 重复代码
4. 执行 SQL ──→ 重复代码
5. 处理结果 ──→ 重复代码
6. 关闭连接 ──→ 重复代码
```

封装后，一行代码搞定：
```java
DBUtil.queryList("SELECT * FROM user WHERE id = ?", 1);
```

### PreparedStatement 的好处

| 方式 | 安全性 | 性能 |
|------|--------|------|
| Statement（拼接 SQL） | 容易被 SQL 注入攻击 | 每次编译 SQL |
| PreparedStatement（参数化） | 防止 SQL 注入 | 预编译，复用执行计划 |

```java
// 危险！SQL 注入
String sql = "SELECT * FROM user WHERE username='" + username + "'";

// 安全！参数化查询
String sql = "SELECT * FROM user WHERE username=?";
pstmt.setString(1, username);
```

### 静态代码块

```java
static {
    // 类第一次被使用时执行一次，之后不再执行
    // 适合做初始化工作（如加载配置、注册驱动）
}
```

就像"第一次进公司时办入职手续"，只办一次。

## 检查清单

- [ ] `db.properties` 配置文件创建成功
- [ ] `DBUtil.java` 创建成功，包含 `getConnection`、`queryList`、`queryOne`、`executeUpdate` 方法
- [ ] `DBTest.java` 运行成功，能查到数据库中的用户和文章数据
- [ ] 控制台输出正确，无异常信息
- [ ] 确认数据库连接参数（host、port、用户名、密码）正确
