---
title: Flutter 项目架构与开发手册
description: 面向 Flutter 初学者的完整项目架构设计指南，包含目录结构、核心工具概念（Riverpod、Dio、GoRouter、freezed 等）、分层架构与数据流，帮助你从零构建可维护的 Flutter 应用。
date: 2025-02-06
tags:
  - Flutter
  - Dart
  - 移动开发
  - 工程化
---

> 本文面向有编程经验但 Flutter 零基础的开发者，提供结构清晰、层次分明的项目架构与开发手册。涵盖目录设计、核心工具概念、数据流与快速上手，可作为日常开发的参考手册。

**适用场景**：本架构面向**中大型项目**（多人协作、功能模块较多、需长期维护）。若为个人小项目或简单 CRUD，可大幅简化：如仅保留 `lib/screens/` + `lib/services/`，或省略 Domain 层，按需裁剪。

**如何评估项目规模**：可从以下维度综合判断，满足多数「小」则偏小，满足多数「大」则偏大，介于中间则偏中。

| 维度 | 小 | 中 | 大 |
|------|-----|-----|-----|
| **团队** | 1 人 | 2～5 人 | 5+ 人 / 多团队 |
| **功能模块** | 1～3 个（如登录+列表+详情） | 4～10 个 | 10+ 个，多领域 |
| **页面数量** | 5 屏以内 | 5～25 屏 | 25+ 屏 |
| **业务复杂度** | 简单 CRUD，无复杂规则 | 有流程、状态机、多数据源 | 强领域逻辑、离线、同步 |
| **维护周期** | 短期（周～月） | 数月～1 年 | 长期（年+） |
| **数据层** | 单一 API 或本地 | API + 本地缓存 | 多源、离线优先、复杂同步 |

**架构裁剪建议**：小项目用 `screens/` + `services/` 即可；中项目采用本文完整结构；大项目可考虑将 feature 拆为独立 package，或引入更多领域划分。

---

## 一、Flutter 核心概念速览

在进入架构之前，先理解 Flutter 的底层思维，便于你快速建立心智模型。

### 1.1 一切皆 Widget

Flutter 的 UI 由 **Widget** 组成，类似于 Vue 的组件、React 的 Component。

| 概念 | 类比 | 说明 |
|------|------|------|
| **Widget** | Vue 组件 / React 组件 | UI 的构建块，可以是按钮、文本、布局容器 |
| **StatefulWidget** | 有状态的组件 | 内部有可变数据，数据变化会触发重建 |
| **StatelessWidget** | 无状态组件 | 纯展示，无内部可变状态 |
| **BuildContext** | Vue 的 `this` / React 的 context | 当前 Widget 在树中的位置，用于获取主题、路由等 |

**关键理解**：Widget 是**不可变的**（immutable）。要更新 UI，不是修改 Widget，而是用新数据**重建** Widget 树。状态管理（如 Riverpod）的本质，就是「谁持有数据、谁触发重建」。

### 1.2 Dart 语言要点（有经验者可略读）

- **空安全**：变量默认非空，需显式加 `?` 表示可空，如 `String? name`
- **异步**：`Future` 类似 Promise，`async/await` 语法与 JS 一致
- **没有 `new`**：`User()` 即可，`new` 可选
- **级联操作符**：`obj..a = 1..b = 2` 连续调用，返回原对象

---

## 二、项目目录结构（完整版）

基于 **Core / Shared / Features** 混合模式 + **Data / Domain / Presentation** 分层，推荐结构如下：

