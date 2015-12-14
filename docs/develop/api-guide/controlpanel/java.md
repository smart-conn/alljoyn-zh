# Control Panel API Guide - Java

## Reference code

### Control Panel service framework packages

| Package | Description |
|---|---|
| ControlPanelService.jar | The service layer does all the work against the AllJoyn&trade; framework. |
| ControlPanelAdapter.jar | Creates Android-specific user interface views. |

### Reference Java application code

| Application | Description |
|---|---|
| ControlPanelBrowser.apk | Sample application that uses the service framework and adapter APIs. |


## Obtain the Control Panel service framework

See the [Building Android section][building-android] for instructions
on obtaining the Control Panel service framework.

### Build a Controller

The following steps provide the high-level process to build a Controller.

1. Create the base for the AllJoyn application.
2. Start the AboutClient.
3. Listen for the announcement to find Controllee devices on the network.
4. Choose a control panel from the collection that was received
in the announcement in your preferred language.
5. Establish a session with the Controllee device that you
would like to interact with.
6. Get the device's control panel widgets to pass to the Adapter.
The Adapter converts these widgets to Android UI elements.
7. Get the Android UI elements from the Adapter to be displayed
in the application. These elements are combined to create the
graphical control panel that is displayed by the Controller
application for the end user to interact with.

### Setting up the AllJoyn framework and About feature

The steps required for this service are universal to all applications
that use the AllJoyn framework and for any application using
one or more AllJoyn services. Prior to use of the Control Panel
service framework, the About feature must be implemented and the
AllJoyn framework set up.

Complete the procedures in the following sections to guide you in this process:

* [Building Android][building-android]
* [About API Guide][about-api-guide-java]

## Implementing a Controller

### Initialize the AllJoyn framework

See the [About API Guide][about-api-guide-java] for instructions to
set up the AllJoyn framework.

### Start the AboutService in client mode

The Control Panel service framework depends on the About feature.

For more information about the About feature, see the [About API Guide][about-api-guide-java].

#### Initialize the About feature

```java
aboutClient = AboutServiceImpl.getInstance();
aboutClient.startAboutClient(bus);
```

#### Listen for announcements from Controllee devices

Register an announcement handler to receive announcements
from the About feature.

```java
aboutClient.addAnnouncementHandler(announcementHandler,
new String[] { "org.alljoyn.ControlPanel.*" });
```

For each announcement that is received, check if it implements
the ControlPanel interface. If it does, save it as a controllable
device for later use.

```java
@Override
public void onAnnouncement(String busName, short port, BusObjectDescription[]
objectDescriptions, Map<String, Variant> aboutMap) {
   Variant varDeviceId = aboutMap.get(AboutKeys.ABOUT_DEVICE_ID);
   String devIdSig	= VariantUtil.getSignature(varDeviceId);
   if ( !devIdSig.equals("s") ) {
      return;
   }
   deviceId = varDeviceId.getObject(String.class);
   // get the device name from the annoucement just as the device id above

   for(int i = 0; i < objectDescriptions.length; ++i){
      BusObjectDescription description = objectDescriptions[i];
      String[] supportedInterfaces	= description.getInterfaces();
      for(int j = 0; j < supportedInterfaces.length; ++j){
      if(supportedInterfaces[j].startsWith
         ("org.alljoyn.ControlPanel")){
         // found a control panel interface
         if (deviceContext == null) {
            deviceContext = new DeviceContext
         (deviceId, busName, deviceName);
}	 deviceContext.addObjectInterfaces
(description.getPath(), supportedInterfaces);
         }
      }
   }
}
```

### Get the controllable device

Once a controllable device is detected via the announcement,
get its ControllableDevice proxy object.

The ControllableDevice is used to later create a session
with the Controllee.

```java
controllableDevice = ControlPanelService.getInstance()
   .getControllableDevice(deviceContext.deviceId, deviceContext.busName);
```

### Start a session with the Controllee

To get the control panels of a Controllee, you must create a
session with it. This is an asynchronous call and requires a
DeviceEventsListener as a callback.

```java
controllableDevice.startSession(DeviceEventsListener);
```

Listen for a sessionEstablished event to verify the session
was established successfully. When a session is established,
a collection of control panel containers is received.

**NOTE:** There may be more than one control panel container, each
intended for a different use. For example, one for the home user
and another for a technician. Each element of the container is a
DeviceControlPanel and provided per language.

```java
@Override
public void sessionEstablished(ControllableDevice device,
   Collection<ControlPanelCollection> controlPanelContainer)
{
   //At this point the session was established
}
```

#### Implement the DeviceEventsListeners

There are other methods of the DeviceEventsListener
(besides for sessionEstablished) that should be implemented
to receive session-related events from the Control Panel
service framework.

```java
public void sessionLost(ControllableDevice device);

public void errorOccured(ControllableDevice device, String reason);
```

For more information, refer to the API documentation.


### Get a device control panel

Get a collection of device control panels and select the one
with the desired language.

```java
Collection<DeviceControlPanel> controlPanels =
      controlPanelCollection.getControlPanels();
for(DeviceControlPanel controlPanel : controlPanels) {
   String cpLanguage = controlPanel.getLanguage();
   if (cpLanguage.equalsIgnoreCase(desired_language){
      //found the desired device control panel
      DeviceControlPanel deviceControlPanel = controlPanel;
   }
}
```

### Get the root container

Once the DeviceControlPanel is selected, get its root container element.

The root container element is the top-level UI element that
contains all the child UI elements of the selected DeviceControlPanel.

Detect the type of the root container. It may be either a ContainerWidget
or an AlertDialogWidget (mostly used for notification with action).

```java
UIElement rootContainerElement =
   deviceControlPanel.getRootElement(ControlPanelEventsListener);
UIElementType elementType = rootContainerElement.getElementType();
```

#### Implement the ControlPanelEventsListener

The ControlPanelEventsListener interface should be implemented
to receive changes that occurred in the control panel on the
Controllee and should be reflected on the UI accordingly.

```java
public void valueChanged(DeviceControlPanel panel, UIElement uielement, Object newValue);

public void metadataChanged(DeviceControlPanel panel, UIElement uielement);

public void notificationActionDismiss(DeviceControlPanel panel);

public void errorOccured(DeviceControlPanel panel, String reason);
```

For more information, refer to the API documentation.

### Build the Android UI elements

The Adapter loops through the UI elements list, received from
the root container, and builds a linear layout with all the
contained Android views.

The application can embed this inside an activity.

```java
ControlPanelAdapter  controlPanelAdapter =
new ControlPanelAdapter(Context, ControlPanelExceptionHandler);

// create an android view for the abstract container
final View adapterView = controlPanelAdapter.createContainerView(container);
```

#### ControlPanelExceptionHandler

When an error occurs while retrieving any of the widgets, the Adapter
throws an exception to the application to better handle the error.
The application can decide how to display this error to the user.
A typical method is to show a toast to the user that an error occurred.

### Compile the code

See the [Building Android][building-android] section for instructions on how to
compile the application with this service framework.

[building-android]: /develop/building/android
[about-api-guide-java]: /develop/api-guide/about/java
