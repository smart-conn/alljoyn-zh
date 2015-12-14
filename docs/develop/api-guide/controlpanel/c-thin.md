# Control Panel API Guide - C (Thin Core)

## Obtain the Control Panel service framework

The source code for this service framework can be found on
the [AllSeen Alliance gerrit page](https://git.allseenalliance.org/cgit/) as a git project.
In addition, the [ajtcl](https://git.allseenalliance.org/cgit/core/ajtcl.git/) project is
needed to compile this service framework.

If the target platform already supports the AllJoyn&trade;
Thin Library framework, follow the target platform documentation
for detailed setup and download instructions.

If the target platform does not support the AllJoyn Thin Library
framework, porting work is required to support this target.
See the [Introduction to AllJoyn Thin Library][intro-thin-library] for more
information about the AllJoyn Thin Library framework.

## Reference code

The reference code consists of several components each including
one or more modules. Additionally, included in the sample component
is a sample application that implements the Control Panel service
framework and contains a simple control panel with one example for
each kind of Widget.

| Components | Description |
|---|---|
| Control Panel Service | This includes three parts: Widgets, Common, and Main, each with their own modules which together make up the service and allow for interaction between Controllees and Controllers. |
| Control Panel Provided | Code specific to the Controllee that will handle requests from Controllers to set property values, get property values, and/or execute actions. Additionally it can initiate a refresh on the Controller by calling the Control Panel service framework's appropriate functions. This is device-specific code created by the OEM. |
| Control Panel Generator | A Generator tool that accepts an XML UI definition file, containing the Widgets and their properties that describe the specific Controllee's control panel and generate code into a Control Panel Generated code. |
| Control Panel Generated | Code generated using the Control Panel Generator. This code ties together the Control Panel Service and the Control Panel Provided code. |
| Control Panel Sample | A template for an application. This component is responsible for the general flow of the Controllee application including initialization, shutdown, and passing on incoming message to the ControlPanelService module. |

### Control Panel Service component

#### Widget modules

| Module | Description |
|---|---|
| ContainerWidget | Container UI element. Allows grouping of widgets together. Must contain at least one child element. |
| LabelWidget | UI element that functions as a read only label of text. |
| ActionWidget | UI element represented by a button that either executes code on the Controllee, or opens a Dialog Widget as a confirmation before executing. |
| DialogWidget | UI dialog element. Has a dialog message and up to 3 choices of buttons. |
| PropertyWidget | UI element used to display a value and possibly edit it. |

#### Common modules

| Module | Description |
|---|---|
| BaseWidget | Base module used by all the Widget modules. |
| ConstraintList | Module used when defining a constraint list for a property value. |
| ConstraintRange | Module used when defining a constraint range for a property value. |
| ControlMarshalUtil | Utility functions used to marshal control panel properties. |
| DateTimeUtil | Module that enables properties that have a Date or Time value. |
| HttpControl | Module that allows publicizing of a URL to function as a control panel for the Controllee. |

#### General modules

| Module | Description |
|---|---|
| ControlPanelInterface | The definitions of all ControlPanel Service interfaces. |
| ControlPanelService | Handler of all interactions between Controllers and Controllees. The application delegates incoming messages to this module for processing and handling. The actual handling is specific to the generated code. |

### Control Panel Provided component

This component contains the code specific to the device that
the Controllee application runs on. The Control Panel Generated
code will interact with this component to do the following:

* Set property values
* Get property values
* Execute actions

Additionally, it can initiate a refresh on the Controller by
calling the Control Panel service framework's appropriate functions.
The modules in this component are provided by a third party.

For example, think of a washing machine. The Control Panel
Provided component would be the code that communicates with
the hardware to perform actions such as setting the water
temperature or starting the wash cycle.

### Control Panel Generator component

#### Control Panel Generator modules

| Module | Description |
|---|---|
| PreGenFiles | Files used as a template for the ultimately generated files. |
| Cp.xsd and cpvalidate | <p>As part of the generation the XML undergoes two validation steps.</p><ol><li>Validate against an XSD to verify all tags and their content are correctly defined.</li><li>Validate to verify that all the required fields needed to display the widgets in the XML graphically are properly defined.</li></ol> |
| SampleXMLS | Collection of XML files that can be viewed as samples. |
| GeneratorScript | Python scripts that generate the code. For steps on how to generate the code, see [Start the Controllee][start-controllee].

### Control Panel Generated component

#### Control Panel Generated modules

| Module | Description |
|---|---|
| ControlPanelGenerated | The Generated files, created by the generator using the given XML. |

### Control Panel Sample component

#### Control Panel Sample modules

| Module | Description |
|---|---|
| ControlPanelSample | The module responsible for the generalflow of the Controllee application including initialization and shutdown of the ControlPanelService module, and related business logic when the application's message loop is idling. |
| ControlPanelProvided | The module responsible for the business logic of the actions and changes made to the generated code. It uses the generated model interfaces and implements its callbacks. |

## Build a Controllee

The following steps provide the high-level process to build a Controllee.

1. Create the base for the AllJoyn application. See the
[Build an Application using the Thin Library][build-app-thin-library]
section for instructions.
2. Create the code handlers necessary to control the device.
This includes getters and setters for properties and functions
to handle execution of actions.
3. Create the XML definition of the UI. Include calls to the
code handlers in the appropriate places.
4. Use the code generation tool provided in the SDK to generate
code from XML.

## Implementing a Controllee

### Create the base for the AllJoyn application

See the [Build an Application using the Thin Library][build-app-thin-library]
section for instructions.

### Create header file that declares device-specific callbacks

#### Callback signature for GetCode of property

```c
void* getTemperature(PropertyWidget* thisWidget) - Returns address of the property of the
provided widget casted to a void*
```

#### Callback for SetCode property

This signature is not determined by the Control Panel service
framework and can be chosen based on the specific applications
need. The assumption is that one of the parameters will be the
new value the property should be set to.

For example:

```c
void SetTemperature(uint16 newTemperature);
```

#### Callback for code execution of action

This signature is not determined by the service and can be
chosen based on the specific application's need.

For example:

```c
void StartOven();
```

### Create XML definition of UI

```xml
<controlPanelDevice xmlns="http://www.allseenalliance.org/controlpanel/gen">
   <name>MyDevice</name>
   <headerCode>#include "ControlPanelProvided.h"</headerCode>
   <languageSet name="myLanguages">
      <language>en</language>
      <language>de</language>
      <language>fr</language>
   </languageSet>
   <controlPanels>
      <controlPanel languageSet="myLanguages">
         <rootContainer>
         //rootContainer properties and child elements go here.
         </rootContainer>
      </controlPanel>
   </controlPanels>
</controlPanelDevice>
```

#### Naming conventions

The name of the unit (detailed in Add include statement(s)
for header file that contains device specific callbacks) and
the name of each individual Widget contained within a control
panel must adhere to the following naming conventions (this
is due to the fact that the unit name and widget name are used
as part of the AllJoyn BusObject object paths that the Control
Panel service framework utilizes).

* Must contain only the ASCII characters "[A-Z][a-z][0-9]_"
* Cannot be an empty string

See [XML UI Element Descriptions][xml-ui-descriptions] for
samples of names that follow these conventions.

#### Create a controlPanelDevice tag with the XML schema

```xml
<controlPanelDevice xmlns="http://www.allseenalliance.org/controlpanel/gen">
</controlPanelDevice>
```

#### Define the name of the unit in the name tag

Define the name of the unit between the controlPanelDevice tags.

```xml
<name>MyDevice</name>
```

#### Add include statement(s) for header file that contains
device specific callbacks

Add the include statements after the name tag. More than one
header file can be added. See [Create header file that declares
device-specific callbacks][create-header-file] for more information.

```xml
<headerCode>#include "ControlPanelProvided.h"</headerCode>
```

#### Define the language set for the control panel

Add this after the headerCode tag. This must include a list of
languages that the control panel can display labels and
messages in. More than one language set can be defined.

NOTE: For the sake of completeness and integrity of the device's
overall user experience, it is recommended to have the textToSend
array match the SupportedLanguages list published by the About
feature and provisioned for the PropertyStore in the application.

```xml
<languageSet name="myLanguages">
   <language>en</language>
   <language>de</language>
   <language>fr</language>
</languageSet>
```

#### Set up the control panel structure

Add this after the languageSets tag. Each control panel needs
to define the preferred language set. More than one control
panel can be defined.

```xml
<controlPanels>
   <controlPanel languageSet="myLanguages">
   </controlPanel>
   <controlPanel languageSet="mySecondLanguageSet">
   </controlPanel>
</controlPanels>
```

#### Define a root container and its child elements

Add the root container within the controlPanel tags. The
rootContainer is the main ContainerWidget used to group together
all the widgets that make up the control panel. For more information
on Container Widgets and possible child widgets, see [Widget modules][widget-modules]
and [XML UI Element Descriptions][xml-ui-descriptions].

```xml
<rootContainer>
   //rootContainer properties and child elements go here.
</rootContainer>
```

### Run the Code Generator tool

In the CPSAppGenerator directory, run the generator command
to produce the Control Panel Generated Code from the XML.

```sh
python generateCPSApp.py [nameOfXML] [DirectoryOfApplication]
```

This Python script generates the following c and h files in
the application directory:

* ControlPanelGenerated.c
* ControlPanelGenerated.h

These files will be used to build the Controllee application.

### Start the Controllee

The Controllee is required to be passed the provisioning by
the application via a call to
`AJCPS_Start()`.

An example is in `Controlee_Init()` of ControlPanelSample.c.
Both the bus object list and the callbacks are implemented
in the ControlPanelGenerated.c and are linked to the business
logic in ControlPanelProvided.c.

```c
/**
* Message processor for the ControlPanel generated model.
*/
AJSVC_ServiceStatus GeneratedMessageProcessor(AJ_BusAttachment* bus,
   AJ_Message* msg, AJ_Status* msgStatus) {...}
/**
* Returns the corresponding widget object attributes for the given identifier.
*/
void* IdentifyMsgOrPropId(uint32_t identifier, uint16_t* widgetType,
   uint16_t* propType, uint16_t* language) {...}
/**
* Returns the corresponding property for the given identifier.
*/
void* IdentifyMsgOrPropIdForSignal(uint32_t identifier, uint8_t*
isProperty) {...}
/**
* Returns the whether the given identifier is of the root object.
*/
uint8_t IdentifyRootMsgOrPropId(uint32_t identifier) {...}

/**
* The list of bus objects to be registered by the ControlPanel SF.
*/
AJ_Object controlleeObjectList[] = { AJCPS_CONTROLLEE_GENERATED_OBJECTS
   { NULL }
};

AJ_Status Controlee_Init()
{
   AJ_Status status = AJCPS_Start(controlleeObjectList,
&GeneratedMessageProcessor,
   &IdentifyMsgOrPropId, &IdentifyMsgOrPropIdForSignal,
   &IdentifyRootMsgOrPropId); WidgetsInit();
   return status;
}
```

### Compile the code

The process to compile varies depending on the host and target
platform. Each host and platform needs may require a specific
directory and file layout, build tool chains, procedures,
and supported AllJoyn service frameworks. Refer to the target
platform documentation that contains instructions on how to
organize and set up the build process to incorporate the
necessary files to compile your Thin Library application.

For more details on how to combine this AllJoyn service
framework with other AllJoyn service framework software,
see the [Build an Application using the Thin Library][build-app-thin-library] section.

## XML UI Element Descriptions

This section provides XML UI element samples for each Control
Panel interface. See the [Control Panel Interface Definition][controlpanel-interface-definition]
for a full description of each interface.

### Container

#### Sample XML for Container

```xml
<container>
   <name>rootContainer</name>
   <secured>false</secured>
   <enabled>true</enabled>
   <bgcolor>0x200</bgcolor>
   <label>
      <value type="literal" language="en">My Label of my container</value>
      <value type="literal" language="de">Container Etikett</value>
   </label>
   <hints>
      <hint>vertical_linear</hint>
   </hints>
   <elements>
      //Child elements (Action/Property/Label/Container, etc.) defined here
   </elements>
<container>
```

#### Container properties

| Property | Possible values | Required | Description |
|---|---|---|---|
| name | alphanumeric | yes | Name of widget. |
| secured | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the interface of the Container will be secured or not. |
| enabled | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the container will be visible or not. |
| bgColor | unsigned int | no | Background color expressed as RGB value. |
| label | <ul><li>code</li><li>value</li></ul> | no | <p>Label of the Container.</p><ul><li>If code, a function pointer to receive the label.</li><li>If value, can be a literal or a constant.</li></ul> |
| hints | <ul><li>vertical_linear</li><li>horizontal_linear</li></ul> | no | Container layout hint. |
| elements | <ul><li>Action</li><li>Property</li><li>LabelProperty</li><li>Container</li></ul> | yes | Child widgets. Can be one or more within a Container. |

### Actions

#### Sample XML for Action

The onAction tag includes the execute code and dialog options.
Both options cannot be included in the same tag.

```xml
<action>
   <name>ovenAction</name>
   <onAction>
      <executeCode>startOven();</executeCode>
         OR
      <dialog>
      //dialog properties here
      </dialog>
   </onAction>
   <secured>true</secured>
   <enabled>true</enabled>
   <label>
      <value type="literal" language="en">Start Oven</value>
      <value type="literal" language="de">Ofen started</value>
   </label>
   <bgcolor>0x400</bgcolor>
   <hints>
      <hint>actionButton</hint>
   </hints>
</action>
```

#### Action properties

| Property | Possible values | Required | Description |
|---|---|---|---|
| name | alphanumeric | yes | Name of widget. |
| onAction | <ul><li>executeCode</li><li>dialog</li></ul> | yes | <p>Determines what happens when the actionButton is pressed.</p><ul><li>If executeCode, that code will be executed.</li><li>If dialog, a dialog will be displayed.</li></ul> |
| secured | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the interface of the Action will be secured or not. |
| enabled | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the Action will be visible or not. |
| label | <ul><li>code</li><li>value</li></ul> | no | <ul><li>If code, a function pointer to receive the label.</li><li>If value, can be a literal or a constant.</li></ul> |
| bgColor | unsigned int | no | Background color expressed as RGB value. |
| hints | Action hint | no | Can be actionButton. |

### labelProperty

#### Sample XML for labelProperty

```xml
<labelProperty>
   <name>CurrentTemp</name>
   <enabled>true</enabled>
   <label>
      <value type="literal" language="en">Current Temperature:</value>
      <value type="literal" language="de">Aktuelle Temperatur:</value>
   </label>
   <bgcolor>0x98765</bgcolor>
   <hints>
      <hint>textlabel</hint>
   </hints>
</labelProperty>
```

#### labelProperty properties

| Property | Possible values | Required | Description |
|---|---|---|---|
| name | alphanumeric | yes | Name of widget. |
| enabled | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the Label will be visible or not. |
| label | <ul><li>code</li><li>value</li></ul> | no | <ul><li>If code, a function pointer to receive the label.</li><li>If value, can be a literal or a constant.</li></ul> |
| bgColor | unsigned int | no | Background color expressed as RGB value. |
| hints | Label hint | no | Can be textLabel. |

### Property

Depending on the signature of the value, there are different
ways to construct a property in the XML. Samples and property
information for each supported signature are provided here.

* String
* Boolean
* Date
* Time
* Scalar

#### Sample XML for stringProperty

```xml
<stringProperty>
   <name>modeStringProperty</name>
   <getCode>getStringVar</getCode>
   <setCode>setStringVar(%s)</setCode>
   <secured>false</secured>
   <enabled>true</enabled>
   <writable>true</writable>
   <label>
      <value type="constant" language="en">HEATING_MODE_EN</value>
      <value type="constant" language="de">HEATING_MODE_DE</value>
   </label>
   <bgcolor>0x500</bgcolor>
   <hints>
      <hint>edittext</hint>
   </hints>
   <constraintVals>
      <constraint>
      <display>
         <value type="literal" language="en">Grill Mode</value>
         <value type="literal" language="de ">Grill Modus</value>
      </display>
         <value>Grill</value>
   </constraint>
   <constraint>
      <display>
         <value type="literal" language="en">Regular Mode</value>
         <value type="literal" language="de">Normal Modus</value>
      </display>
      <value>Normal</value>
      </constraint>
   </constraintVals>
</stringProperty>
```

#### stringProperty properties

| Property | Possible values | Required | Description |
|---|---|---|---|
| name | alphanumeric | yes | Name of widget. |
| Property | Function pointer | yes | Pointer to function that returns a property's value. The signature of the function pointer needs to be `void* (*functionptr)()`. |
| setcode | Code to execute on setProperty | yes | Code to execute when setProperty is called. Any %s in the setCode content will be replaced by the generator with the new value. |
| secured | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the interface of the Property will be secured or not. |
| enabled | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the Property will be visible or not. |
| writable | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the Property will be writable or not. |
| label | <ul><li>code</li><li>value</li></ul> | no | <p>Text of the Property's label.</p><ul><li>If code, a function pointer to receive the text.</li><li>If value, can be a literal or a constant.</li></ul> |
| bgColor | unsigned int | no | Background color expressed as RGB value. |
| hints | <ul><li>switch</li><li>spinner</li><li>radiobutton</li><li>textview</li><li>edittext</li></ul> | no | Label hint. |
| constraintVals | List of constraints | no | Constraint Property to a list of values. Each Constraint is made up of a value and its display. |

#### Sample XML for Boolean property

```xml
<booleanProperty>
   <name>checkboxProperty</name>
   <getCode>getTurboModeVar</getCode>
   <setCode>setTurboModeVar(%s)</setCode>
   <secured>false</secured>
   <enabled>true</enabled>
   <writable>true</writable>
   <label>
      <value type="literal" language="en">Turbo Mode:</value>
      <value type="literal" language="de">Turbo Modus:</value>
   </label>
   <bgcolor>0x500</bgcolor>
   <hints>
      <hint>checkbox</hint>
   </hints>
</booleanProperty>
```

#### booleanProperty properties

| Property | Possible values | Required | Description |
|---|---|---|---|
| name | alphanumeric | yes | Name of widget. |
| getCode | Function pointer | yes | Pointer to function that returns a property's value. The signature of the function pointer needs to be `void* (*functionptr)()`. |
| setcode | Code to execute on setProperty | yes | Code to execute when setProperty is called. Any %s in the setCode content will be replaced by the generator with the new value. |
| secured | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the interface of the Property will be secured or not. |
| enabled | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the Property will be visible or not. |
| writable | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the Property will be writable or not. |
| label | <ul><li>code</li><li>value</li></ul> | no | <p>Text of the Property's label.</p><ul><li>If code, a function pointer to receive the text.</li><li>If value, can be a literal or a constant.</li></ul> |
| bgColor | unsigned int | no | Background color expressed as RGB value. |
| hints | checkbox | no | Hint for how the UI should be rendered. |

#### Sample XML for Date property

```xml
<dateProperty>
   <name>startDateProperty</name>
   <getCode>getStartDateVar</getCode>
   <setCode>setStartDateVar(%s)</setCode>
   <secured>false</secured>
   <enabled>true</enabled>
   <writable>true</writable>
   <label>
      <value type="literal" language="en">Start Date:</value>
      <value type="literal" language="de">Starttermin:</value>
   </label>
   <bgcolor>0x500</bgcolor>
   <hints>
      <hint>datepicker</hint>
   </hints>
</dateProperty>
```

#### dateProperty properties

| Property | Possible values | Required | Description |
|---|---|---|---|
| name | alphanumeric | yes | Name of widget. |
| getCode | Function pointer | yes | Pointer to function that returns a property's value. The signature of the function pointer needs to be `void* (*functionptr)()`. |
| setcode | Code to execute on setProperty | yes | Code to execute when setProperty is called. Any %s in the setCode content will be replaced by the generator with the new value. |
| secured | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the interface of the Property will be secured or not. |
| enabled | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the Property will be visible or not. |
| writable | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the Property will be writable or not. |
| label | <ul><li>code</li><li>value</li></ul> | no | <p>Text of the Property's label.</p><ul><li>If code, a function pointer to receive the text.</li><li>If value, can be a literal or a constant.</li></ul> |
| bgColor | unsigned int | no | Background color expressed as RGB value. |
| hints | datepicker | no | Hint for how the UI should be rendered. |

#### Sample XML for Time property

```xml
<timeProperty>
   <name>startTimeProperty</name>
   <getCode>getStartTimeVar</getCode>
   <setCode>setStartTimeVar(%s)</setCode>
   <secured>false</secured>
   <enabled>true</enabled>
   <writable>true</writable>
   <label>
      <value type="literal" language="en">Start Time:</value>
      <value type="literal" language="de">Startzeit:</value>
   </label>
   <bgcolor>0x500</bgcolor>
   <hints>
      <hint>timepicker</hint>
   </hints>
</timeProperty>
```

#### timeProperty properties

| Property | Possible values | Required | Description |
|---|---|---|---|
| name | alphanumeric | yes | Name of widget. |
| getCode | Function pointer | yes | Pointer to function that returns a property's value. The signature of the function pointer needs to be `void* (*functionptr)()`. |
| setcode | Code to execute on setProperty | yes | Code to execute when setProperty is called. Any %s in the setCode content will be replaced by the generator with the new value. |
| secured | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the interface of the Property will be secured or not. |
| enabled | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the Property will be visible or not. |
| writable | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the Property will be writable or not. |
| label | <ul><li>code</li><li>value</li></ul> | no | <p>Text of the Property's label.</p><ul><li>If code, a function pointer to receive the label.</li><li>If value, can be a literal or a constant.</li></ul> |
| bgColor | unsigned int | no | Background color expressed as RGB value. |
| hints | timepicker | no | Hint for how the UI should be rendered. |

#### Sample XML for Scalar property

The constraintDefs tag includes the value and range example.
Both cannot be included in the same tag.

```xml
<scalarProperty dataType="UINT16">
   <name>heatProperty</name>
   <getCode>getTemperatureVar</getCode>
   <setCode>setTemperatureVar(%s)</setCode>
   <secured>false</secured>
   <enabled>true</enabled>
   <writable>true</writable>
   <label>
      <value type="literal" language="en">Oven Temperature</value>
      <value type="literal" language="de">Ofentemperatur</value>
   </label>
   <bgcolor>0x500</bgcolor>
   <hints>
      <hint>spinner</hint>
   </hints>
   <constraintDefs>
      <constraintVals>
         <constraint>
            <display>
               <value type="literal" language="en">Regular</value>
               <value type="literal" language="de">Normal</value>
            </display>
            <value>175</value>
         </constraint>
         <constraint>
            <display>
               <value type="literal" language="en">Hot</value>
               <value type="literal" language="de">Heiss</value>
            </display>
            <value>200</value>
         </constraint>
      </constraintVals>
   OR
      <constraintRange>
         <min>0</min>
         <max>400</max>
         <increment>25</increment >
      </constraintRange>
   </constraintDefs>
   <unitMeasure>
      <value type="literal" language="en">Degrees</value>
      <value type="literal" language="de">Grad</value>
   </unitMeasure>
</scalarProperty>
```

#### scalarProperty properties

| Property | Possible values | Required | Description |
|---|---|---|---|
| dataType | <ul><li>INT16</li><li>UINT16</li><li>INT32</li><li>UINT32</li><li>INT64</li><li>DOUBLE</li></ul> | yes | Scalar data types |
| name | alphanumeric | yes | Name of widget. |
| getCode | Function pointer | yes | Pointer to function that returns a property's value. The signature of the function pointer needs to be `void* (*functionptr)()`. |
| setcode | Code to execute on setProperty | yes | Code to execute when setProperty is called. Any %s in the setCode content will be replaced by the generator with the new value. |
| secured | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the interface of the Property will be secured or not. |
| enabled | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the Property will be visible or not. |
| writable | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the Property will be writable or not. |
| label | <ul><li>code</li><li>value</li></ul> | no | <p>Text of the Property's label.</p><ul><li>If code, a function pointer to receive the text.</li><li>If value, can be a literal or a constant.</li></ul> |
| bgColor | unsigned int | no | Background color expressed as RGB value. |
| hints | <ul><li>timepicker</li><li>radiobutton</li><li>slider</li><li>numberpicker</li><li>keypad</li><li>numericview</li></ul> | no | Hint for how the UI should be rendered. |
| constraintDefs | <ul><li>constraintList</li><li>constraintRange</li></ul> | no | <ul><li>If constraintList, each constraint is made up of a value and its display.</li><li>If constraintRange, each constraint is made up of a min, max and increment value.</li></ul> |
| unitMeasure | <ul><li>code</li><li>value</li></ul> | no | <p>Unit of measure for the Property.</p><ul><li>If code, a function pointer to receive the unit measure text.<ul><li>code</li><li>value</li></ul>If value, can be a literal or a constant.</li></ul> |

### Dialog

#### Sample XML for a Dialog

```xml
<dialog>
   <name>LightConfirm</name>
   <secured>false</secured>
   <enabled>true</enabled>
   <message>
      <value type="literal" language="en">Do you want to turn on the light</value>
      <value type="literal" language="de">Wollen sie das Licht andrehen</value>
   </message>
   <label>
      <value type="literal" language="en">Turn on Light</value>
      <value type="literal" language="de">Licht andrehen</value>
   </label>
   <bgcolor>0x122</bgcolor>
   <hints>
      <hint>alertdialog</hint>
   </hints>
   <button>
      <label>
         <value type="literal" language="en">Yes</value>
         <value type="literal" language="de">Ja</value>
      </label>

      <executeCode>TurnOnLight(true);</executeCode>
   </button>
   <button>
   <label>
      <value type="literal" language="en">No</value>
      <value type="literal" language="de">Nein</value>
   </label>

      <executeCode>TurnOnLight(false);</executeCode>
   </button>
</dialog>
```

#### Dialog properties

| Property | Possible values | Required | Description |
|---|---|---|---|
| name | alphanumeric | yes | Name of widget. |
| secured | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the interface of the Dialog will be secured or not. |
| enabled | <ul><li>true</li><li>false</li></ul> | yes | Determines whether the Dialog will be visible or not. |
| message | <ul><li>code</li><li>value</li></ul> | no | <p>Message of the Dialog.</p><ul><li>If code, a function pointer to receive the text.</li><li>If value, can be a literal or a constant.</li></ul> |
| label | <ul><li>code</li><li>value</li></ul> | no | <p>Text of the Dialog's label.</p><ul><li>If code, a function pointer to receive the text.</li><li>If value, can be a literal or a constant.</li></ul> |
| bgColor | unsigned int | no | Background color expressed as RGB value. |
| hints | alertdialog | no | Hint for how the UI should be rendered. |
| button | Label and executeCode | Yes - can have up to 3 | <p>Each button must contain the following:</p><ul><li>A Label tag that contains the text that appears on the button.</li><li>An executeCode tag which contains the code to be executed on the Controllee when the button is pressed.</li></ul> |




[intro-thin-library]: /learn/core/thin-core
[start-controllee]: #start-the-controllee
[build-app-thin-library]: /develop/tutorial/thin-app
[create-header-file]: #create-header-file-that-declares-device-specific-callbacks
[widget-modules]: #widget-modules
[xml-ui-descriptions]: #xml-ui-element-descriptions
[controlpanel-interface-definition]: /learn/base-services/controlpanel/interface
