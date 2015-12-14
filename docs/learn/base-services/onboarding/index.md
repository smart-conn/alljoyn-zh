# Onboarding Service

The Onboarding service provides a common and simple way for new device
to be brought onto the Wi-Fi network. This is especially useful for
devices that have a limited user interface, like a SmartPlug.

## How Does it Work?

The current onboarding mechanism leverages Wi-Fi only, though the system
can evolve to leverages additional hardware (like BTLE) as they become
more prelevant in these class of devices.

Two roles are supported:

* **Onboardee**. This is the device that is unconfigured and needs to be
  brought onto the Wi-Fi network.

* **Onboarder**. This is the device is configuring the Onboardee device,
  typically a mobile application or PC.

The following are the steps to onboard a device.

### 1. Onboardee broadcasts its SSID

When an Onboardee device is first plugged in, it will advertise its SSID
over Wi-Fi. The SSID is either prefixed with "AJ\_" or postfixed with "\_AJ"
to help indicate that this device that supports the AllJoyn&trade; Onboarding service.

### 2. Onboarder connects to Onboardee

The Onboarder will scan for unconfigured AllJoyn devices by looking for
SSID names with "AJ\_" or "\_AJ". A user can then choose to onboard a specific
Onboardee device. The first step is to connect to the Onboardee device's
SSID. Depending on the Onboarder platform, this may be done
automatically by the application.

### 3. Onboarder sends Wi-Fi credentials

After connecting to the Onboardee's SSID, the Onboarder will listen for
[AllJoyn About announcements][about-announcement]. Then, the Onboarder will
use the Onboarding service interfaces to send the target Wi-Fi network
credentials to the Onboardee device.

### 4. Switch to target Wi-Fi network

Both devices will then switch to the target Wi-Fi network.

### 5. Onboarder listens for Onboardee device

As a final step, the Onboader will listen to receive About announcements
from the Onboardee device. When received, the Onboarder considers
the Onboardee device fully onboarded.

![][onboarding-state-diagram]

[onboarding-state-diagram]: /files/learn/onboarding-state-diagram.png

## Learn More

* [Learn more about the Onboarding Interface Definition][onboarding-interface]
* [Download the SDK][download], [build][build] and
  [run the sample apps][sample-apps]
* [Learn more about the Onboarding APIs][api-guide]

[about-announcement]: /learn/core/about-announcement
[onboarding-interface]: /learn/base-services/onboarding/interface
[download]: https://allseenalliance.org/framework/download
[build]: /develop/building
[sample-apps]: /develop/run-sample-apps/onboarding
[api-guide]: /develop/api-guide/onboarding
