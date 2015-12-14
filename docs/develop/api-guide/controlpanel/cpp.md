# Control Panel API Guide - C++

## Reference code

### Source code

#### Repsitories used to build a Controllee

| Package | Description |
|---|---|
| alljoyn | The Standard Client AllJoyn&trade; framework code |
| AboutService | About feature code |
| ControlPanelService | Control Panel service framework code |
| Services Common | Code that is common to the AllJoyn service frameworks |
| Sample Apps | Code that is common to the AllJoyn service frameworks sample applications |

#### Repositories used to build a Controllee with a Notification Producer

| Package | Description |
|---|---|
| alljoyn | The Standard Client AllJoyn framework code |
| AboutService | About feature code |
| ControlPanelService | Control Panel service framework code |
| NotificationService | Notification service framework code |
| Services Common | Code that is common to the AllJoyn service frameworks |
| Sample Apps | Code that is common to the AllJoyn service frameworks sample applications |

### Reference C++ application code

| Application | Description |
|---|---|
| ControlPanelBrowser | Basic application that allows viewing of ControlPanels |

### Obtain the Control Panel service framework

See the [Building Linux][building-linux] section for
instructions on compiling the ControlPanel service framework.
The Control Panel Service is made up of several components.

#### Control Panel Service components

Components that allow for interaction between Controllees and
Controllers are defined below. This is the service layer and
does not have any application-specific code.

##### Widget modules

The following widget modules are contained in the Control
Panel Service component used to create a ControlPanel.

| Module | Description |
|---|---|
| Container | Container UI element. Allows grouping of widgets together. Must contain at least one child element. |
| Label | UI element that functions as a read only label of text. |
| Action | UI element represented by a button that either executes code on the Controllee, or opens a Dialog Widget as a confirmation before executing. |
| Dialog | UI dialog element. Has a dialog message and up to 3 choices of buttons. |
| Property | UI element used to display a value and possibly edit it. |

##### Control Panel Provided component

This component contains the code specific to the device that
the Controllee application runs on. The Control Panel Generated
code will interact with this component to do the following:

* Set property values
* Get property values
* Execute actions.

Additionally, it can initiate a refresh on the Controller by
calling the Control Panel service framework's appropriate functions.
The modules in this component are provided by a third party.

For example, think of a washing machine. The Control Panel
Provided component would be the code that communicates with
the hardware to perform actions such as setting the water
temperature or starting the wash cycle.

##### Control Panel Generator component

A Generator tool that accepts an XML UI definition file,
containing the Widgets and their properties that describe the
specific Controllee's control panel and generate code into a
Control Panel Generated code. For steps on how to generate the
code, see [Run the Code Generator tool][run-code-generator-tool].

##### Control Panel Sample component

This component is a template for an application, and responsible
for the general flow of the Controllee application including
initialization and shutdown. It relies on the generated and the provided code.

### Build a Controllee

The following steps provide the high-level process to build a Controllee.

1. Create the base for the AllJoyn application.
2. Implement the ProperyStore and use this with the AboutService
in server mode. See the [About API Guide][about-api-guide-cpp] for instructions.
3. Create the code handlers necessary to control the device.
This includes getters and setters for properties and functions
to handle execution of actions.
4. Create the XML definition of the UI. Include calls to the
code handlers in the appropriate places.
5. Use the code generation tool provided in the SDK to generate
code from XML.
6. Initialize the Control Panel Service and the Controllee.
Send an announcement to broadcast the available controlpanels.

## Implementing a Controllee

### Initialize the AllJoyn framework

See the [Building Linux][building-linux] section for
instructions to set up the AllJoyn framework.

#### Create bus attachment

```cpp
BusAttachment* bus = CommonSampleUtil::prepareBusAttachment();
```

### Start the AboutService in server mode

The Control Panel service framework depends on the About feature.

For more information about the About feature, see the
[About API Guide][about-api-guide-cpp].

#### Create a PropertyStore and fill it with the needed values

```cpp
propertyStore = new AboutPropertyStoreImpl();; propertyStore->setDeviceName(deviceName); propertyStore->setAppId(appIdHex); propertyStore->setAppName(appName); std::vector<qcc::String> languages(3); languages[0] = "en";
languages[1] = "sp";
languages[2] = "fr";
propertyStore->setSupportedLangs(languages);
propertyStore->setDefaultLang(defaultLanguage);

   DeviceNamesType::const_iterator iter = deviceNames.find(languages[0]);
   if (iter != deviceNames.end()) {
      CHECK_RETURN(propertyStore->setDeviceName(iter->second.c_str(), languages[0]));
   } else {
      CHECK_RETURN(propertyStore->setDeviceName("My device name", "en"));
   }

   iter = deviceNames.find(languages[1]);
   if (iter != deviceNames.end()) {
      CHECK_RETURN(propertyStore->setDeviceName(iter->second.c_str(), languages[1]));
   } else {
      CHECK_RETURN(propertyStore->setDeviceName("Mi nombre de dispositivo",
"sp"));
   }

   iter = deviceNames.find(languages[2]);
   if (iter != deviceNames.end()) {
      CHECK_RETURN(propertyStore->setDeviceName(iter->second.c_str(), languages[2]));
   } else {
      CHECK_RETURN(propertyStore->setDeviceName("Mon nom de l'appareil", "fr"));

   }
```

#### Implement a BusListener and SessionPortListener

In order to bind a SessionPort and accept sessions, a new
class must be created that inherits from the AllJoyn BusListener
and SessionPortListener classes.

The class must contain the following function:

```cpp
bool AcceptSessionJoiner(SessionPort sessionPort,
   const char* joiner, const SessionOpts& opts)
```

