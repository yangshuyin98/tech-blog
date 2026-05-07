---
title: 'Spring Security 6.x 零信任架构实践：从 JWT 到 OAuth2.1'
category: springboot
tags: ['Security', '微服务']
date: 2026-03-20
readTime: '12 min'
---

## 为什么需要零信任？
传统安全模型假设内网是可信的——一旦进入网络边界，访问便被放行。但随着微服务拆分、云原生部署、远程办公成为常态，**边界早已消失**。

**零信任（Zero Trust）**的核心原则：**永不信任，始终验证。**每一次请求都需要认证、授权、加密，无论请求来自内网还是外网。

## Spring Security 6.x 的架构变革
Spring Security 6.x（对应 Spring Boot 3.x）做出了几个关键变化：

- **移除了 WebSecurityConfigurerAdapter** — 必须使用组件化配置
- **FilterChain 新范式** — `SecurityFilterChain` 作为 Bean 注册
- **AuthorizationManager** — 取代了旧的 `access()` 表达式
- **默认启用 CSRF、安全头** — 更严格的默认安全策略

## 第一步：基础安全配置

::: warning 注意
Spring Security 6.x 不再支持继承 `WebSecurityConfigurerAdapter`，所有配置通过 `@Bean` 方式注入。
:::

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(Customizer.withDefaults())
            );

        return http.build();
    }
}
```

## 第二步：JWT 令牌配置
JWT（JSON Web Token）是零信任架构中最常用的无状态认证方案。Spring Security 6.x 原生支持 JWT 解析和验证。

```java
@Configuration
public class JwtConfig {

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder decoder = NimbusJwtDecoder
            .withJwkSetUri("https://auth.example.com/.well-known/jwks.json")
            .build();

        // 自定义验证逻辑
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
            JwtValidators.createDefaultWithIssuer("https://auth.example.com"),
            new JwtTimestampValidator(Duration.ofSeconds(30)),
            this::validateAudience
        ));

        return decoder;
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        JWK jwk = new RSAKey.Builder(rsaPublicKey())
                .privateKey(rsaPrivateKey())
                .keyID(UUID.randomUUID().toString())
                .build();
        JWKSource<SecurityContext> jwkSource = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwkSource);
    }
}
```

## 第三步：OAuth2.1 授权服务器
OAuth2.1 整合了 OAuth 2.0 的多个扩展（PKCE、DPoP 等），成为统一标准。使用 Spring Authorization Server 可以快速搭建：

```java
@Configuration
public class AuthServerConfig {

    @Bean
    @Order(1)
    public SecurityFilterChain authorizationServerSecurityFilterChain(HttpSecurity http)
            throws Exception {
        OAuth2AuthorizationServerConfiguration.applyDefaultSecurity(http);
        http.getConfigurer(OAuth2AuthorizationServerConfigurer.class)
            .oidc(Customizer.withDefaults());  // OpenID Connect 1.0

        return http
            .exceptionHandling(exceptions -> exceptions
                .defaultAuthenticationEntryPointFor(
                    new LoginUrlAuthenticationEntryPoint("/login"),
                    new MediaTypeRequestMatcher(MediaType.TEXT_HTML)
                ))
            .build();
    }
}
```

## 第四步：细粒度授权策略
零信任要求**最小权限原则**。Spring Security 6.x 引入了 `AuthorizationManager`，支持方法级别的精细控制：

```java
@Configuration
@EnableMethodSecurity
public class MethodSecurityConfig {

    @Bean
    public MethodSecurityExpressionHandler methodSecurityExpressionHandler() {
        DefaultMethodSecurityExpressionHandler handler =
            new DefaultMethodSecurityExpressionHandler();
        handler.setPermissionEvaluator(new CustomPermissionEvaluator());
        return handler;
    }
}

// 业务层使用
@Service
public class OrderService {

    @PreAuthorize("hasAuthority('ORDER_READ') and #userId == authentication.principal.id")
    public Order getOrder(Long orderId, Long userId) {
        return orderRepository.findById(orderId).orElseThrow();
    }

    @PostAuthorize("returnObject.userId == authentication.principal.id")
    public Order getOrder(Long orderId) {
        return orderRepository.findById(orderId).orElseThrow();
    }
}
```

## 第五步：Token 生命周期管理
| 策略 | Access Token | Refresh Token | 适用场景 |
| --- | --- | --- | --- |
| 短生命周期 | 5-15 分钟 | 7-30 天 | Web 应用（推荐） |
| 中等生命周期 | 1-2 小时 | 30 天 | 内部系统 |
| 长生命周期 | 24 小时 | 90 天 | CLI 工具 |

**Token 黑名单机制：**即使 Token 还在有效期内，也可以主动废弃（用户登出、密码修改、异常检测时）：

```java
@Component
public class JwtBlacklistFilter extends OncePerRequestFilter {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String token = extractToken(request);
        if (token != null) {
            String jti = extractJti(token);
            if (Boolean.TRUE.equals(redisTemplate.hasKey("blacklist:" + jti))) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }
        chain.doFilter(request, response);
    }
}
```

## 生产环境注意事项

::: tip 提示
安全配置没有银弹。JWT + OAuth2.1 解决了认证问题，但还需要配合：
:::

- **HTTPS 强制** — 所有通信必须加密
- **CORS 精确配置** — 只允许已知来源
- **Rate Limiting** — 防止暴力破解和 DDoS
- **日志审计** — 记录所有认证/授权事件
- **密钥轮换** — 定期更换 JWT 签名密钥

## 总结
Spring Security 6.x 通过组件化配置、原生 JWT 支持和 AuthorizationManager，为零信任架构提供了完整的基础设施。关键是理解**"永不信任，始终验证"**的原则，然后用代码把它落实到每一层。

完整示例代码已上传 GitHub：`github.com/yangshuyin98/tech-blog`
