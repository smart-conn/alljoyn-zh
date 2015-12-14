# Onboarding API Guide

* [Java][onboarding-java]
* [Objective-C][onboarding-ios]


## Best Practices

### Onboardee application

#### Perform a Wi-Fi scan prior to entering SoftAP mode

Prior to starting up as a SoftAP, the device should scan
and store a list of the nearby APs. This allows for an Onboarder
application to make an Onboarding service framework API call to
GetScanInfo. This helps remove errors for the end user because
both sides of the Onboarding service framework can validate
that each device detects the personal AP.

#### Add "AJ_" as the prefix to the SoftAP SSID

When switching the device into a SoftAP (if it has not been
previously onboarded), the SSID should contain a prefix of
"AJ_". This prefix allows for Onboarder applications to show
a shorter list of the nearby devices that are eligible to be
onboarded to a user's AP.

This is not a hard requirement but a very strong recommendation
to standardize the way that developers will build Onboarder
applications to present a cleaner UI and fewer options for
the end user.

#### Make use of Configuration service framework

For an end user who may have multiple devices in the home of
the same type (such as a refrigerator), it is important to
allow for a custom name to be entered (for example, "Kitchen Fridge"
or "Garage Fridge"). Adding the Configuration service framework
into the Onboardee applications allows for a few things.

* As the creator of the device, it can expose a set of initial
values that are customized to the device to allow any third-party
application to discover these input options and show a UI for end users.
* By default, it allows the users to set a "friendly name"
which will be propagated to a third-party developer application
so the end user can identify the device by a name that they entered.

#### Announce again after connecting to a personal AP

When connecting to a personal AP that the end user provided,
the About feature should be used to execute an Announce API method.
This will ensure that the applications on the new network are
promptly notified of the existing onboarded device. If the
Announce API method is not executed, the AboutData will eventually
travel to the other applications; explicitly calling the method
ensures prompt arrival.

#### Single Onboardee application

Since the Onboardee application makes changes to the device's
Wi-Fi settings, only one Onboardee application should be
running at any given time. Running multiple applications at
the same time results in non-deterministic behavior as
multiple applications will be attempting to modify the Wi-Fi settings.

### Onboarder application

#### Allow Onboardee device to be configured with AP information
when AP is hidden

Since the platform Wi-Fi scan will not list APs that are
hidden, the application should allow the end user to input
the SSID and security information manually. The Onboardee
will attempt to connect to the network and if it fails, will
start back up in SoftAP mode and report the error condition
to the Onboarder application.

#### Allow the Onboardee device to be customized by the user

The AllJoyn service frameworks are intended to be building
blocks that can be used together. As such, many devices that
support the Onboarding service framework also support the
Configuration service framework.

The Onboarder application should leverage the information
from the About feature (AboutData) to determine if the UI can
support the Configuration service framework. From the About
feature's Announce callback lists the supported interfaces.
If org.alljoyn.Config is contained, then the Configuration service
framework is supported, and the Configuration service framework
APIs get a list of any device-specific fields that can be entered,
and dynamically generate the UI input widgets to enter these
values. At a minimum, allow for the text field of "Friendly Name"
to be entered so end users can name the device that is being onboarded.

[onboarding-java]: /develop/api-guide/onboarding/java
[onboarding-ios]: /develop/api-guide/onboarding/objc