```
lib/
├── main.dart                    # 入口：初始化 App、Provider、Router
├── app.dart                     # 根组件：Theme、Router 配置
│
├── core/                        # 核心基础设施（框架级，与业务无关）
│   ├── config/                  # 环境配置
│   │   └── env.dart
│   ├── network/                 # 网络层
│   │   ├── dio_client.dart      # Dio 封装
│   │   └── api_interceptor.dart # 拦截器（Token、错误处理）
│   ├── router/                  # 路由
│   │   └── app_router.dart
│   ├── theme/                   # 主题
│   │   └── app_theme.dart
│   ├── location/                # 定位能力（设备级）
│   │   └── location_service.dart
│   ├── utils/                   # 纯工具函数
│   │   └── validators.dart
│   └── exceptions/              # 全局异常定义
│       └── app_exception.dart
│
├── shared/                      # 共享层（跨 Feature 复用）
│   ├── components/              # 通用 UI 组件
│   │   ├── app_button.dart
│   │   ├── app_loading.dart
│   │   └── app_error_widget.dart
│   ├── models/                  # 通用数据模型
│   │   └── user.dart
│   └── services/                # 通用服务（多 Feature 共用时放入）
│       └── storage_service.dart
│
└── features/                    # 业务模块（按功能领域划分）
    ├── auth/                    # 示例：认证模块
    │   ├── data/                # 数据层
    │   │   ├── dtos/            # 数据传输对象（API JSON 结构）
    │   │   │   └── login_dto.dart
    │   │   ├── datasources/
    │   │   │   ├── remote/      # 远程 API
    │   │   │   │   └── auth_remote_datasource.dart
    │   │   │   └── local/       # 本地存储（缓存、DB）
    │   │   │       └── auth_local_datasource.dart
    │   │   └── repositories/
    │   │       └── auth_repository_impl.dart
    │   │
    │   ├── domain/              # 领域层（按需添加，见 2.1 节）
    │   │   ├── entities/        # 业务实体
    │   │   │   └── user_entity.dart
    │   │   └── repositories/    # 仓储接口（抽象，简单模块可省略）
    │   │       └── auth_repository.dart
    │   │
    │   └── presentation/        # 表现层
    │       ├── providers/        # Riverpod Provider 定义
    │       │   └── auth_providers.dart
    │       ├── controllers/     # 状态逻辑（Notifier）
    │       │   └── auth_controller.dart
    │       ├── pages/            # 页面（Scaffold）
    │       │   ├── login_page.dart
    │       │   └── register_page.dart
    │       └── widgets/         # 模块内私有组件
    │           └── login_form.dart
    │
    └── map/                     # 示例：地图模块
        ├── data/
        ├── domain/
        └── presentation/
```

### 2.1 Domain 层何时引入（YAGNI）

| 场景 | 建议 |
|------|------|
| **简单 CRUD、单一数据源** | 可省略 domain，data 层直接提供 Repository 实现类，presentation 直接依赖 |
| **需 Mock 测试、多数据源切换** | 引入 domain 层，定义 Repository 接口，data 实现 |
| **复杂业务规则、多实体协作** | 引入完整 domain 层（entities + 接口） |

**原则**：默认可不建 domain，仅在「需要抽象」时再引入，避免过度设计。

### 2.2 目录职责速查表

| 目录 | 职责 | 依赖方向 |
|------|------|----------|
| `core/` | 框架配置、网络、路由、主题、定位 | 被所有层依赖 |
| `shared/` | 跨 Feature 的组件、模型、服务 | 被 features 依赖 |
| `features/*/data/` | 获取与持久化数据（API、DB） | 实现 domain 接口 |
| `features/*/domain/` | 业务实体与仓储接口 | 无依赖（最纯粹） |
| `features/*/presentation/` | UI、状态、用户交互 | 依赖 domain |

---

## 三、核心工具与概念详解

以下工具是构建现代 Flutter 项目的标配，理解它们能大幅提升开发效率。

### 3.1 Riverpod —— 依赖注入与状态管理

**是什么**：Riverpod 是 Flutter 官方推荐的**状态管理 + 依赖注入**方案，可类比为 Vue 的 Pinia + 全局 DI 容器。

**核心概念**：

| 概念 | 说明 | 类比 |
|------|------|------|
| **Provider** | 声明「如何创建/获取」某个对象或状态 | Vue 的 `provide/inject`、FastAPI 的 `Depends` |
| **ref.watch** | 监听 Provider，数据变化时自动重建 Widget | Vue 的 `computed` / `watch` |
| **ref.read** | 一次性读取，不监听变化 | 直接调用 |
| **Notifier** | 持有状态并处理业务逻辑的类 | Vue 的 Store、Pinia store |
| **AsyncNotifier** | 处理异步状态（加载中/成功/失败） | 带 loading/error 的 Store |

