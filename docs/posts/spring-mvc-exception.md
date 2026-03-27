---
title: 'Spring MVC 统一异常处理：从 @ExceptionHandler 到 RFC 7807 ProblemDetail'
category: springmvc
tags: ['Spring MVC', '异常处理', 'REST API']
date: 2026-03-23
readTime: '15 min'
---

## 为什么要统一异常处理？

没有统一异常处理的 API：

```json
// 500 Internal Server Error
// 返回了一堆堆栈信息给前端... 😱
{
  "timestamp": "2026-03-23T10:00:00",
  "status": 500,
  "error": "Internal Server Error",
  "trace": "java.lang.NullPointerException\n  at com.example.UserService...",
  "path": "/api/users/1"
}
```

有了统一异常处理：

```json
// 404 Not Found
{
  "type": "about:blank",
  "title": "用户不存在",
  "status": 404,
  "detail": "ID 为 1 的用户未找到",
  "instance": "/api/users/1"
}
```

## 方案一：@ExceptionHandler（简单场景）

在 Controller 内部处理异常：

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }

    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(UserNotFoundException ex) {
        return new ErrorResponse("USER_NOT_FOUND", ex.getMessage());
    }
}
```

**缺点**：每个 Controller 都要写一遍，代码重复。

## 方案二：@ControllerAdvice（推荐）

全局异常处理器，一个类搞定所有异常：

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // 业务异常
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBusiness(BusinessException ex) {
        log.warn("业务异常: {}", ex.getMessage());
        return new ErrorResponse(ex.getCode(), ex.getMessage());
    }

    // 参数校验失败
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorResponse handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining("; "));

        return new ErrorResponse("VALIDATION_FAILED", message);
    }

    // 请求体 JSON 格式错误
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleJsonParse(HttpMessageNotReadableException ex) {
        return new ErrorResponse("INVALID_JSON", "请求体 JSON 格式错误");
    }

    // 方法不支持
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public ErrorResponse handleMethodNotSupported(
            HttpRequestMethodNotSupportedException ex) {
        return new ErrorResponse("METHOD_NOT_ALLOWED",
            "不支持 " + ex.getMethod() + " 方法");
    }

    // 兜底：未知异常
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleUnknown(Exception ex) {
        log.error("未处理的异常", ex);
        return new ErrorResponse("INTERNAL_ERROR", "服务器内部错误");
    }
}
```

## 方案三：RFC 7807 ProblemDetail（Spring 6+ 推荐）

Spring 6 引入了 RFC 7807 标准的 `ProblemDetail`，这是 REST API 异常处理的**最佳实践**：

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ProblemDetail handleNotFound(UserNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("用户不存在");
        problem.setType(URI.create("https://api.example.com/errors/user-not-found"));
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.UNPROCESSABLE_ENTITY, "参数校验失败");

        Map<String, String> errors = ex.getBindingResult().getFieldErrors()
            .stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "无效",
                (a, b) -> a
            ));

        problem.setProperty("errors", errors);
        return problem;
    }
}
```

响应示例：

```json
{
  "type": "https://api.example.com/errors/user-not-found",
  "title": "用户不存在",
  "status": 404,
  "detail": "ID 为 999 的用户未找到",
  "instance": "/api/users/999",
  "timestamp": "2026-03-23T10:00:00Z"
}
```

## 业务异常体系设计

```java
// 基础业务异常
public class BusinessException extends RuntimeException {
    private final String code;

    public BusinessException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() { return code; }
}

// 具体业务异常
public class UserNotFoundException extends BusinessException {
    public UserNotFoundException(Long id) {
        super("USER_NOT_FOUND", "ID 为 " + id + " 的用户未找到");
    }
}

public class InsufficientBalanceException extends BusinessException {
    public InsufficientBalanceException(BigDecimal required, BigDecimal actual) {
        super("INSUFFICIENT_BALANCE",
            String.format("余额不足：需要 %.2f，实际 %.2f", required, actual));
    }
}
```

## 异常与 HTTP 状态码映射

| 异常类型 | HTTP 状态码 | 场景 |
|----------|------------|------|
| `BusinessException` | 400 | 业务逻辑错误 |
| `MethodArgumentNotValidException` | 422 | 参数校验失败 |
| `HttpMessageNotReadableException` | 400 | JSON 格式错误 |
| `AccessDeniedException` | 403 | 权限不足 |
| `NoHandlerFoundException` | 404 | 路由不存在 |
| `HttpRequestMethodNotSupportedException` | 405 | 请求方法不支持 |
| `Exception` | 500 | 未知异常兜底 |

::: warning 生产环境注意
永远不要把堆栈信息返回给前端！在生产环境中 `Exception` 兜底处理器只返回通用错误消息，堆栈信息只记日志。
:::

## 总结

| 方案 | 适用场景 | 复杂度 |
|------|----------|--------|
| `@ExceptionHandler` | 单个 Controller 的特定异常 | 低 |
| `@ControllerAdvice` | 全局统一处理 | 中 |
| `ProblemDetail` | REST API 最佳实践 | 中 |

**推荐**：Spring Boot 3.x 项目直接用 `ProblemDetail`，它是标准，前后端都有明确的契约。
