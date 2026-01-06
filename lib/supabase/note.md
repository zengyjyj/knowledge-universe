# Server

= 在本地开发时 相当于跑的 next dev 进程

# Token

= 一段可以证明你身份的字符串
项目里是由 Supabase Auth（或者其他 Auth 服务）定义的
<br></br>
比如 supabase.auth.signInWithPassword({ email, password }) :
Supabase 生成一个 token 返回给浏览器，server 就可以用 token 的字符知道身份 而不用过问数据库

# Cookie

= 浏览器在“每次请求”时自动带给 Server 的小纸条

<br></br>

### 注册

1. 创建 auth user（email + password）
2. supabase 里的 trigger 自动添加 profile 行

### 登陆

=写入 cookie （supabase.auth.signInWithPassword({ email, password });）

1. HTTP 请求 → Supabase Auth Server
2. Supabase 校验 email + password
3. 生成 access token + refresh token
4. HTTP 响应返回
5. Supabase SDK 在浏览器里把 token 存进 cookie 同步更新内存 session
   (写 cookie”的代码在 Supabase SDK 内部,这里具体是：@supabase/ssr + createBrowserClient;内部使用 document.cookie = ... )
6. refresh（）触发 Server 重新读取 cookie

### 个人用户界面载入 《-- getCurrentProfile（）

= 看目前哪个身份（cookie）已经经过验证