**典型用法**：

```dart
// 1. 定义 Provider（依赖注入）
final authRepositoryProvider = Provider((ref) {
  final dio = ref.watch(dioProvider);
  return AuthRepositoryImpl(api: dio);
});

// 2. 定义状态 Provider（状态管理）
final authControllerProvider = NotifierProvider<AuthController, AsyncValue<User?>>(() {
  return AuthController();
});

// 3. 在 Widget 中使用
class LoginPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authControllerProvider);  // 自动注入 + 监听
    return authState.when(
      loading: () => CircularProgressIndicator(),
      error: (e, _) => Text('错误: $e'),
      data: (user) => user != null ? HomePage() : LoginForm(),
    );
  }
}
```

**为什么选 Riverpod**：一个工具同时解决「谁创建对象」和「谁持有状态」，减少样板代码，与 Flutter 3 生态契合。

**推荐：Riverpod Generator（代码生成）**

使用 `@riverpod` 注解可自动生成 Provider，减少手写样板，是当前更流行的写法：

```dart
// 使用 @riverpod 注解，运行 build_runner 后自动生成 authRepositoryProvider
@riverpod
AuthRepository authRepository(AuthRepositoryRef ref) {
  final dio = ref.watch(dioProvider);
  return AuthRepositoryImpl(api: dio);
}

// AsyncNotifier 自动生成 provider
@riverpod
class AuthController extends _$AuthController {
  @override
  Future<User?> build() async => null;

  Future<void> login(String email, String password) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => ref.read(authRepositoryProvider).login(email, password));
  }
}
```

在 Widget 中用法不变：`ref.watch(authControllerProvider)`。需在 `pubspec.yaml` 添加 `riverpod_generator`，并运行 `dart run build_runner build`。

---

### 3.2 Dio —— HTTP 客户端

**是什么**：Dart 最流行的 HTTP 库，类似 Axios，支持拦截器、超时、取消等。

**在项目中的位置**：`core/network/dio_client.dart`，封装单例，供各 Repository 使用。

**典型封装**：

```dart
// core/network/dio_client.dart
final dioProvider = Provider((ref) {
  final dio = Dio(BaseOptions(
    baseUrl: Env.apiBaseUrl,
    connectTimeout: Duration(seconds: 10),
  ));
  dio.interceptors.add(AuthInterceptor());  // Token 注入
  dio.interceptors.add(LogInterceptor());   // 请求日志
  return dio;
});
```

**与 Repository 的关系**：Repository 通过 `ref.watch(dioProvider)` 获取 Dio 实例，调用 `dio.get('/users')` 等，不直接在各处 new Dio。

---

### 3.3 GoRouter —— 声明式路由

**是什么**：Flutter 官方推荐的声明式路由库，支持深层链接、路由守卫、嵌套路由。

**核心概念**：

| 概念 | 说明 |
|------|------|
| **GoRoute** | 定义一条路由（path、页面、子路由） |
| **GoRouter** | 路由配置的根对象 |
| **context.go('/path')** | 跳转并替换栈 |
| **context.push('/path')** | 压栈跳转 |
| **redirect** | 路由守卫，如未登录跳转登录页 |

**典型配置**：

```dart
// core/router/app_router.dart
final goRouter = GoRouter(
  initialLocation: '/login',
  redirect: (context, state) {
    final isLoggedIn = /* 从 Riverpod 读取 */;
    final isLoginRoute = state.matchedLocation == '/login';
    if (!isLoggedIn && !isLoginRoute) return '/login';
    return null;  // 不重定向
  },
  routes: [
    GoRoute(path: '/login', builder: (_, __) => LoginPage()),
    GoRoute(path: '/home', builder: (_, __) => HomePage()),
  ],
);
```

---

### 3.4 freezed —— 不可变数据类

**是什么**：代码生成库，自动生成 `copyWith`、`==`、`hashCode`、`toString`，让数据类不可变且易用。

**为什么需要**：Dart 没有 data class，手写上述方法繁琐且易错。freezed 类似 Kotlin 的 `data class`、TypeScript 的 `interface` + 工具函数。

**典型用法**：

