# Control Panel Interface Definition - 14.02

__Warning: This is not the latest interface definition.__

[Go here for latest Control Panel Interface Definition][controlpanel-latest]

## Introduction

### Purpose

This document describes the specification of the Control Panel 
service framework's collection of interfaces. Implementing these 
interfaces provides the Control Panel service framework a mechanism 
to allow for a controller application like the AllJoyn&trade; On 
application to render the UI based on the controllee application's 
widget metadata. The controller application does not know the 
semantics of the remote widgets. It relies on the end user to understand
and perform the actions on the rendered user interface. A typical 
action is selecting a field or pressing a button.

### Scope

This document is targeted to developers of AllJoyn applications 
who want to build controller and controllee applications without 
using the tools provided by the Control Panel service framework.

### References

Except for supporting information, the following are reference 
documents found on the AllSeen Alliance web site's Docs/Downloads section.

* *AllJoyn&trade; Framework Tutorial*
* *Introduction to AllJoyn&trade; Thin Client*
* AllJoyn Data Type Signature
* [RFC3339: (Date and Time on the Internet: Timestamps)](http://www.ietf.org/rfc/rfc3339.txt)

### Acronyms and terms

| Term | Definition |
|---|---|
| AllJoyn device | A device that supports the AllJoyn framework and can connect to a personal network. |
| Control panel | Collection of Widgets that allow a user to interact with a device. A control panel is defined and announced by a Controllee; and discovered and displayed Control panel by a Controller. A device can have more than one, and can be defined on a per-language basis. |
| Controllee | An AllJoyn application that advertises its Control Panel interfaces, so that other AllJoyn devices may control it. |
| Controller | An AllJoyn application that controls another AllJoyn device that advertises its Control Panel interfaces. |

## Specification Overview

The Control Panel interfaces must be implemented by an 
application on a controllee. Figure 1 illustrates 
the relationship between a controllee app and a controller app.

![controlpanel-arch][controlpanel-arch]

Figure: Control Panel service framework architecture within 
the AllJoyn&trade; framework

The OEM is responsible for writing the Control interfaces and 
the Control Panel service framework metadata.

The UI Toolkit Adaption Layer, a library used to map the metadata 
to platform-specific UI elements, is made available as part of the 
Control Panel service framework release.

## Discovery

Controllees are discovered via an AllJoyn announcement. Each AllJoyn 
device uses the About feature to announce basic app information like 
app name, device name, manufacturer, and model number. The announcement 
also contains the list of object paths and service interfaces to allow 
the controller to determine whether the controllee provides 
functionality of interest.

The About announcement is propagated using a sessionless signal.

## Call Flows

### Static Control Panel flow

Figure 2 illustrates a typical call flow for a control 
panel that does not change once rendered.

![controlpanel-static-call-flow][controlpanel-static-call-flow]

Figure: Static Control Panel call flow

### Dynamic Control Panel flow

Figure 3 illustrates a call flow for a control panel that 
changes as the end user interacts with the widgets.

![controlpanel-dynamic-call-flow][controlpanel-dynamic-call-flow]

Figure: Dynamic Control Panel call flow

## Error Handling

The method calls in the Control Panel interfaces use the AllJoyn 
error message handling feature (ER_BUS_REPLY_IS_ERROR_MESSAGE) 
to set the error name and error message.

Table 1 lists the possible errors raised by the Control Panel service framework interfaces.

**Table 1: Control Panel service framework interface errors**

|Error name | Error message |
|---|---|
| org.alljoyn.Error.OutOfRange | Value out of range |
| org.alljoyn.Error.InvalidState | Invalid state |
| org.alljoyn.Error.InvalidProperty | Invalid property |
| org.alljoyn.Error.InvalidValue | Invalid value |
| org.alljoyn.Error.MethodNotAllowed | Method call not allowed |

## BusObject Map

### BusObject structure

Figure 4 shows the tree structure diagram that 
represents the basic organization of AllJoyn objects used in 
the support of the Control Panel service framework. A control 
panel is implemented using several AllJoyn objects.

![controlpanel-busobject-map][controlpanel-busobject-map]

Figure: BusObject map

The objects are organized to support multiple units and multiple 
languages. Only the top-level panels should be listed in the announcement.

Since the IETF language tag allows for hyphen (-) which is not 
allowed in the bus object path, any language tag in the object 
path replaces a hyphen (-) with an underscore (_).

In addition to the control panels, the Control Panel service 
framework can also support other panels such as a notification 
panel. These panels are not required to be advertised in the announcement.

It is the controller's job to introspect and walk the object 
tree of a control panel to retrieve all the metadata for that 
control panel.

### BusObject map examples

The following subsections illustrate a few sample BusObject map structures.

#### Washing machine example

Figure 5 illustrates a sample bus object map for a washing machine.

![controlpanel-washing-machine-example][controlpanel-washing-machine-example]

Figure: Washing machine example

#### Sprinkler system example

Figure 6 illustrates a sample bus object map for a sprinkler system.

![controlpanel-sprinkler-system-example][controlpanel-sprinkler-system-example]

Figure: Sprinkler system example

## Control Panel Service Framework Interfaces

The Control Panel service framework comprises a set of interfaces 
as illustrated in Figure 4.

## ControlPanel Interface

This interface indicates whether the object is a control panel. 
This object will support at least one language. The service only 
needs to advertise this type of object in the About announcement. 
No other objects in the Control Panel service framework tree 
should be announced.

NOTE: It's the responsibility of the controller to introspect 
the children objects to locate the corresponding root container 
of the given panel for the specific language code.

### Interface name

| Interface name | Version | Secured | Object path |
|---|---|---|---|
| org.alljoyn.ControlPanel.ControlPanel | 1 | no | /ControlPanel/{unit)/{panelName} |
|  |  |  | Example: /ControlPanel/washing/consolePanel |

### Properties

|Property name | Signature | List of values | Writable | Description |
|---|---|---|---|---|
| Version | q | Positive integers | no | Interface version number |

### Introspect XML

The following XML defines the ControlPanel interface.

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.ControlPanel">
      <property name="Version" type="q" access="read"/>
   </interface>
</node>
```

## Container Interface

This interface provides all the metadata to guide the 
controller to render the UI for a container widget.

| Interface name | Version | Secured | Object path |
|---|---|---|---|
| org.alljoyn.ControlPanel.Container | 1 | no | /ControlPanel/{unit)/{panelName}/{language}/.../{containerName} |
| | | | Examples: |
| | | | /ControlPanel/washing/consolePanel/en |
| | | | /ControlPanel/sprinkler/mainPanel/en/Schedules/InputForm/RunOnDays |
| org.alljoyn.ControlPanel.SecuredContainer | 1 | yes | /ControlPanel/{unit)/{panelName}/{language}/.../{containerName} |

### Properties

|Property name | Signature | List of values | Writable | Description |
|---|---|---|---|---|
| Version | q | Positive integers | no | Interface version number |
| States | u | Bit mask | no | Bit mask for various widget states |
| | | | | **Mask** / **Name** / **Description** |
| | | | | 0x01 / enabled / Indicates whether the widget is enabled. A disabled widget should be grayed out or invisible. |
| OptParams | a{qv} | N/A | no | Metadata dictionary. See [Container widget metadata][container-widget-metadata] for more information. |

#### Container widget metadata

The following table defines the metadata of a container widget.

| Dictionary key | Field name | Value type | Description |
|---|---|---|---|
| 0 | Label | s | Label |
| 1 | bgColor | u | Background color expressed as RGB value. If not specified, then the background color of the enclosing container is used. |
| 2 | layoutHints | aq | Layout hints. See [Container widget layout hints][container-widget-layout-hints] for more information. |

#### Container widget layout hints

The following table lists layout hints for a container widget.

| Hint ID | Hint name | Description |
|---|---|---|
| 1 | Vertical Linear | A layout that aligns all components in a vertical direction. |
| 2 | Horizontal Linear | A layout that aligns all components in a horizontal direction. |

### Methods

No methods are exposed by this interface.

### Signals

| Signal name | Parameters | Description |
|---|---|---|
| MetadataChanged | None | The metadata has changed. This can occur due to changes in any of the property objects. |

### Introspect XML

The following XML defines the Container interface.

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.Container">
      <property name="Version" type="q" access="read"/>
      <property name="States" type="u" access="read"/>
      <property name="OptParams" type="a{qv}" access="read"/>
      <signal name="MetadataChanged" />
   </interface>
</node>
```

## Property Interface

This interface provides the control mechanism for the property widget. 
Each widget is represented by an AllJoyn object implementing this interface.

### Interface name

| Interface name | Version | Secured | Object path |
|---|---|---|---|
| org.alljoyn.ControlPanel.Property | 1 | no | /ControlPanel/{unit)/{panel}/{language}/.../{object name} |
| | | | Examples: |
| | | | /ControlPanel/washing/consolePanel/en/Mode |
| | | | /ControlPanel/sprinkler/mainPanel/en/Schedules/InputForm/ScheduleName |
| org.alljoyn.ControlPanel.SecuredProperty | 1 | yes | /ControlPanel/{unit}/{panel}/.../{object name} |

### Properties

|Property name | Signature | List of values | Writable | Description |
|---|---|---|---|---|
| Version | q | Positive integers | no | Interface version number |
| States | u | Bit mask | no | Bit mask for various widget states |
| | | | | **Mask** / **Name** / **Description** |
| | | | | 0x01 / enabled / Indicates whether the widget is enabled. A disabled widget should be grayed out or invisible. |
| | | | | 0x02 / writable / Indicates whether the widget is writable. |
| OptParams | a{qv} | N/A | no | Metadata dictionary. See [Property widget metadata][property-widget-metadata] for more information. |
| Values | v | N/A | yes | Actual value of the property. When modifying the property, the device may give the AllJoyn error org.alljoyn.Error.MethodNotAllowed if the property is ReadOnly. The supported data types are listed in [Supported data types][supported-data-types]. |

#### Property widget metatdata

The following table lists property widget metadata.

| Dictionary key | Field name | Value type | Description |
|---|---|---|---|
| 0 | Label | s | Label |
| 1 | bgColor | u | Background color expressed as RGB value. If not specified, then the background color of the enclosing container is used. |
| 2 | hints | aq | The widget rendering hints. See [Property widget hints][property-widget-hints] for more information. |
| 3 | unitOfMeasure | s | Unit of measurement. |
| 4 | constrainToValue | a(vs) | Constraint on the value as a list of values. Any value of the property must match one of the values in this list. See [List of values][list-of-values] for more information. |
| 5 | range | vv | Constraint on the value as a range; a value of this property  must stay within the range. See [Property widget ranges][property-widget-ranges] for more information. |

#### Property widget hints

| Hint ID | Hint name | Description |
|---|---|---|
| 1 | Switch | Two-state buttons allowing the end-user to toggle the state of a single settings option. |
| 2 | CheckBox | Widget for multi-select. It allows the end user to select multiple options from a list. |
| 3 | Spinner | Widget for single-select. It allows the end user to select a single option from a list. |
| 4 | RadioButton | Widget for single-select. It allows the end user to select a single option from a list. |
| 5 | Slider | Allows the end user to select a value from a continuous or discrete range. The appearance is linear, either horizontal or vertical. |
| 6 | TimePicker | Allows the end user to specify a time value. |
| 7 | DatePicker | Allows the end user to specify a date value. |
| 8 | NumberPicker | Allows the end user to specify a numeric value |
| 9 | NumericKeypad | Provides the end user with a numeric entry field and buttons for 0-9 digits, to enter a numeric value. The developer must know the min/max number of digits allowed in the entry field. |
| 10 | RotaryKnob | An alternate way to represent a slider. |
| 11 | TextLabel | Read-only text label. |
| 12 | NumericView | Provides a read-only, numeric field with an optional label and numbers. For example, a washing machine display shows the time remaining for wash is 35:00 minutes. |
| 13 | EditText | Provides the end user with a text entry field and keyboard. The developer must know the min/max number of letters allowed in the entry field. |

#### Supported data types

The following table lists the data types supported by the Control Panel service framework.

| Category | Supported data types |
|---|---|
| Scalar types | * BOOLEAN - b |
| | * BYTE - y |
| | * BYTE ARRAY - ay |
| | * Numeric types: |
| |   * INT16 - n |
| |   * UINT16 - q |
| |   * INT32 - i |
| |   * UNT32 - u |
| |   * INT64 - x |
| |   * UINT64 - t |
| |   * DOUBLE - d |
| | * STRING - s |
| Composite types | All composite data type must have the following signature--q(type)--where the first value is an enum value indicating the composite type |
| | **Composite type enum** / **Composite type name** / **Signature** / **Description** |
| | 0 / Date / q(qqq) / Data type per RFC3339. There are three fields: date-mday (1-31); date-month (1-12); and date-fullyear (4-digit year). |
| | 1 / Time / q(qqq) / Time type per RFC3339. There are three fields: time-hour (0-23); time-minute (0-59); and time-second (0-59). |
| Collection of records | Array of records of only scalar and supported composite types. All records in the array must be of the same record type. |

#### List of values

A list of values is an array of structs.

| Field name | Data type | Description |
|---|---|---|
| Value | v | Value with the same data type of the property. |
| Label | s | Display label. |

#### Property widget ranges

The following table lists Property widget ranges.

| Field name | Data type | Description |
|---|---|---|
| min | v | Minimum value with the same data type as that of the property. |
| max | v | Maximum value with the same data type as that of the property. |
| increment | v | Value to increment/decrement by. It has the same data type as that of the property. |

### Methods

No methods are exposed by this interface.

### Signals

| Signal name | Parameters | Description |
|---|---|---|
| | **Name** / **Data type** | | 
| ValueChanged | newValue / v | The property's value has changed. |
| ValueChanged | none | The metadata has changed. This can occur due to changes in any of the property objects. |


### Introspect XML

The following XML defines the Property interface.

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.Property">
      <property name="Version" type="q" access="read"/>
      <property name="States" type="u" access="read"/>
      <property name="OptParams" type="a{qv}" access="read"/>
      <property name="Value" type="v" access="readwrite"/>
      <signal name="MetadataChanged" />
      <signal name="ValueChanged">
         <arg type="v"/>
      </signal>
   </interface>
</node>
```

## LabelProperty Interface
 
This interface provides the control mechanism for the label 
property widget (a text label). Each widget is represented 
by an AllJoyn object implementing this interface.
 
### Interface name
 
| Interface name | Version | Secured | Object path |
|---|---|---|---|
| org.alljoyn.ControlPanel.LabelProperty | 1 | no | /ControlPanel/{unit}/{panel}/{language}/.../ {object name} |
| | | | Example: |
| | | | /ControlPanel/airconditioner/consolel/Warning |

### Properties

|Property name | Signature | List of values | Writable | Description |
|---|---|---|---|---|
| Version | q | Positive integers | no | Interface version number |
| States | u | Bit mask | no | Bit mask for various widget states |
| | | | | **Mask** / **Name** / **Description** |
| | | | | 0x01 / enabled / Indicates whether the widget is enabled. A disabled widget should be grayed out or invisible. |
| Label | s | N/A | no | Text label |
| OptParams | a{qv} | N/A | no | Metadata dictionary. See [LabelProperty widget metadata][labelproperty-widget-metadata] for more information. |

#### LabelProperty widget metadata

The following table lists LabelProperty widget metadata.

| Dictionary key | Field name | Value type | Description |
|---|---|---|---|
| 1 | bgColor | u | Background color expressed as RGB value. If not specified, then the background color of the enclosing container is used. |
| 2 | hints | aq | The widget rendering hints. See [LabelProperty widget hints][labelproperty-widget-hints] for more information. |

#### LabelProperty widget hints

The following table lists LabelProperty widget hints.

| Hint ID | Hint name | Description |
|---|---|---|
| 1 | TextLabel | Read-only text label. |

### Methods

No methods are exposed by this interface.

### Signals

| Signal name | Parameters | Description |
|---|---|---|
| MetadataChanged | none | The metadata has changed. This can occur due to changes in any of the property objects. |

### Introspect XML

The following XML defines the LabelProperty interface.

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.LabelProperty">
      <property name="Version" type="q" access="read"/>
      <property name="States" type="u" access="read"/>
      <property name="Label" type="s" access="read"/>
      <property name="OptParams" type="a{qv}" access="read"/>
      <signal name="MetadataChanged" />
   </interface>
</node>
```

## Action Interface

This interface provides the control mechanism for the Action widget. 
Each Action widget is represented by an AllJoyn object implementing 
this interface. An action widget can optionally provide a confirmation 
dialog widget in its object sub-tree to allow for a pop-up dialog to 
appear whenever the UI presentation of this action is activated. 
The action taken on the confirmation dialog will take place instead 
of the Exec() method call for this Action widget.

### Interface name
 
| Interface name | Version | Secured | Object path |
|---|---|---|---|
| org.alljoyn.ControlPanel.Action | 1 | no | /ControlPanel/{unit}//{panel}/{language}/.../{object name} |
| | | | Example: |
| | | | /ControlPanel/{unit}/{panel}/{language}/.../{object name}  |
| org.alljoyn.ControlPanel.SecuredAction | 1 | yes | /ControlPanel/{unit}/{panel}/{language}/.../{object name} |

### Properties

|Property name | Signature | List of values | Writable | Description |
|---|---|---|---|---|
| Version | q | Positive integers | no | Interface version number |
| States | u | Bit mask | no | Bit mask for various widget states |
| | | | | **Mask** / **Name** / **Description** |
| | | | | 0x01 / enabled / Indicates whether the widget is enabled. A disabled widget should be grayed out or invisible. |
| OptParams | a{qv} | N/A | no | Metadata dictionary. See [Action widget metadata][action-widget-metadata] for more information. |

#### Action widget metadata

The following table lists action widget metadata.

| Dictionary key | Field name | Value type | Description |
|---|---|---|---|
| 0 | label | s | Label |
| 1 | bgColor | u | Background color expressed as RGB value. If not specified, then the background color of the enclosing container is used. |
| 2 | hints | aq | The widget rendering hints. See [Action widget hints][action-widget-hints] for more information. |

#### Action widget hints

The following table lists Action widget hints.

| Hint ID | Hint name | Description |
|---|---|---|
| 1 | ActionButton | Button associated with an action or a method call, for example, "submit". |

### Methods

#### Exec

**Inputs** 

None.

**Output**

None.

**Description**

Execute the action command.

### Signals

| Signal name | Parameters | Description |
|---|---|---|
| MetadataChanged | none | The metadata has changed. This can occur due to changes in any of the property objects. |

### Introspect XML

The following XML defines the Action interface.

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.Action">
      <property name="Version" type="q" access="read"/>
      <property name="States" type="u" access="read"/>
      <property name="OptParams" type="a{qv}" access="read"/>
      <signal name="MetadataChanged" />
      <method name="Exec"/>
   </interface>
</node>
```

## NotificationAction Interface

This interface indicates whether the object is a notification 
action object. A notification object is typically referenced 
in a notification message. Upon receiving such notification, 
the controller can generate the notification action panel 
based on the metadata provided by this type of object. 
This object is different from a regular control panel since 
it allows the controllee to send a signal to tell the controller 
to dismiss the panel.

This object supports at least one language. It's the responsibility 
of the controller to introspect the children objects to locate 
the corresponding root container of the given panel for the 
specific language code.

### Interface name
 
| Interface name | Version | Secured | Object path |
|---|---|---|---|
| org.alljoyn.ControlPanel.NotificationAction | 1 | no | /NotificationPanel/{unit}/{actionPanelName} |
| | | | Example: |
| | | | /NotificationPanel/washing/CycleCompleted  |

### Properties

|Property name | Signature | List of values | Writable | Description |
|---|---|---|---|---|
| Version | q | Positive integers | no | Interface version number |

### Signals

| Signal name | Parameters | Description |
|---|---|---|
| Dismiss | none | The controller must dismiss this notification panel. |

### Introspection XML

The following XML defines the NotificationAction interface.

```
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.NotificationAction">
      <property name="Version" type="q" access="read"/>
      <signal name="Dismiss" />
   </interface>
</node>
```

## Dialog Interface

This interface provides all the metadata to guide the controller 
to render the UI for a dialog widget. A dialog widget typically 
has a message and up to three action buttons.

### Interface name
 
| Interface name | Version | Secured | Object path |
|---|---|---|---|
| org.alljoyn.ControlPanel.Dialog | 1 | no | /ControlPanel/{unit)/{panelName}/{language}/.../{dialogName} |
| | | | Example: |
| | | | /ControlPanel/washing/mainPanel/en/Confirmation  |
| org.alljoyn.ControlPanel.SecuredDialog | 1 | yes | /ControlPanel/{unit}/{panel}/{language}/.../{dialogName} |

### Properties

|Property name | Signature | List of values | Writable | Description |
|---|---|---|---|---|
| Version | q | Positive integers | no | Interface version number |
| States | u | Bit mask | no | Bit mask for various widget states |
| | | | | **Mask** / **Name** / **Description** |
| | | | | 0x01 / enabled / Indicates whether the widget is enabled. A disabled widget should be grayed out or invisible. |
| OptParams | a{qv} | N/A | no | Metadata dictionary. See [Dialog widget metadata][dialog-widget-metadata] for more information. |
| Message | q | N/A | no | Display message. |
| NumActions | q | 1-3 | no | Number of available actions. |

#### Dialog widget metadata

The following table lists Dialog widget metadata.

| Dictionary key | Field name | Value type | Description |
|---|---|---|---|
| 0 | label | s | Label or title of the dialog. |
| 1 | bgColor | u | Background color expressed as RGB value. If not specified, then the background color of the enclosing container is used. |
| 2 | hints | aq | Layout hints. See [Dialog widget layout hints][dialog-widget-layout-hints] for more information. |
| 6 | labelAction1 | s | Label of the action1 widget. |
| 7 | labelAction2 | s | Label of the action2 widget. |
| 8 | labelAction3 | s | Label of the action3 widget. |

#### Dialog widget layout hints

The following table lists Dialog layout hints.

| Hint ID | Hint name | Description |
|---|---|---|
| 1 | AlertDialog | Widget that combines a label, text data, and buttons in a single dialog box. A minimum of 1 button is required. A maximum of 3 buttons is supported. |

### Methods

#### Action1

**Inputs**

None.

**Output**

None.

**Description**

Execute the action number 1.

#### Action2

**Inputs**

None.

**Output**

None.

**Description**

Execute the action number 2. If the NumActions property is 
less than 2, the org.alljoyn.Error.MethodNotAllowed error 
will be raised.

#### Action3

**Inputs**

None.

**Output**

None.

**Description**

Execute the action number 3. If the NumActions property 
is less than 3, the org.alljoyn.Error.MethodNotAllowed 
error will be raised.

### Signals

| Signal name | Parameters | Description |
|---|---|---|
| MetadataChanged | none | The metadata has changed. This can occur due to changes in any of the property objects. |

### Introspection XML

The following XML defines the Dialog interface.

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.Dialog">
      <property name="Version" type="q" access="read"/>
      <property name="States" type="u" access="read"/>
      <property name="OptParams" type="a{qv}" access="read"/>
      <property name="Message" type="s" access="read"/>
      <property name="NumActions" type="q" access="read"/>
      <signal name="MetadataChanged" />
      <method name="Action1"/>
      <method name="Action2"/>
      <method name="Action3"/>
   </interface>
</node>
```

## ListProperty Interface

This interface provides the control mechanism for the list 
property widget. A list property widget holds a list of 
records and a container representing the UI of the record 
display/input form.

### Interface name
 
| Interface name | Version | Secured | Object path |
|---|---|---|---|
| org.alljoyn.ControlPanel.ListProperty | 1 | no | /ControlPanel/{unit}/{language}/{panel}/{object name} |
| | | | Example: |
| | | | /ControlPanel/sprinkler/mainPanel/en/Schedules  |
| org.alljoyn.ControlPanel.SecuredListProperty | 1 | yes | /ControlPanel/{unit}/{language}/{panel}/.../{object name} |

### Properties

|Property name | Signature | List of values | Writable | Description |
|---|---|---|---|---|
| Version | q | Positive integers | no | Interface version number |
| States | u | Bit mask | no | Bit mask for various widget states |
| | | | | **Mask** / **Name** / **Description** |
| | | | | 0x01 / enabled / Indicates whether the widget is enabled. A disabled widget should be grayed out or invisible. |
| OptParams | a{qv} | N/A | no | Metadata dictionary. See [ListProperty widget metadata][listproperty-widget-metadata] for more information. |
| Value | a{qs} | N/A | no | List of records. Each record in the list holds the following fields: |
| | | | | * recordID (q): the record ID |
| | | | | * label (s): the label to display on the list |
| | | | | The record data are not exposed in this property. The View() method call can be used to view each record. |

#### ListProperty widget metadata

The following table lists ListProperty widget metadata.

| Dictionary key | Field name | Value type | Description |
|---|---|---|---|
| 0 | label | s | Label |
| 1 | bgColor | u | Background color expressed as RGB value. If not specified, then the background color of the enclosing container is used. |
| 2 | hints | aq | Widget rendering hints. See [ListProperty widget hints][listproperty-widget-hints] for more information. |

#### ListProperty widget hints

The following table lists ListProperty widget hints.

| Hint ID | Hint name | Description |
|---|---|---|
| 1 | DynamicSpinner | Widget that allows the end user to select an option from a list, add a new option, delete an option, and update an option. |

### Methods

#### Add

**Inputs**

None.

**Output**

None.

**Description**

Prepare the input form for adding a new record to the list. 
UI requirements follow:

* The controller must present an OK button and tie it to the 
Confirm() method call. Completing the add action on the input 
form will add the new record to the list.
* The controller must present a Cancel button and tie to the 
Cancel() method call to allow for discarding the operation.

#### Delete

**Inputs**

| Parameter name | Signature | Description |
|---|---|---|
| recordID | q | The record ID. |

**Output**

None.

**Description**

Prepare the form for view the record prior to the delete action. 
UI requirements follow:
* The controller must present an OK button and tie it to the 
Confirm() method call. A confirm action deletes the record 
from the list.
* The controller must present a Cancel button and tie to the 
Cancel() method call to allow for discarding the operation.

#### View

**Inputs**

| Parameter name | Signature | Description |
|---|---|---|
| recordID | q | The record ID. |

**Output**

None.

**Description**

Prepare the display form to view the record identified by the recordID. 

The controller must present an OK button to dismiss the view form.

#### Update

**Inputs**

| Parameter name | Signature | Description |
|---|---|---|
| recordID | q | The record ID. |

**Output**

None.

**Description**

Prepare the input form to view the record identified by the 
recordID and allow the end user to modify the fields. 
UI requirements follow:

* The controller must present an OK button and tie it to the 
Confirm() method call. A confirm action updates the given 
record with new information.
* The controller must present a Cancel button and tie to the 
Cancel() method call to allow for discarding the operation.

#### Confirm

**Inputs**

None.

**Output**

None.

**Description**

Confirm the action and save the change requested.

The controller must present an OK button to dismiss the view form.

#### Cancel

**Inputs**

None.

**Output**

None.

**Description**

Cancel the current action.

The controller must present a Cancel button to dismiss the input form.

### Signals

| Signal name | Parameters | Description |
|---|---|---|
| ValueChanged | none | The property's value has changed. Because the list data can be large, the signal does not send the current value. |
| MetadataChanged | none | The metadata has changed. This can occur due to changes in any of the property objects. |

### Introspect XML

The following XML defines the ListProperty interface.

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.ControlPanel.ListProperty">
      <property name="Version" type="q" access="read"/>
      <property name="States" type="u" access="read"/>
      <property name="OptParams" type="a{qv}" access="read"/>
      <property name="Value" type="a(qs)" access="read"/>
      <method name="Add"/>
      <method name="Delete">
         <arg name="recordID" type="q" direction="in"/>
      </method>
      <method name="View">
         <arg name="recordID" type="q" direction="in"/>
      </method>
      <method name="Update">
         <arg name="recordID" type="q" direction="in"/>
      </method>
      <method name="Confirm">
      </method>
      <method name="Cancel">
      </method>

      <signal name="MetadataChanged"/>
      <signal name="ValueChanged"/>
   </interface>
</node>
```

## Support of Existing HTTP Control Pages

Should a device already have HTTP control pages hosted 
on the device itself, it can advertise those pages using 
the HTTPControl interface.

This interface provides all the information about the 
hosted HTTP control pages on the device.

### Interface name

 
| Interface name | Version | Secured | Object path |
|---|---|---|---|
| org.alljoyn.ControlPanel.HTTPControl | 1 | no | /Control/{unit}/HTTPControl |

### Properties

|Property name | Signature | List of values | Writable | Description |
|---|---|---|---|---|
| Version | q | Positive integers | no | Interface version number |

### Methods

#### GetRootURL

**Inputs**

None.

**Output**

| Return signature | Description |
|---|---|
| s | Root URL of the control pages. |

### Signals

There is no signal in this interface.

###Introspection XML

The following XML defines the HTTPControl interface.

```xml
<node xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="https://www.allseenalliance.org/schemas/introspect.xsd">
   <interface name="org.alljoyn.Control.HTTPControl">
      <property name="Version" type="q" access="read"/>
      <method name="GetRootURL">
         <arg name="url" type="s" direction="out"/>
      </method>
   </interface>
</node>
```

[controlpanel-latest]: /learn/base-services/controlpanel/interface

[controlpanel-arch]: /files/learn/controlpanel-arch.png
[controlpanel-static-call-flow]: /files/learn/controlpanel-static-call-flow.png
[controlpanel-dynamic-call-flow]: /files/learn/controlpanel-dynamic-call-flow.png
[controlpanel-busobject-map]: /files/learn/controlpanel-busobject-map.png
[controlpanel-washing-machine-example]: /files/learn/controlpanel-washing-machine-example.png
[controlpanel-sprinkler-system-example]: /files/learn/controlpanel-sprinkler-system-example.png

[container-widget-metadata]: #container-widget-metadata
[container-widget-layout-hints]: #container-widget-layout-hints

[property-widget-metadata]: #property-widget-metadata
[supported-data-types]: #supported-data-types
[property-widget-hints]: #property-widget-hints
[list-of-values]: #list-of-values
[property-widget-ranges]: #property-widget-ranges

[labelproperty-widget-metadata]: #labelproperty-widget-metadata
[labelproperty-widget-hints]: #labelproperty-widget-hints

[action-widget-metadata]: #action-widget-metadata
[action-widget-hints]: #action-widget-hints

[dialog-widget-metadata]: #dialog-widget-metadata
[dialog-widget-layout-hints]: #dialog-widget-layout-hints

[listproperty-widget-metadata]: #listproperty-widget-metadata
[listproperty-widget-hints]: #listproperty-widget-hints

