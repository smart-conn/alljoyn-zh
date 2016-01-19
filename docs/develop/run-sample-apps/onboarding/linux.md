# Linux - 运行 Onboarding 样例应用程序

## 运行 OnboardingClient 和 OnboardingService 应用程序

### 前提条件

打开两个命令行窗口，每一个都切换到 AllJoyn&trade; 根目录，然后：

```sh
export AJ_ROOT=`pwd`

# <TARGET CPU> can be either x86_64, x86, or whatever value you set for "CPU=" when running SCons.
export TARGET_CPU=x86
            
export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/about/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/onboarding/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/config/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/services_common/lib:$LD_LIBRARY_PATH
```

### 运行 OnboardingService 样例应用程序

在一方的命令行窗口中运行 `OnboardingService`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/onboarding/bin/OnboardingService
```

**NOTE:** 此 `OnboardingService` 样例应用程序只是一个命令行实现 - 没有具体的 onboarding 发生。

### 运行 OnboardingClient 样例应用程序

在另一方的命令行窗口中运行 `OnboardingClient`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/onboarding/bin/OnboardingClient
```

NOTE: 此 `OnboardingClient` 样例应用程序使用了硬编码的 onboarding 值（例如 SSID，密码，authtype）.
