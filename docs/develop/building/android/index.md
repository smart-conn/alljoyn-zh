# Building Android

## 设置

 1. [下载][download] 以下 Android SDKs:
     * Core SDK (release)
     * Onboarding SDK
     * Configuration SDK
     * Notification SDK
     * Control Panel SDK

 2. 将所有 ZIP 文件提取到一个路径下。

## 搭建样例

请注意，根据您的下载版本，以下路径可能需要调整。

 1. 由以下地址输入工程:
     * alljoyn-android/core/alljoyn-14.06.00-rel/java/samples
     * alljoyn-android/services

 2. 添加支持库

     添加 "android-support-v4.jar", 在项目上单击右键,
     选择 "Android Tools" > "Add Support Library"

## 为现存的应用程序搭建 AllJoyn&trade; 框架。 

 1. 在项目中，创建一个 "libs/armeabi" 目录，如已存在则跳过此步骤。 
 2. 将 "alljoyn-android/core/alljoyn-14.06.00-rel/java/lib/liballjoyn_java.so" 复制到 "libs/armeabi" 目录。
 3. 将 "alljoyn-android/core/alljoyn-14.06.00-rel/java/jar/alljoyn.jar" 复制到 "libs" 目录。
 4. 如果使用 Service Framework, 将 "alljoyn-android/services/&lt;SERVICE FRAMEWORK&gt;/java/libs/*.jar" 复制到 "libs" 目录。

[download]: https://allseenalliance.org/framework/download
