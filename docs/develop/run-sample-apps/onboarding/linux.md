# Linux - Running Onboarding Sample Apps

## Running OnboardingClient and OnboardingService Apps

### Prerequisites

Open two terminal windows. In each, navigate to the AllJoyn&trade; root dir, then:

```sh
export AJ_ROOT=`pwd`

# <TARGET CPU> can be either x86_64, x86, or whatever value you set for "CPU=" when running SCons.
export TARGET_CPU=x86
            
export LD_LIBRARY_PATH=$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/cpp/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/about/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/onboarding/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/config/lib:$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/services_common/lib:$LD_LIBRARY_PATH
```

### Run the OnboardingService Sample App

In one of the terminal windows, run `OnboardingService`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/onboarding/bin/OnboardingService
```

**NOTE:** The `OnboardingService` sample app is just a shell implementation - 
no onboarding actually occurs!

### Run the OnboardingClient Sample App

In the other terminal window, run `OnboardingClient`:

```sh
$AJ_ROOT/core/alljoyn/build/linux/$TARGET_CPU/debug/dist/onboarding/bin/OnboardingClient
```

NOTE: The `OnboardingClient` sample app uses hard-coded Onboarding 
values (for example, SSID, passcode, authtype).