```dart
// 定义
@freezed
class User with _$User {
  const factory User({
    required String id,
    required String name,
    String? avatar,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}

// 使用
final user = User(id: '1', name: 'Alice');
final updated = user.copyWith(name: 'Bob');  // 新对象，原对象不变
```

---

### 3.5 json_serializable —— JSON 序列化

**是什么**：配合 freezed 或单独使用，自动生成 `fromJson` / `toJson`，处理 API 返回的 JSON。

**与 freezed 配合**：在 freezed 类中加 `factory User.fromJson(...)`，运行 `dart run build_runner build` 生成 `*.g.dart`、`*.freezed.dart`。

**DTO 与 Entity**：从 API 拿到的用 DTO（字段可与后端一致），转换后得到 Entity（面向 UI 的干净模型）。转换逻辑放在 Repository。

---

### 3.6 其他常用工具

| 工具 | 用途 |
|------|------|
| **logger** | 统一日志格式，可过滤级别 |
| **shared_preferences** | 键值对本地存储（类似 localStorage） |
| **geolocator** | 定位（GPS） |
| **google_maps_flutter** / **flutter_map** | 地图组件 |

---

## 四、数据流与分层协作

理解「数据从哪来、往哪去」，是写好架构的关键。

### 4.1 数据流向图

```
用户操作 → Page/Widget
            ↓
        Controller (Notifier)  ← ref.watch(controllerProvider)
            ↓ 调用
        Repository (接口)
            ↓ 实现
        RemoteDataSource / LocalDataSource
            ↓
        API (Dio) / 本地 DB
```

### 4.2 各层职责

| 层级 | 职责 | 不做什么 |
|------|------|----------|
| **Page** | 展示 UI、响应用户操作、调用 Controller | 不直接调 API、不写业务逻辑 |
| **Controller** | 持有状态、调用 Repository、处理加载/错误 | 不解析 JSON、不关心数据从哪来 |
| **Repository** | 协调 DataSource、DTO→Entity 转换 | 不持有 UI 状态 |
| **DataSource** | 发起 HTTP 请求、读写本地存储 | 不处理业务规则 |

### 4.3 依赖方向（Clean Architecture）

```
Presentation → Domain ← Data
     ↓            ↑
   (依赖)      (实现接口)
```

- **Domain**：最内层，无外部依赖，只有实体和接口
- **Data**：实现 Domain 的 Repository 接口
- **Presentation**：依赖 Domain 接口，通过 Riverpod 注入具体实现

### 4.4 错误处理策略

| 层级 | 策略 | 示例 |
|------|------|------|
| **全局** | Dio 拦截器统一捕获网络错误，可弹 SnackBar 或记录日志 | 401 自动跳转登录、500 统一提示 |
| **局部** | Controller 用 `AsyncValue` 持有 error，Page 用 `state.when(error: ...)` 展示 | 列表加载失败显示重试按钮 |
| **重试** | 在 Repository 或 DataSource 层封装重试逻辑（如 `dio_retry` 包） | 网络抖动时自动重试 1～2 次 |
| **业务异常** | 定义 `AppException`（如 `AuthException`、`NetworkException`），在 Repository 抛出，Controller 捕获后转为用户友好文案 | 密码错误 →「账号或密码不正确」 |

**原则**：全局拦截器处理「通用」错误（如 Token 过期）；业务相关错误在 Controller 层处理，便于针对不同页面做差异化展示。

---

## 五、开发环境与日常流程（纯 FVM）

**思路**：仅用 FVM 管理 Flutter，不单独安装 Flutter SDK。FVM 按项目下载并切换 Flutter 版本。

### 5.1 安装 FVM

