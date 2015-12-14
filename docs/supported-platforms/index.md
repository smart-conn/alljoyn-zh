# Supported Platforms

The AllJoyn standard core builds and runs on the following platforms. The depth
and type of testing for each platform varies, so consult the linked release
information for detailed test information.

## 15.09 release

#### Platforms

| Platform     | Core | Base Services (planned) | Platform Versions | Toolchain/IDE        |
|--------------|:----:|:-----------------:|-------------------|-----------------------|
| Android      |  X   |         X         | JB, KK, LP        | Android SDK, NDK r10e |


#### Language Bindings

The table below lists which language bindings are supported on which platforms
for Core and Base Services

| Platform     | C++         | C    | Java        | Objective-C |
|--------------|-------------|------|-------------|-------------|
| Android      | Core        | Core | Core        |             |

15.09 Notes:
* See the [Core 15.09 Release Review](https://wiki.allseenalliance.org/core/core_15.09_release_review) for details about the depth of testing on various platforms.
* Sun Java 7 is required for Java bindings.

---

## 15.04 release

#### Platforms

| Platform     | Core | Base Services (planned) | Platform Versions | Toolchain/IDE        |
|--------------|:----:|:-----------------:|-------------------|----------------------|
| Windows      |  X   |         X         | Windows 7 to 10   | VS 2012, VS 2013     |
| Android      |  X   |         X         | JB, KK, LP        | Android SDK, NDK r9d |
| iOS          |  X   |         X         | iOS 8.1           | XCode 6.1            |
| OS X         |  X   |                   | OS X 10.9         | XCode 6.1            |
| Linux Ubuntu |  X   |         X         | Ubuntu 14.04      |                      |
| Open WRT     |  X   |         X         | BB, CC            | <br>                 |


#### Language Bindings

The table below lists which language bindings are supported on which platforms
for Core and Base Services

| Platform     | C++         | C    | Java        | Objective-C |
|--------------|-------------|------|-------------|-------------|
| Windows      | Core, Base  | Core | Core        |             |
| Android      | Core, Base  | Core | Core, Base  |             |
| iOS          | Core        |      |             | Core, Base  |
| OS X         | Core        |      |             |             |
| Linux Ubuntu | Core, Base  | Core | Core, Base  |             |
| Open WRT     | Core, Base  | Core |             | <br>        |

15.04 Notes:
* See the [Core 15.04 Release Review](https://wiki.allseenalliance.org/core/core_15.04_release_review) for details about the depth of testing on various platforms.
* Sun Java 7 is required for Java bindings.

---
## 14.12 release

#### Platforms

| Platform     | Core | Base Services | Platform Versions | Toolchain/IDE        |
|--------------|:----:|:-------------:|-------------------|----------------------|
| Windows      |  X   |      X        | Win7, Win8        | VS 2013              |
| Android      |  X   |      X        | ICS, JB, KK       | Android SDK, NDK r9d |
| iOS          |  X   |      X        | iOS 7, iOS 7.1    | XCode 6.1            |
| OS X         |  X   |               | OS X 10.9         | XCode 6.1            |
| Linux Ubuntu |  X   |      X        | Ubuntu 14.04      |                      |
| Open WRT     |  X   |      X        | BB, CC            | <br>                 |

#### Language Bindings

The table below lists which language bindings are supported on which platforms
for Core and Base Services.

| Platform     | C++         | C    | Java        | Objective-C |
|--------------|-------------|------|-------------|-------------|
| Windows      | Core, Base  | Core | Core        |             |
| Android      | Core, Base  | Core | Core, Base  |             |
| iOS          | Core        |      |             | Core, Base  |
| OS X         | Core        |      |             |             |
| Linux Ubuntu | Core, Base  | Core | Core, Base  |             |
| Open WRT     | Core, Base  | Core |             | <br>        |

14.12 Notes:
* See the [Core 14.12 Release Review](https://wiki.allseenalliance.org/core/core_14.12_release_review) and [Base Services 14.12 Release Review](https://wiki.allseenalliance.org/baseservices/base_services_14.12_release_review) for details about the depth of testing on various platforms.
* Sun Java 7 is required for Java bindings.

---
## 14.06 release

#### Platforms

| Platform     | Core | Base Services | Platform Versions | Toolchain/IDE       |
|--------------|:----:|:-------------:|-------------------|---------------------|
| Windows      |  X   |               | Win7, Win8        | VS 2012             |
| Android      |  X   |      X        | GB, ICS, JB, KK   | Android SDK, NDK r9 |
| iOS          |  X   |      X        | iOS 7, iOS 7.1    | XCode 5.1           |
| OS X         |  X   |               | OS X 10.9         | XCode 5.1           |
| Linux Ubuntu |  X   |      X        | Ubuntu 12.04      |                     |
| Open WRT     |  X   |      X        | AA, BB            | <br>                |

#### Language Bindings

The table below lists which language bindings are supported on which platforms
for Core and Base Services.

| Platform     | C++         | C    | C# Unity | Java        | Objective-C |
|--------------|-------------|------|----------|-------------|-------------|
| Windows      | Core        | Core | Core     | Core        |             |
| Android      | Core, Base  | Core | Core     | Core, Base  |             |
| iOS          | Core        |      |          |             | Core, Base  |
| OS X         | Core        |      |          |             |             |
| Linux Ubuntu | Core, Base  | Core |          | Core, Base  |             |
| Open WRT     | Core, Base  | Core |          |             | <br>        |

14.06 Notes:
* See the [Core 14.06 Release Review](https://wiki.allseenalliance.org/core/core_14.06_release_review) and [Base Services 14.06 Release Review](https://wiki.allseenalliance.org/baseservices/base_services_14.06_release_review) for details about the depth of testing on various platforms.
* Sun Java 7 is required for Java bindings.
* Unity 4.x is required for Unity bindings.
