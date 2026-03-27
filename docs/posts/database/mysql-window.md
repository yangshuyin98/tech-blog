---
title: 'MySQL 8.4 窗口函数进阶：从排名到滑动聚合'
category: database
tags: ['MySQL', 'SQL']
date: 2026-03-12
readTime: '11 min'
---

## 窗口函数基础
窗口函数对一组行执行计算，但**不折叠行**（区别于 GROUP BY）。

```sql
-- 基本语法
SELECT
    employee_name,
    department,
    salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as rank
FROM employees;
```

## 排名函数的差异
```sql
SELECT
    name, score,
    ROW_NUMBER() OVER (ORDER BY score DESC) as rn,   -- 1,2,3,4,5 (不并列)
    RANK()       OVER (ORDER BY score DESC) as rnk,   -- 1,1,3,4,4 (并列跳号)
    DENSE_RANK() OVER (ORDER BY score DESC) as drnk,  -- 1,1,2,3,3 (并列不跳号)
    NTILE(4)     OVER (ORDER BY score DESC) as quartile -- 四分位
FROM students;
```

## 滑动聚合
用 FRAME 子句实现移动平均、累计求和：

```sql
SELECT
    date,
    revenue,
    -- 7天移动平均
    AVG(revenue) OVER (
        ORDER BY date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as moving_avg_7d,
    -- 累计求和
    SUM(revenue) OVER (ORDER BY date) as cumulative_sum
FROM daily_sales;
```

## 实际应用：Top-N 分组查询
```sql
-- 每个部门薪资前3的员工
WITH ranked AS (
    SELECT *, DENSE_RANK() OVER (
        PARTITION BY dept_id ORDER BY salary DESC
    ) as rnk
    FROM employees
)
SELECT * FROM ranked WHERE rnk <= 3;
```

## 总结
窗口函数是 SQL 中最强大的分析工具之一。掌握 `PARTITION BY`、`ORDER BY` 和 `FRAME` 三个维度，就能覆盖绝大多数分析场景。
