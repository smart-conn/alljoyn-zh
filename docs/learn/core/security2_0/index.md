# Security 2.0

The Security 2.0 feature is an enhancement to the existing AllJoyn&trade; Security.

The goal of the Security 2.0 feature is to allow an application to validate access to secure interfaces or secure objects based on policies installed by the owner. This feature is part of the AllJoyn Core library. It is not an option for the application to enforce permission. It is up to the user to dictate how the application performs based on the access control lists (ACLs) defined for the application. The AllJoyn Core Permission Management component does all the enforcement including the concept of mutual authorization before any message action can be taken.

The Security Manager is optional service that helps the user with key management and permission rules building. Using policy templates defined by application developer, the Security Manager builds the application manifest to let the user authorize which interactions the application can do.

## Learn More

* [Security 2.0 High Level Design (HLD)][security2_0-hld]
* [Download the SDK][download], [build][build]

[security2_0-hld]: /learn/core/security2_0/hld
[download]: https://allseenalliance.org/framework/download
[build]: /develop/building
