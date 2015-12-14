# Running the Control Panel Sample App - iOS

## Prerequisites

Follow steps in the [Building - iOS OS X section][build-ios-osx] 
to build and install the Control Panel sample app on an iOS device.

The Control Panel service sample app functions as the 
Controller side of the Control Panel service framework. 
At this time, there is not an iOS Controllee sample application. 
In order to have a Controllee to interact with, follow the instructions 
in [Run a Controllee][run-controllee] to set up and run a sample 
Controllee application on a Linux machine. Make sure the Linux 
machine and the iOS device are on the same network.

## Run the Control Panel Sample App
1. Launch the Control Panel sample app on your iOS device.
2. Click the Connect to AllJoyn button.
3. In the pop-up that appears, set the name to be used by the 
About feature in the application. You can use the default of 
org.alljoyn.BusNode.aboutClient, or enter your own.

The application is now running as a Controller. In the list 
area below the Disconnect from AllJoyn button, you will see 
any nearby applications that have been discovered via About 
that support the Control Panel service framework and are acting as a Controllee.

4. To interact with a Controllee, select one from the list 
of nearby applications that have been discovered.
5. Choose an option from the pop-up that appears:
  * Show Announce: This will allow you to view the About announcement 
  that was received from the nearby application.
  * About: This will show the full set of information retrieved 
  by the About Client from the nearby application.
  * Control Panel: You can use the Control Panel Controller 
  to interact with the control panel(s) exposed by the Controllee. 
    * After selecting this option, click the **Language** button 
    in the upper right-hand corner of the screen and enter 
    one of the available languages into the text field. 
    For example, enter "en" to see the English version of the control panel.
    * Once you have chosen a control panel and a language, 
    the data for the corresponding control panel is displayed. 
    At the current time, there is not a Widget Rendering Library 
    that is available for iOS. Therefore, the control panel is 
    shown as a series of items that display the data and properties for each control.

## Run a Controllee

Follow the instructions in the [Running - Linux section][run-linux] 
to build and run the Controllee sample app. This will allow you 
to run the ControlPanelService Controllee sample on a Linux machine.

[build-ios-osx]: /develop/building/ios-osx
[run-linux]:  /develop/run-sample-apps/controlpanel/linux