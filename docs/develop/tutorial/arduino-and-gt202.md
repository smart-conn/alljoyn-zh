# Arduino + GT202

The AllJoyn&trade; Thin Core Library includes a Wi-Fi driver for the GT202 Wi-Fi board,
known as WSL. This document explains how to setup the hardware and software
to run AllJoyn Thin Apps on an Arduino Due running FreeRTOS, including the WSL
Wi-Fi driver, that connects to a GT202 Wi-Fi board over SPI.

## Hardware Requirements

The following hardware devices are needed in order to test and 
evaluate the project as stated in this document.

* Arduino Due
* TransmogriShield
* GT202 kit
* Segger J-link JTAG or equivalent
* Segger ARM-JTAG 10-pin to 20-pin adapter

The following figures identify the connections between the 
Arduino Due, TransmogriShield, and GT202 kit.

1. Align the female SPI connection of the TransmogriShield 
with the male SPI connection of the Arduino Due as shown in the following figure.
2. Connect the male pins on the bottom of the GT202 kit to the 
female connectors on the Shield side of the TransmogriShield 
board as shown in the GT202 pinout diagram.

![arduino-due-board-connections][arduino-due-board-connections]

**Figure:** Arduino Due board connections

![gt202-pinout][gt202-pinout]

**Figure:** GT202 kit pinout

## Installing Third-Party Software

### Windows 7

#### Windows 7 third-party software and installation information

