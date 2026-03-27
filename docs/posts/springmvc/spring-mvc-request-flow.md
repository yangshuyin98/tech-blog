---
title: 'Spring MVC 请求处理流程源码深度解析'
category: springmvc
tags: ['Spring MVC', '源码', 'DispatcherServlet']
date: 2026-03-25
readTime: '20 min'
---

## 从一个 HTTP 请求说起

当浏览器发起 `GET /api/users/1` 时，Tomcat 收到请求后交给 `DispatcherServlet` 处理。这是 Spring MVC 的**核心入口**，所有请求都经过它。

```java
// DispatcherServlet 继承链
HttpServlet → HttpServletBean → FrameworkServlet → DispatcherServlet
```

## 核心处理流程

Spring MVC 处理一个请求要经过 **9 大组件**协作：

```
请求 → DispatcherServlet
  ├─ 1. HandlerMapping      ← 找到对应的 Controller 方法
  ├─ 2. HandlerAdapter      ← 适配并执行 Controller
  ├─ 3. HandlerInterceptor  ← 拦截器前置处理
  ├─ 4. HandlerMethod       ← 具体执行的方法
  ├─ 5. HandlerExceptionResolver ← 异常处理
  ├─ 6. HandlerMethodReturnValueHandler ← 返回值处理
  ├─ 7. ViewResolver        ← 视图解析
  ├─ 8. View                ← 视图渲染
  └─ 9. DispatcherServlet   ← 统一调度
```

## 源码走读

### 第一步：doDispatch 入口

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) {
    HttpServletRequest processedRequest = request;
    HandlerExecutionChain mappedHandler = null;

    try {
        // 1. 通过 HandlerMapping 找到处理器
        mappedHandler = getHandler(processedRequest);
        if (mappedHandler == null) {
            noHandlerFound(processedRequest, response);
            return;
        }

        // 2. 通过 HandlerAdapter 找到适配器
        HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());

        // 3. 执行拦截器的 preHandle
        if (!mappedHandler.applyPreHandle(processedRequest, response)) {
            return;
        }

        // 4. 真正执行 Controller 方法
        ModelAndView mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

        // 5. 执行拦截器的 postHandle
        mappedHandler.applyPostHandle(processedRequest, response, mv);

        // 6. 处理结果（渲染视图或写入响应）
        processDispatchResult(processedRequest, response, mappedHandler, mv, null);

    } catch (Exception ex) {
        // 7. 异常处理
        processDispatchResult(processedRequest, response, mappedHandler, null, ex);
    }
}
```

### 第二步：HandlerMapping 路由匹配

Spring Boot 默认使用 `RequestMappingHandlerMapping`，它在启动时扫描所有 `@RequestMapping` 注解，构建路由表：

```java
// 启动时注册
@GetMapping("/api/users/{id}")
public User getUser(@PathVariable Long id) {
    return userService.findById(id);
}

// 内部存储结构
Map<RequestMappingInfo, HandlerMethod> handlerMethods;
// key = RequestMappingInfo{patterns=[/api/users/{id}], methods=[GET]}
// value = HandlerMethod{UserController#getUser}
```

匹配过程使用 `AntPathMatcher`，支持：

| 模式 | 示例 | 说明 |
|------|------|------|
| `?` | `/api/user?` | 匹配单个字符 |
| `*` | `/api/*` | 匹配一段路径 |
| `**` | `/api/**` | 匹配多段路径 |
| `{id}` | `/api/users/{id}` | 路径变量 |

### 第三步：参数解析（HandlerMethodArgumentResolver）

这是 Spring MVC 最精妙的部分。每个 `@RequestParam`、`@PathVariable`、`@RequestBody` 都由专门的解析器处理：

```java
// 常用的参数解析器
@RequestParam  → RequestParamMethodArgumentResolver
@PathVariable  → PathVariableMethodArgumentResolver
@RequestBody   → RequestResponseBodyMethodProcessor
@ModelAttribute → ServletModelAttributeMethodProcessor
@RequestHeader → RequestHeaderMethodArgumentResolver
```

自定义解析器示例：

```java
@Component
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUser.class)
            && parameter.getParameterType().equals(User.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) {
        // 从 SecurityContext 或 Token 中获取当前用户
        return SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
    }
}
```

注册自定义解析器：

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private CurrentUserArgumentResolver currentUserResolver;

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(currentUserResolver);
    }
}
```

### 第四步：返回值处理

Controller 方法的返回值由 `HandlerMethodReturnValueHandler` 处理：

| 返回类型 | 处理器 | 行为 |
|----------|--------|------|
| `String` | ViewNameMethodReturnValueHandler | 视图名 |
| `void` | RequestResponseBodyMethodProcessor | 写入响应体 |
| `ResponseEntity<T>` | HttpEntityMethodProcessor | 完整控制响应 |
| `ModelAndView` | ModelAndViewMethodReturnValueHandler | 视图+模型 |

## 性能优化建议

::: tip 路由数量影响匹配速度
路由表超过 500 条时，匹配耗时会明显增加。建议：
- 避免过于细粒度的路由拆分
- 合理使用路径前缀分组
:::

```java
// ❌ 不推荐：每个方法一个路由
@GetMapping("/user/list")
@GetMapping("/user/detail")
@GetMapping("/user/create")

// ✅ 推荐：合理分组
@RequestMapping("/api/v1/users")
public class UserController {
    @GetMapping
    public List<User> list() { }

    @GetMapping("/{id}")
    public User detail(@PathVariable Long id) { }
}
```

## 总结

Spring MVC 的请求处理看似简单，背后是 9 大组件的精密协作。理解这个流程，才能在遇到问题时快速定位——是路由没匹配上？参数解析失败？还是返回值处理异常？

**下一步**：读源码时重点关注 `DispatcherServlet.doDispatch()` 方法，这是理解整个流程的关键。
