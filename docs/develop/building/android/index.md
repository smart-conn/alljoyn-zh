# Building Android

## Setup

 1. [Download][download] the following Android SDKs:
     * Core SDK (release)
     * Onboarding SDK
     * Configuration SDK
     * Notification SDK
     * Control Panel SDK

 2. Extract all ZIP files to one directory.

## Build Samples

Note, you may need to adjust the below paths based on the version you downloaded

 1. Import projects from:
     * alljoyn-android/core/alljoyn-14.06.00-rel/java/samples
     * alljoyn-android/services

 2. Add Support Library

     To add "android-support-v4.jar", right-click on the project,
     select "Android Tools" > "Add Support Library"

## Building the AllJoyn&trade; framework for an existing app:

 1. In your project, create a "libs/armeabi" dir if it doesn't already exist.
 2. Copy "alljoyn-android/core/alljoyn-14.06.00-rel/java/lib/liballjoyn_java.so" to the "libs/armeabi" dir.
 3. Copy "alljoyn-android/core/alljoyn-14.06.00-rel/java/jar/alljoyn.jar" to the "libs" dir.
 4. If using a Service Framework, copy the jars from the "alljoyn-android/services/&lt;SERVICE FRAMEWORK&gt;/java/libs/*.jar" to the "libs" dir.

[download]: https://allseenalliance.org/framework/download
