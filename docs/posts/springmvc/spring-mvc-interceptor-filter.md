---
title: 'Spring MVC 拦截器 vs 过滤器：一文搞清执行顺序与使用场景'
category: springmvc
tags: ['Spring MVC', '拦截器', '过滤器', 'Filter', 'Interceptor']
date: 2026-03-20
readTime: '14 min'
---

## 先看结论

```
请求 → Filter₁ → Filter₂ → DispatcherServlet
        → Interceptor₁.preHandle
          → Interceptor₂.preHandle
            → Controller 方法执行
          → Interceptor₂.postHandle
        → Interceptor₁.postHandle
      → Interceptor₂.afterCompletion
      → Interceptor₁.afterCompletion
    → Filter₂ → Filter₁ → 响应
```

**过滤器**是 Servlet 规范的东西，**拦截器**是 Spring MVC 的东西。它们是嵌套关系，不是二选一。

## Filter（过滤器）

### 本质

Filter 运行在 Servlet 容器层面，它不知道 Spring 的存在。所有请求（包括静态资源）都会经过 Filter。

### 实现方式

```java
@Component
public class RequestLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        long start = System.currentTimeMillis();

        log.info(">>> {} {}", req.getMethod(), req.getRequestURI());

        chain.doFilter(request, response); // 放行

        long duration = System.currentTimeMillis() - start;
        log.info("<<< {} {} ({}ms)", req.getMethod(), req.getRequestURI(), duration);
    }
}
```

### 控制 Filter 顺序

使用 `@Order` 或实现 `Ordered` 接口：

```java
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsFilter implements Filter { }

@Component
@Order(1)
public class AuthFilter implements Filter { }

@Component
@Order(2)
public class RequestLoggingFilter implements Filter { }
```

### Filter vs Servlet Filter 注册

```java
// 方式一：@Component（所有路径生效）
@Component
public class MyFilter implements Filter { }

// 方式二：FilterRegistrationBean（精确控制）
@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<RequestLoggingFilter> loggingFilter() {
        FilterRegistrationBean<RequestLoggingFilter> bean =
            new FilterRegistrationBean<>();
        bean.setFilter(new RequestLoggingFilter());
        bean.addUrlPatterns("/api/*");      // 只拦截 /api 路径
        bean.setOrder(1);
        bean.setName("requestLoggingFilter");
        return bean;
    }
}
```

## Interceptor（拦截器）

### 本质

Interceptor 运行在 Spring MVC 层面，可以访问 Spring 的 Bean，但**只拦截 Controller 请求**，不拦截静态资源。

### 实现方式

```java
@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {
        // 在 Controller 执行前调用
        // 返回 false 则中断请求，不会执行后续拦截器和 Controller
        String token = request.getHeader("Authorization");
        if (token == null) {
            response.setStatus(401);
            response.getWriter().write("{\"error\":\"未授权\"}");
            return false;
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request,
                           HttpServletResponse response,
                           Object handler,
                           ModelAndView modelAndView) throws Exception {
        // Controller 执行后、视图渲染前调用
        // 可以修改 ModelAndView
    }

    @Override
    public void afterCompletion(HttpServletRequest request,
                                HttpServletResponse response,
                                Object handler,
                                Exception ex) throws Exception {
        // 请求完成后调用（无论成功还是异常）
        // 适合做资源清理、日志记录
    }
}
```

### 注册拦截器

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private AuthInterceptor authInterceptor;

    @Autowired
    private PerformanceInterceptor perfInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
            .addPathPatterns("/api/**")          // 拦截
            .excludePathPatterns("/api/auth/**"); // 排除登录接口

        registry.addInterceptor(perfInterceptor)
            .addPathPatterns("/**");
    }
}
```

## 实战对比

### 场景一：请求耗时统计

```java
// ✅ 用 Filter（性能开销更小）
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class TimingFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        long start = System.nanoTime();
        chain.doFilter(request, response);
        long duration = (System.nanoTime() - start) / 1_000_000;

        HttpServletRequest req = (HttpServletRequest) request;
        log.info("{} {} - {}ms", req.getMethod(), req.getRequestURI(), duration);
    }
}
```

### 场景二：用户身份校验

```java
// ✅ 用 Interceptor（能访问 Spring Bean）
@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            sendError(response, 401, "缺少认证令牌");
            return false;
        }

        try {
            String userId = jwtService.parseToken(token.substring(7));
            User user = userService.findById(Long.parseLong(userId));
            request.setAttribute("currentUser", user);
            return true;
        } catch (Exception e) {
            sendError(response, 401, "令牌无效");
            return false;
        }
    }

    private void sendError(HttpServletResponse resp, int status, String msg)
            throws IOException {
        resp.setStatus(status);
        resp.setContentType("application/json");
        resp.getWriter().write("{\"error\":\"" + msg + "\"}");
    }
}
```

### 场景三：跨域处理

```java
// ✅ 用 Filter（CORS 需要在最早阶段处理）
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        HttpServletResponse resp = (HttpServletResponse) response;
        HttpServletRequest req = (HttpServletRequest) request;

        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        resp.setHeader("Access-Control-Max-Age", "3600");

        if ("OPTIONS".equals(req.getMethod())) {
            resp.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(request, response);
    }
}
```

## 选择指南

| 需求 | 选择 | 原因 |
|------|------|------|
| 跨域处理 | Filter | CORS 需要最早处理 |
| 请求日志 | Filter | 性能开销小 |
| 身份认证 | Interceptor | 需要注入 Spring Bean |
| 权限校验 | Interceptor | 需要访问 Controller 注解 |
| 修改响应头 | Filter | 更底层控制 |
| 操作 ModelAndView | Interceptor | postHandle 可以修改模型 |
| 静态资源也要拦截 | Filter | Interceptor 不拦截静态资源 |

::: tip 一句话总结
**Filter** 管"所有请求"，**Interceptor** 管"Controller 请求"。需要 Spring Bean 用 Interceptor，不需要就用 Filter。
:::

## 执行顺序速查

```
Filter（@Order 数字越小越先执行）
  └→ Interceptor（注册顺序）
       └→ @ControllerAdvice（全局异常处理）
            └→ Controller 方法
               └→ HandlerMethodReturnValueHandler
                    └→ HttpMessageConverter（如 Jackson 序列化）
```

## 总结

Filter 和 Interceptor 不是谁替代谁的关系，而是各司其职。掌握它们的执行顺序和适用场景，才能写出结构清晰的 Spring MVC 应用。
