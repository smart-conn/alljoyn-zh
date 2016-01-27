# Android - 控制面板样例应用程序

## 运行一个 Controllee

按照 [Running - Linux section][run-linux] 中的说明搭建并运行一个 Controllee 样例应用程序。你将可以在一台 Linux 机器上运行 ControlPanelService Controllee 样例。

## 运行 Android ControlPanelBrowser
Android ControlPanelBrowser 使用控制面板服务框架并为控制面板 Controller 提供了一个实现样例。

1. 载入 ControlPanelBrowser.apk, 然后运行 `ControlPanelBrowser` 应用程序。

  ![][1.StartScreen]

2. 附近被发现的 Controllee 设备会出现在屏幕上。

  ![][2.AfterStartingControlPanelSampleOnLinux]

3. 在列表中选择一个 Controllee，此 Controllee 的组件会在 Controller 应用程序中被渲染。

  ![][3.ClickOnControlPanelSampleDevice]


[1.StartScreen]: /files/develop/run-sample-apps/android-controlpanel-sample/1.StartScreen.png
[2.AfterStartingControlPanelSampleOnLinux]: /files/develop/run-sample-apps/android-controlpanel-sample/2.AfterStartingControlPanelSampleOnLinux.png
[3.ClickOnControlPanelSampleDevice]: /files/develop/run-sample-apps/android-controlpanel-sample/3.ClickOnControlPanelSampleDevice.png


[run-linux]:  /develop/run-sample-apps/controlpanel/linux