The AcceptSessionJoiner function will be called any time a
joinsession request is received; the Listener class needs
to dictate whether the joinsession request should be accepted
or rejected by returning true or false, respectively.
These considerations are application-specific and can
include any of the following:

* The SessionPort the request was made on
* Specific SessionOpts limitations
* The number of sessions already joined.

Here is an example of a full class declaration for the listener class.

```cpp
class CommonBusListener : public ajn::BusListener,
   public ajn::SessionPortListener
{

   public: CommonBusListener();
      ~CommonBusListener();
      bool AcceptSessionJoiner(ajn::SessionPort sessionPort,
         const char* joiner, const ajn::SessionOpts& opts);
      void setSessionPort(ajn::SessionPort sessionPort);
      ajn::SessionPort getSessionPort();
   private:
      ajn::SessionPort m_SessionPort;
};
```

#### Instantiate a BusListener and initialize the About feature

```cpp
busListener = new CommonBusListener();
AboutServiceApi::Init(*bus, *propertyStore);
AboutServiceApi* aboutService = AboutServiceApi::getInstance();

busListener->setSessionPort(port);
bus->RegisterBusListener(*busListener);
TransportMask transportMask = TRANSPORT_ANY;
SessionPort sp = port;
SessionOpts opts(SessionOpts::TRAFFIC_MESSAGES, false,
   SessionOpts::PROXIMITY_ANY, transportMask);
bus->BindSessionPort(sp, opts, *busListener);
aboutService->Register(port);
bus->RegisterBusObject(*aboutService);
```

### Initialize the Control Panel service and the Controllee

```cpp
ControlPanelService* controlPanelService = ControlPanelService::getInstance();
ControlPanelControllee* controlPanelControllee = 0;
ControlPanelGenerated::PrepareWidgets(controlPanelControllee);
controlPanelService->initControllee(bus, controlPanelControllee);
```

### Send an Announcement

```cpp
AboutServiceApi* aboutService = AboutServiceApi::getInstance();
aboutService->Announce();
```

### Create header file that declares device specific callbacks

#### Callback signature for GetCode of property

```cpp
uint16_t getTemperature() - Returns the property value.
dataType is specific to the applications needs
```

#### Callback for SetCode property

This signature is not determined by the Control Panel service
framework and can be chosen based on the specific application's
need. The assumption is that one of the parameters will be
the new value the property should be set to.

For example:

```cpp
void SetTemperature(uint16 newTemperature);
```

#### Callback for code execution of action

This signature is not determined by the Control Panel service
framework and can be chosen based on the specific application's need.

For example:

```cpp
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

The name of the unit (detailed in [Add include statements
for header file that contains device-specific callbacks][add-include-statements])
and the name of each individual Widget contained within a
control panel must adhere to the following naming conventions
(this is due to the fact that the unit name and widget name
are used as part of the AllJoyn BusObject object paths
that the Control Panel service framework utilizes).

* Contain only the ASCII characters "[A-Z][a-z][0-9]_"
* Cannot be an empty string

See [XML UI Element Descriptions][xml-ui-element-descriptions] for
samples of names that follow these conventions.

#### Create a controlPanelDevice tag with the XML schema

```xml
<controlPanelDevice xmlns="http://www.allseenalliance.org/controlpanel/gen">
</controlPanelDevice>
```

#### Define the name of unit in the name tag

Define the name of the unit between the controlPanelDevice tags.

```xml
<name>MyDevice</name>
```

#### Add include statements for header file that contains device-specific callbacks

Add the include statements after the name tag. More than one
header file can be added. See [Initialize the Control Panel
service and the Controllee][initialize-controlpanel-service-controllee] for more information.

```xml
<headerCode>#include "ControlPanelProvided.h"</headerCode>
```

#### Define the language set for the control panel

Add this after the headerCode tag. This must include a list of
languages that the control panel can display labels and messages
in. More than one language set can be defined.

```xml
<languageSet name="myLanguages">
   <language>en</language>
   <language>de</language>
   <language>fr</language>
</languageSet>
```

#### Set up the control panel structure

Add this after the languageSets tag. Each control panel must
define the preferred language set. More than one control panel can be defined.

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
all the widgets that make up the control panel. For more
information on Container Widgets and possible child widgets,
see [Widget modules][widget-modules] and [XML UI Element Descriptions][xml-ui-element-descriptions].

```xml
<rootContainer>
//rootContainer properties and child elements go here.
</rootContainer>
```

### Run the Code Generator tool

In the CPSAppGenerator directory, run the generator command
to produce the Control Panel Generated Code from the XML.

```sh
python generateCPSApp.py <XML file the generate code from>
   -p <destination path for generated files>
```
This Python script generates the following c and h files in
the application directory:

* ControlPanelGenerated.cc
* ControlPanelGenerated.h

In addition, it generates a class for every property and action
defined in the XML.

These files will be used to build the Controllee application.

### Compile the code

The process to compile varies depending on the host and target
platform. Each host and platform needs may require a specific
directory and file layout, build toolchains, procedures, and
supported AllJoyn service frameworks. Refer to the target
platform documentation that contains instructions on how
to organize and set up the build process to incorporate
the necessary files to compile your application.

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

[building-linux]:  /develop/building/linux
[run-code-generator-tool]: #run-the-code-generator-tool
[about-api-guide-cpp]: /develop/api-guide/about/cpp
[add-include-statements]: #add-include-statements-for-header-file-that-contains-device-specific-callbacks
[initialize-controlpanel-service-controllee]: #initialize-controlpanel-service-controllee
[xml-ui-element-descriptions]: #xml-ui-element-descriptions
[widget-modules]: #widget-modules
[controlpanel-interface-definition]: /learn/base-services/controlpanel/interface
