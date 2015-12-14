# Control Panel API Guide

* [Java][controlpanel-java]
* [C++][controlpanel-cpp]
* [Objective-C][controlpanel-objc]
* [C (Thin Core)][controlpanel-c-thin]

## Best Practices

### Controller

#### Displaying multiple control panels

In some cases, a Controllee may have multiple control panels.
A few examples follow:

* Some control panels may be for different "units" of an
overall device.
* There can be a control panel for the everyday user and
a separate control panel for a technician or repair individual.

Therefore, a Controller application should present the
user with the option of selecting not only which nearby
Controllee they would like to interact with, but also which
control panel they want to interact with on that specific Controllee.

#### Reflecting changes to a control panel

Control panels provided by a Controllee can change depending
on user interactions, device state, and other factors. It is
important that a Controller have the appropriate listeners
registered for a control panel so that it will be informed
of these changes and can update the control panel UI accordingly.

An example would be a user choosing an option on a control
panel that results in other options not being valid and
therefore being disabled or grayed out. Another example can
involve a washer/dryer combo where, depending on the state/cycle
that the appliance is in, varying control options are available
on the control panel.

#### ControlPanelExceptionHandler

When an error occurs while a Controller is attempting to
retrieve a widget from a Controllee, the Adapter throws an
exception so that the application can handle the error and
decide how to display the error to the user. These errors
are thrown for a reason, and at various states; they should
not be ignored.

### Controllee

#### Controllee control panel naming conventions

When designing the control panel(s) that a Controllee will
expose, certain naming conventions must be followed for the
name of a unit and the name of individual widgets. Additionally,
each unit and widget name within a control panel must be unique.
This is due to the fact that the unit name and widget name
are used as part of the AllJoyn&trade; BusObject paths that the Control
Panel service framework utilizes. The naming conventions are as follows:

* Contain only the ASCII characters "[A-Z][a-z][0-9]_"
* Cannot be an empty string

#### Control panel structure and layout

It is important to keep in mind that control panels exposed by a
Controllee will often be displayed on a mobile device with a
limited screen size and available screen space. Therefore, the
Control Panel service framework's Container widgets should be
used effectively to organize and lay out the other widgets
presented in the control panel.

#### Localization handled by Controllee

Developers creating a Controllee application should not
rely or plan on having Controller applications perform
localization (such as translating or interpreting) of content.
For example, if a Controllee provides language support for
both English and Spanish control panels, then the strings
contained within the different widgets must have the correct
and complete language-appropriate strings available so that a
Controller application can simply display the widgets.
An approach, such as having a Controllee widget definition
contain a number or code that is then used to look up or
convert to a language-specific string on a Controller is unacceptable.




[controlpanel-java]: /develop/api-guide/controlpanel/java
[controlpanel-cpp]: /develop/api-guide/controlpanel/cpp
[controlpanel-objc]: /develop/api-guide/controlpanel/objc
[controlpanel-c-thin]: /develop/api-guide/controlpanel/c-thin