| 平台 | 操作 |
|------|------|
| **Windows** | 打开 [GitHub Releases](https://github.com/leoafarias/fvm/releases)，下载对应平台的包（如 `fvm-x.x.x-windows-x64.zip`），解压后将 `bin` 加入 PATH；若无 Windows 包可用 `choco install fvm` |
| **macOS** | `brew tap leoafarias/fvm && brew install fvm` |

### 5.2 使用流程

| 步骤 | 命令 |
|------|------|
| 进入项目 | `cd my_app` |
| 指定版本 | `fvm use stable` 或 `fvm use 3.24.0`（首次自动下载 Flutter） |
| 日常命令 | `fvm flutter run`、`fvm flutter pub get`、`fvm dart run build_runner build` 等 |

**Git**：提交 `.fvmrc`，不提交 `.fvm/flutter_sdk`。团队拉代码后执行 `fvm install` 同步版本。

### 5.3 常用命令速查

| 操作 | 命令 |
|------|------|
| 新建项目 | `fvm flutter create my_app` |
| 安装依赖 | `fvm flutter pub get` |
| 代码生成 | `fvm dart run build_runner build` |
| 运行 | `fvm flutter run` |
| 构建 | `fvm flutter build apk` / `fvm flutter build ios` |
| 分析 | `fvm flutter analyze` |

### 5.4 常见问题

| 问题 | 处理 |
|------|------|
| 团队版本不一致 | `fvm install` |
| 网络慢 | 配置 `PUB_HOSTED_URL`、`FLUTTER_STORAGE_BASE_URL` 镜像 |

---

## 六、快速上手指南

### 6.1 新建项目与依赖

```bash
fvm flutter create my_app
cd my_app
fvm use stable
```

在 `pubspec.yaml` 中添加：

```yaml
dependencies:
  flutter_riverpod: ^2.4.0
  riverpod_annotation: ^2.3.0
  dio: ^5.4.0
  go_router: ^13.0.0
  freezed_annotation: ^2.4.0
  json_annotation: ^4.8.0

dev_dependencies:
  build_runner: ^2.4.0
  riverpod_generator: ^2.3.0
  freezed: ^2.4.0
  json_serializable: ^6.7.0
```

执行 `fvm flutter pub get`。

### 6.2 创建目录结构

按第二节的目录结构，先创建 `core/`、`shared/`、`features/auth/` 等空目录和占位文件，再逐步实现。

### 6.3 最小闭环：登录流程

1. **core/network**：封装 Dio，配置 baseUrl
2. **features/auth/data**：定义 `LoginDto`、`AuthRemoteDataSource`、`AuthRepositoryImpl`
3. **features/auth/domain**：定义 `User` 实体、`AuthRepository` 接口
4. **features/auth/presentation**：`AuthController`（调用 Repository）、`LoginPage`（表单 + 调用 Controller）
5. **core/router**：配置 `/login`、`/home`，在 `main.dart` 中挂载 `ProviderScope` 和 `MaterialApp.router`

完成上述步骤，即可跑通「输入账号密码 → 调 API → 跳转首页」的完整流程。

### 6.4 代码生成命令

修改 freezed/json_serializable 相关文件后，运行：

```bash
fvm dart run build_runner build
# 或监听模式
fvm dart run build_runner watch
```

---

## 七、测试目录结构

建议与 `lib/` 镜像对应：

```
test/
├── core/
├── shared/
└── features/
    └── auth/
        ├── data/
        ├── domain/
        └── presentation/
```

- **单元测试**：Repository、Controller、工具函数
- **Widget 测试**：单个 Widget 的渲染与交互
- **集成测试**：完整流程（如登录到首页）

---

## 八、设计原则回顾

| 原则 | 实践 |
|------|------|
| **YAGNI** | 不预先创建空模块，Domain 层按需引入，小项目可简化结构 |
| **单一职责** | 每层、每文件职责明确 |
| **依赖倒置** | Presentation 依赖 Domain 接口（若有），不依赖 Data 实现 |
| **模块内聚** | 一个 Feature 内的代码尽量自包含 |
| **DRY** | 共享组件/模型放 shared，简单场景 DTO 与 Entity 可合并 |

---

## 八、延伸阅读

- [Riverpod 官方文档](https://riverpod.dev)
- [GoRouter 官方文档](https://pub.dev/packages/go_router)
- [freezed 文档](https://pub.dev/packages/freezed)
- [Flutter 官方架构文档](https://docs.flutter.dev/data-and-backend/state-mgmt/options)

---

> 本文档随项目演进可持续补充。建议将「目录结构」和「工具概念」部分作为日常开发的速查手册使用。