| Tool | Minimum version requirement | Installer/Notes |
|---|---|---|
| ARM GNU Tool Chain | 4.8 2013q4 | <p>Download the [installer](https://launchpad.net/gcc-arm-embedded/4.8/4.8-2013-q4-major/%2Bdownload/gcc-arm-none-eabi-4_8-2013q4-20131204-win32.exe) and execute.</p><p>Windows will install the ARM GNU Tool Chain in (C:\Program Files (x86)\GNU Tools ARM Embedded\4.8 2013q4\bin) which may be used for an environmental variable.</p> |
| FreeRTOS | 7.6.0 | <ol><li>Download the [ZIP file](https://sourceforge.net/projects/freertos/files/FreeRTOS/V7.6.0/) and unzip to the local drive.</li><li>Note the path where the FreeRTOS ZIP file is extracted as it may be used in an environment variable.</li></ol> |
| Atmel Software Framework | 3.15 | <ol><li>Download the [ZIP file](http://www.atmel.com/tools/AVRSOFTWAREFRAMEWORK.aspx) and unzip to local drive.</li><li>Note the path where the framework ZIP file is extracted as it may be used in an environment variable.</li></ol><p>This requires providing contact information to receive a link to the software.</p> |
| J-Link software | 4.8.4a | <p>Download the [software and documentation](http://www.atmel.com/tools/AVRSOFTWAREFRAMEWORK.aspx) and install.</p><p>You must enter the serial number of the j-link device to complete the download./p> |
| Eclipse IDE | Release 2 | <p>Download the [appropriate Windows bit version](http://www.eclipse.org/downloads/packages/eclipse-ide-cc-developers/keplersr1).</p><p>Uncompress the file folder to the local drive.</p><p>If JRE (Java Runtime Environment) or JDK (Java Development Kit) has previously been installed, skip installing JRE (noted below).</p> |
| Java Runtime Environment (required for Eclipse) | &nbsp; | Download and install [JRE](http://www.oracle.com/technetwork/java/javase/downloads/java-se-jre-7-download-432155.html).
| Atmel Studio IDE | 6.1 | <p>Download the [installer (full)](http://www.atmel.com/tools/atmelstudio.aspx) and install.</p><p>**NOTE:** The installation requires the PC to restart.</p> |
| Python | 2.7.3 | <p>Python 2.6 may also be used.</p><p>Use the 32-bit version of Python even if you are building the AllJoyn framework for a 64-bit architecture.</p><ol><li>Open a browser and navigate to http://www.python.org/download/.</li><li>From the Python web page, select Python 2.7.3 Windows Installer (32-bit).</li><li>Click **Run** and **Run** again. The Python setup wizard appears.</li><li>Click **Finish**, **Yes**, and **Finish** again.</li></ol> |
| SCons | 2.3.0 | <ol><li>Open a browser and navigate to http://www.scons.org.</li><li>From the SCons web page, under 'Scons 2.3.0.final.0 is available', click the download page.</li><li>Select scons-2.3.0.final.0.win32.exe, and click **Run** and **Run** again. The setup wizard appears.</li><li>Proceed through the wizard steps to complete the SCons installation.</li></ol> |

### Linux (Ubuntu 12.04)

| Tool | Minimum version requirement | Installer/Notes |
|---|---|---|
| ARM GNU Tool Chain | 4.8 2013q4 | <ol><li>Open terminal and input `sudo add-apt-repository ppa:terry.guo/gcc-arm-embedded`</li><li>Press **Enter** to continue when prompted.</li><li>Input `sudo apt-get update`</li><li>Input `sudo apt-get install gcc-arm-none-eabi`</li></ol> |
| FreeRTOS | 7.6.0 | <ol><li>Download the [ZIP file](https://sourceforge.net/projects/freertos/files/FreeRTOS/V7.6.0/) and unzip to the local drive.</li><li>Note the path where the ZIP file is extracted as it may be used in an environment variable.</li></ol> |
| Atmel Software Framework | 3.15 | <ol><li>Download the [ZIP file](http://www.atmel.com/tools/AVRSOFTWAREFRAMEWORK.aspx) and unzip to the local drive.</li><li>Note the path where the ZIP file is extracted as it may be used in an environment variable.</li></ol><p>This requires providing contact information to receive a link to the software.</p> |
| J-Link software | 4.84a | <p>Download the [software and documentation](http://www.atmel.com/tools/AVRSOFTWAREFRAMEWORK.aspx) and install DEB, RPM or TGZ format.</p><p>You must enter the serial number of the j-link device to complete the download.</p> |
| Eclipse IDE | Release 2 | <ol><li>Download the [appropriate Linux version](http://www.eclipse.org/downloads/packages/eclipse-ide-cc-developers/keplersr1).</li><li>Uncompress the file folder to the local drive.</li></ol><p>If JRE (Java Runtime Environment) or JDK (Java Development Kit) has previously been installed, skip installing JRE (noted below).</p> |
| Java Runtime Environment (required for Eclipse) | &nbsp; | Open terminal and input `sudo apt-get install openjdk-7-jre` |
| Atmel Studio IDE | 6.1 | <p>Download [installer (full)](http://www.atmel.com/tools/atmelstudio.aspx) and install.</p><p>**NOTE:** The installation may require the PC to restart.</p> |
| SCons	| 2.3.0 | Open terminal and input `sudo apt-get install scons` |

## Configuring the Project Environment

### Get TCL for Arduino Due

1. Create a project folder.
2. Clone the ajtcl repo.
3. Check out the master branch.
   ```sh
   git clone https://git.allseenalliance.org/gerrit/core/ajtcl.git
   ```

The directory structure follows. Items marked with ** used in 
compilation and contain objects files.

```
**ajtcl (root folder)
   **bsp (Board-specific package)
      **due (Arduino Due target platform files) 
         config
   **crypto (Encryption) 
      ecc
   external
      **sha2 
   inc
   java
      ecompass
         .settings 
         src
            org
               alljoyn
                  bus
                     samples
   **malloc (Memory allocation)
   **RTOS (Real Time Operating System)
      **FreeRTOS (RTOS used for Arduino Due)
   Samples
      basic
      network
      secure
   **src (TCL source files) 
   target
      arduino
         examples
            AJ_LedServices 
         samples
            AJ_basic_client 
            AJ_basic_service 
            AJ_nameChange_client 
            AJ_SecureClient 
            AJ_SecureService
            AJ_signal_service 
            AJ_signalConsumer_client
         tests
            AJ_aetest 
            AJ_bastress2 
            AJ_clientlite 
            AJ_mutter 
            AJ_sessions 
            AJ_siglite 
            AJ_svclite
      linux
      win32
   **test (test applications .elf)
      **WSL (unit and API applications .elf) 
   tools
   unit_test
      test_report
   **WSL (APIs used for SPI with GT202)
```

### Set up environment variables

**NOTE:** These variables can be passed into SCons without setting 
environmental variables.

#### Windows 7

1. Right-click **My Computer** and select **Properties > Advanced system settings**.
2. Click **Environment Variables** on the **Advanced** tab.
3. Do the following to create a new system environment variable.
   1. Click **New** in the System variables section.
   2. In **Variable**, type FREE_RTOS_DIR.
   3. In **Variable value**, specify the name where the 
   FREERTOS ZIP file was extracted. 
   Example: "C:\FREERTOSv7.6.0\FREERTOS"
   4. Click **OK**.
4. Click **New** to add another system environment variable.
   1. In **Variable**, type ATMEL_DIR.
   2. In **Variable name**, specify the path where the 
   Atmel asf-standalone-archive ZIP file was extracted.
   Example: "C:\xdk-asf-3.15.0"
   3. Click **OK**.
5. Click **New** to add another system environment variable.
   1. In **Variable**, type ARM_TOOLCHAIN_DIR.
   2. In **Variable value**, specify the installation path 
   of the GNU ARM Toolchain. 
   Example: "C:\Program Files (x86)\GNU Tools ARM Embedded\4.8 2013q4\bin"
   3. Click **OK**.
6. Scroll through the user variables list and highlight **PATH**.
7. Click **Edit**.
8. In **Variable value**, add the installation path of the 
Python tool: "C:\Python27; C:\Python27\Scripts"
9. Click **OK** several times to save your changes.

#### Linux Ubuntu (12.04)

The instructions below are based on calling the Eclipse 
from Terminal. Other calling methods for Eclipse will 
require declaring the environmental variables in a different location.

1. Open terminal and edit .bashrc;.
2. Add an export variable "FREE_RTOS_DIR" with the location 
of the FreeRTOS folder. 
   Example: "export RTOS_DIR=~/FreeRTOSV7.6.0/FreeRTOS"
3. Add an export variable "ATMEL_DIR" with the location 
of the Atmel asf-standalone-archive.
   Example "export ATMEL_DIR=~/ xdk-asf-3.15.0"
4. Add an export variable "ARM_TOOLCHAIN_DIR" with the 
location of the GNU ARM Toolchain.
   Example "export ARM_TOOLCHAIN_DIR=/usr/bin"
5. Do the following to verify environmental variables:
   1. Open terminal and navigate to the ajtcl directory.
   2. Enter "scons -h".
   The environmental paths found by the SCons script will be displayed.

**NOTE:** The default will mirror actual since there are no default 
values set in the script.

### Configure the build file

Complete the following procedure to edit the FreeRTOSConfig.h.
 
1. Navigate to the FreeRTOSConfig.h file, located in 
%ATMEL_DIR%/thirdparty/freertos-7.3.0/module_config.
2. On approximately line 71, update the configCPU_CLOCK_HZ macro: 
Replace the sysclk_get_cpu_hz() function with 84000000UL.
3. Add the following macros:

   ```c
   #define vPortSVCHandler SVC_Handler
   #define xPortPendSVHandler PendSV_Handler
   #define xPortSysTickHandler SysTick_Handler
   ```

### Building with SCons

* For Release variant:
  The build command is "scons TARG=bsp AJWSL=due VARIANT=release WS=off".

* For the Debug variant:
  * The build command is "scons TARG=bsp AJWSL=due VARIANT=debug WS=off".
  * To clean the object files, add a "-c" at the end of the 
  command. Example: "scons TARG=bsp AJWSL=due VARIANT=debug WS=off -c"
 
## Configuring the IDEs

### Setting up the Atmel IDE

#### Initial setup

1. Create a new project by selecting **File > New > Project**.
2. In the templates section, select **C/C++ > Arduino-Boards for (Arduino Due/X - ATSAM3X8E)**.
3. Enter a name and select a location.
4. Locate the project in the **Solution Explorer** tab 
(tabs located along the bottom of the left pane).
5. Right-click the project and select **Properties**.
6. On the **Build** tab, select the **Use External Makefile** check box.
7. Click **Browse** and navigate to the Makefile in the ATL source directory.
8. Select the **Tool** tab and do the following:
   1. Select **J-Link** for the **Selected debugger/programmer**. 
   (The j-link device's serial number is specified next to this option.)
   2. Select **JTAG** for the **Interface**.
9. To test the build, right-click on the project and select **Build**.
10. To test the clean, right-click on the project and select **Clean**.

#### Flash firmware to Arduino

1. Set up the J-Link interface:
   1. Select **Tools > Device Programming**.
   2. Select **J-Link** for the **Tool**.
   3. Select **ATSAM3X8E** for the **Device**.
   4. Select **JTAG** for the **Interface**.
   5. Click **Apply**.
2. Select the **Memories** tab.
3. Do the following in the Flash section:
   1. Click **Browse** and navigate to the desired application 
   (.elf) to upload the target device.
   2. Click **Program**.
4. Click **Close**.

#### Debug the Atmel IDE

The makefile will build several target applications with a .elf extension

1. In the Solution Explorer pane, right-click the project node.
2. Rename it to the application that is going to be loaded.

### Setting up the Eclipse IDE

Complete the procedures in this section using Eclipse.

#### Initial setup
**NOTE:** Do not run any setup functions in the background while 
performing the steps below as this may fail to load some required libraries.

##### Install the GNU ARM compiler and J-Link debugging

1. Select **Help > Install New Software**.
2. Do the following:
   1. Type the following URL in the **Work with Edit** box: 
   http://gnuarmeclipse.sourceforge.net/updates
   2. Click **Add**.
3. Click **OK** in the pop-up dialog box.
   Once the updates have been sourced from the website, 
   the center pane will be populated.
4. Click **Select all** and then click **Next** at the bottom of the dialog box.
5. Click **Next** again to follow the prompts to accept 
license agreements. Acknowledge and security warnings if prompted.
6. After the software updates have been completed, click **Yes** 
to restart the Eclipse IDE.

##### Configure a project in Eclipse

1. Create a new project by selecting **File > New > Makefile 
Project with Existing Code**.
2. Enter a name for your project.
3. In **Existing Code Location**, click **Browse** and navigate 
to the /ajtcl folder. You can close the Welcome screen in order 
to view the Project Explorer.
4. In the Project Explorer, right-click on the new project and click **Properties**.
5. Do the following:
   1. Select **C/C++ Build** in the left pane.
   2. On the **Builder Settings** tab, unselect the **Use default 
   build command** check box.
6. Do the following for Windows 7:
   1. In **Build command**, enter "C:\Python27\Scripts\scons.bat".
   2. Select the **Behavior** tab.
   3. Do the following:
      1. Next to **Build (Incremental build)**, update the 
      entry field with "TARG=bsp AJWSL=due VARIANT=debug WS=off".
      2. Next to **Clean**, update the entry field with 
      "TARG=bsp AJWSL=due VARIANT=debug WS=off -c".
   4. Click **Apply** and click **OK**.
7. Do the following for Linux (Ubuntu):
   1. In **Build command**, enter scons.
   2. Select the **Behavior** tab.
   3. Do the following:
      1. Next to **Build (Incremental build)**, update the 
      entry field with "TARG=bsp AJWSL=due VARIANT=debug WS=off".
      2. Next to **Clean**, update the entry field 
      with "TARG=bsp AJWSL=due VARIANT=debug WS=off".
   4. Click **Apply** and then click **OK**.
8. Validate the IDE can compile the project by either 
clicking the hammer icon on the ribbon bar or entering Ctrl-B.

**NOTE:** After the project has completed compilation, all 
available applications (*.elf) are available to flash and debug.

#### Flash and debug

1. Set up the j-link interface by selecting **Run > Debug Configurations**.
2. In the left pane, right-click **GDB SEGGER J-Link Debugging** and click **New**.
3. Do the following on the **Main** tab:
   1. Click **Browse** under the **C/C++ Application** field entry.
   2. Navigate to the .elf file (target application) required 
   for flashing and debugging.
4. Under the Project location, click **Browse** and navigate 
to the current project folder.
5. Select the current project folder and click **OK**.
6. Select the **Debugger** tab.
7. To the right of **Executables**, click **Variables**.
8. Click **Edit Variables**.
9. Click **New** to create a new variable.
10. In **Name**, type jlink_path.
11. Do one of the following in the **Value** field:
   1. For Windows, enter C:\Program Files (x86)\SEGGER\JLinkARM_V480a.
   2. For Linux, enter /usr/bin.
12. Click **OK**.
13. Do the following on the **Debugger** tab:
   1. Make sure the **Executable** field path is: 
   ${jlink_path}/JLinkGDBServer${build_files}.
   2. In **Device name**, enter ATSAM3X8E.
   3. In the **GDB Client Setup** section, navigate to the 
   executable file arm-none-eabi-gdb.exe.
   * In Windows, it may be located in C:\Program Files (x86)\GNU Tools ARM Embedded\4.8 2013q4\bin.
   * In Linux, it should be in \usr\bin.
14. Click **Apply and Debug** to start the debugging session.

[arduino-due-board-connections]: /files/develop/tutorial/wsl/arduino-due-board-connections.png
[gt202-pinout]: /files/develop/tutorial/wsl/gt202-pinout.png
