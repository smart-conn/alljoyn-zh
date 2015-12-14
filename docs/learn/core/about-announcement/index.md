# About Announcement

About Announcements enables a device or app to announce itself on the
AllJoyn&trade; network for other devices and apps to discover. The following information
is shared:

* App and Device Friendly Names
* Make, Model, Version, Description
* Supported Languages
* App Icon
* Supported objects and interfaces
* Service Port number
* App and Device unique identifiers

For a complete list, refer to the [Interface Definiton][about-interface].

The About feature supports multiple languages, so the client can display the language
that is most appropriate for the user. With the About feature, a client can discover
devices and apps on the network, get some meta data about the device/app,
discover the services it supports, and get an icon to represent the device/app.

## Concepts and Terminology

Generally speaking, there are two sides to the About feature:
* About Server. This is the device or app that is announcing itself.
* About Client. This is the device or app that is discovering apps/devices.

## How It Works

Here's roughly what happens behind the scenes:

1. An About Server announces itself by sending a sessionless signal including:
   the session port, list of objects and interfaces; and a subset of the About
   Announcement information, including App and Device Name, default language,
   App and Device unique identiers.

2. An About Client discovers the sessionless signal, which includes the information
   listed above. The client can now display some information about the discovered
   device/app, App/Device Name and supported services.

3. Optionally, the About Client can connect to the app/device's About Server
   on the service port to extract more information. Typically, this is done
   to get the app icon.

## Learn More

* [Learn more about the About Interface Definition][about-interface]
* [Download the SDK][download], [build][build] and
  [run the sample apps][sample-apps]
* [Learn more about the About APIs][api-guide]

[about-interface]: /learn/core/about-announcement/interface
[download]: https://allseenalliance.org/framework/download
[build]: /develop/building
[sample-apps]: /develop/run-sample-apps/about
[api-guide]: /develop/api-guide/about
