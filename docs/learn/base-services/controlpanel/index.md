# Control Panel Service

The AllJoyn&trade; Control Panel Service framework provides a
simple way for applications to render a UI widget set to
interact with remote devices. The framework is composed of
a standard set of interfaces, that when implemented on specific
object paths, allows for dynamic rendering of widgets in a UI
on remote devices. The Control Panel Service abstracts the
details of the AllJoyn Control Panel interface by allowing
the use of higher level APIs and a Code Generator to create
the widget elements. A Control Panel does not dictate how a
UI should look; it provides hints/information about what an
element is capable of, where it should be rendered on a screen,
and synchronization with other applications.

## Concepts and Terminology

### Controller and Controllee

Two roles exist:
* Controller. This is the application that renders the control panel.
* Controlee. This is the application that advertises the control panel.

### Control Panel

Collection of Widgets that allow a user to interact with a device.
A control panel is defined and announced by a Controllee; and
discovered and displayed by a Controller. A device can have more
than one, and can be defined on a per-language basis.

### Control Panel Service Code Generator

A tool that aids in the generation of code that will represent a
Control Panel. This tool takes in an XML file that defines
the control panel widgets and generates corresponding code that
implements a specific control panel. Note that XML is not
used as the internal representation of the widgets in the
Control Panel Service, nor is it sent over the wire to the
Controller.

### Types of widgets modules

A Control Panel can be expressed in XML, fed through the Code
Generator, and connected to developer software. The following
UI elements make up a Control Panel:

* Container. Container UI element. Allows grouping of widgets
  together. Must contain at least one child element.
* Label. UI element that functions as a read only label of text.
* Action. UI element represented by a button that either executes
  code on the Controllee, or opens a Dialog Widget as a confirmation
  before executing.
* Dialog. UI dialog element. Has a dialog message and up to 3
  choices of buttons.
* Property. UI element used to display a value and possibly edit
  it. This widgets via the hints attribute is used to represent a
  slider, spinner, radio button, etc.

### UI Adaptive Layer

In order to aid in use and interact with a Control Panel, a helper
library of sorts is available as part of the framework. The purpose
of this software layer is to facilitate the discovery of the widget
elements using AllJoyn Introspection which starts at the object
path of the Control Panel interface found through
[Service Level Discovery][about]. It then parses each child of
this path to determine what each child is and creates the native
platform UI element to interact with each discovered widget.
The native platform elements are the default UI for the given
platform, on Android a button looks like a default Android Button;
on iOS the device will have a native look and feel for and not
look like another OS. Developers have the option to overload the
generation of the platform widgets to provide a custom look and feel.

## How Does It Work?

Under the hood, there are many interfaces that make up the
building blocks to create complex widgets. These interfaces,
when implemented by a BusObject on a specific object path,
determine the language, widget, text, and constraints.
The service, through the APIs and helper classes, allows
for simple use of the AllJoyn framework to register BusObjets
that implement certain widgets and automatically provide hints
on how the widget should render, signals to synchronize between
applications, and default values/constraints.

To implement a Control Panel, the simple and most common way
is to generate an XML file to represent the Control Panel.
This file is then passed into the Code Generator which will take
as input a header file that contains the developer methods to be
connected when widgets are interacted with. The Code Generator
will produce a generated folder that contains software that makes
use of the Control Panel Service APIs and classes to offer the
Contorl Panel.

Once an application discovers a Control Panel, the Control
Panel Service is used to perform AllJoyn Introspection to navigate
the AllJoyn BusObject tree to collect the details needed to render.
This information is passed into the UI Adaptive Layer for processing
to create a root UI element. The UI elements can then be traversed
and the native elements added to a display.

When any UI widget is interacted with by a user it causes an
AllJoyn Bus Method call to be made back to the Controlee device.
This then changes the state of the UI accordingly, causes the
device code to execute for the given method, and and sends an
AllJoyn signal to maintain state with other connected applications.
The signal is built into the system and allows for sliders, spinners,
etc. to always be synchronized to avoid confusion when multiple
users are interacting with the same device.

## Learn More

* [Learn more about the Control Panel Interface Definition][controlpanel-interface]
* [Download the SDK][download], [build][build] and
  [run the sample apps][sample-apps]
* [Learn more about the APIs][api-guide]

[controlpanel-interface]: /learn/base-services/controlpanel/interface
[download]: https://allseenalliance.org/framework/download
[build]: /develop/building
[sample-apps]: /develop/run-sample-apps/controlpanel
[api-guide]: /develop/api-guide/controlpanel
[about]: /learn/core/about-announcement
