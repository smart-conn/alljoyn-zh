# Getting started with AllJoyn.js
The primary goal of AllJoyn.js is to make it easy to develop AllJoyn applications
in JavaScript, one of the most widely used programming languages in the world.

AllJoyn.js is a deep integration between the AllJoyn Thin Core Library (AJTCL) and base
services with Duktape [www.duktape.org](http://www.duktape.org), an ECMAScript 5.0 compliant
compiler and runtime specifically designed for running in small-footprint embedded
microcontrollers. Although it is designed to work within the limited resources of embedded
microcontrollers, Alljoyn.js is not limited to this use case and can also be used
for general AllJoyn programming on Windows, Linux, and other high-level operating
systems.

The AllJoyn.js runtime environment includes a “ScriptConsole” service that provides
support for installing new scripts and interacting with a running JavaScript
application. The ScriptConsole service is an AllJoyn service, and like any other
AllJoyn service it can be accessed over the network from another device running a
corresponding client application. The current code base includes a command line
ScriptConsole client on Linux, Windows and Mac OSX. This command line tool can
be used to install new scripts into a running AllJoyn.js instance and also allows
JavaScript code to be entered interactively. The ScriptConsole supports remote
logging of string data passed to the print() and alert() JavaScript functions.


# Building from source (Windows and Linux)
Building AllJoyn.js from source has external dependencies. The AllJoyn functionality
is based on the AllJoyn Thin Client. Underneath the Thin Client is the JavaScript
engine itself which compiles and runs the scripts. This JavaScript engine is called
Duktape.

## Duktape

AllJoyn.js depends on the Duktape ECMAScript compiler.
That source code can be found [here](http://www.duktape.org).
AllJoyn.js v15.04 depends on Duktape v1.2.1. After downloading, extract the archive
and note the location. AllJoyn Thin Client compiles and links against the Duktape
source so an environment variable needs to be set to Duktape's location.

#### Windows

```
set DUKTAPE_DIST="C:\Path\to\duktape\root"
```

#### Linux

```
export DUKTAPE_DIST=/Path/to/duktape/root
```

## AllJoyn Thin Client

AllJoyn.js itself is built on top of AllJoyn Thin Client. The console application
uses the AllJoyn Standard Client. You will need to have both building in
order to both run AllJoyn.js and use the console.

Instructions for getting Thin Client sources can be found
[here](https://allseenalliance.org/developers/develop/building/thin-linux)

Note: Use version 15.04b or later of the AllJoyn Thin Client

```
git checkout RB15.04
scons
```

## Base Services

AllJoyn.js also depends on several of the base services. The git
repository for the base services can be downloaded using git clone:

```
git clone https://git.allseenalliance.org/gerrit/services/base.git
```

The RB15.04 release branch must also be checked out:

```
git checkout RB15.04
```

## AllJoyn.js

After building the Thin Client library check that your folder structure is set up
correctly or AllJoyn.js won't know where to find the libraries you built in the
previous steps. Your folder structure should be as follows:

```
allseen
   | ---- core
   |        | ---- alljoyn-js
   |        | ---- ajtcl    (Thin Client)
   |        | ---- alljoyn  (Standard Client)
   |
   | ---- services
            | ---- base_tcl
            | ---- base
```

As shown above, the AllJoyn.js git repository must be checked out at the same level
as AllJoyn Thin Client. AllJoyn.js can be pulled from git in the same manner as the
other AllJoyn repositories:

```
git clone https://git.allseenalliance.org/gerrit/core/alljoyn-js.git
git checkout RB15.04
scons
```

## Console Application

To build the console application another environment variable needs to be set which
points to the location of the alljoyn library (alljoyn.lib or liballjoyn.so). This location is in
the build directory in the alljoyn (Standard Client) repository. The full path is
“/build/{os}/{architecture}/{debug|release}/dist”. Set the environment variable
the same way as you did for duktape. For example, for an x86 debug build the path
would look like:

#### Windows

```
set ALLJOYN_DIST="<path-to-alljoyn-folder>/build/win7/x86/debug/dist"
```

#### Linux

```
export ALLJOYN_DIST="<path-to-alljoyn-folder>/build/linux/x86/debug/dist"
```

With that set the console application should be able to build. Navigate to the console
folder and run scons

```
cd console
scons
```

## Python Debugger Console
The AllJoyn.js Console application also supports a debugging feature. The command
line debugger is built into the standard console discussed above. Additionally
there is a Python GUI that delivers a much better debugging experience. In order
to use the Python GUI you must build a Python extension for the AllJoyn.js console,
which has some additional dependencies. The Python GUI debugger works with Python 2.7
or 3.x on Linux, and Python 3.x on Windows. Building Python 2.7 extensions on 
Windows requires an older version of Visual Studio that is not compatible with current 
AllJoyn code. The Python GUI extension is currently easiest to build and use
on Linux.


#### Linux

On Ubuntu Linux use the following commands to install the required tools:

```
sudo apt-get install build-essential python-dev
```

Once these packages are installed, navigate to the console directory in your AllJoyn.js repository.
From here you need to build the library that allows Python to communicate with AllJoyn.js.

```
cd <ajs_git_repo>
cd console
python setup.py build
python setup.py install  # <--- May need to run as root user!
```

These commands will build the library and install it in a location that python
can find. If the installation was successful you can start up the GUI and begin
debugging. The examples below illustrate how to connect to an arbitrary
AllJoyn.js device, or to a specific one (using the --name flag):

```
python pydebugger.py

python pydebugger.py --name <device>
```

Once an AllJoyn.js client is found the GUI will launch and you can start debugging
your script.


#### Windows

Building the Python GUI on Windows is not quite as easy as Linux and may require
a workaround. The issue is that the Python 3 interpreters prior to 3.5 were built
using Visual Studio 2010, while many users have upgraded past that release. If you have Visual Studio 2010
installed you should have no problem building Python 3 extensions. If not, you will need to take
some extra steps. The initial steps are the same for all Visual Studio versions.

1. Download [Python 3.4](https://www.python.org/downloads/release/python-342/) (preferably 64 bit)

2. Download [Python extensions for Windows](http://sourceforge.net/projects/pywin32/files/) (same architecture as Python 3.4)

3. Install Python 3.4 first, then Python extensions for Windows

If you have multiple versions of Python installed, make sure your PATH environment variable has the Python 3.4 
directory listed before any other Python installations.

The next steps will depend on your Visual Studio version. If you have Visual Studio 2010 skip
to the “Building” section. Otherwise continue.

As mentioned before, Python 3.4 was built with Visual Studio 2010. It's possible to work around Python's
toolchain version checking to use your version of Visual Studio. Navigate to the Python 3.4 install directory and
open this file:

```
<Python34 dir>/Lib/distutils/msvs9compile.py
```

Search for the line:

```
VERSION = get_build_version()
```

Replace it with:

```
VERSION = 12.0
```

The actual number you use (12.0 in this case) will depend on the VS version you
have installed.

* VS 2011 = 10.0
* VS 2012 = 11.0
* VS 2013 = 12.0

Once that change is made you may move on to building the Python GUI debugger below.


#### Building

The steps for building are nearly the same as Linux. As mentioned before, make sure your PATH 
environment variable has the Python 3.4 directory listed first.

```
cd <ajs_git_repo>
cd console
python setup.py build
python setup.py install
```

# Download precompiled binaries

#### Windows, Linux and Mac

The Allseen Alliance hosts pre-built binaries for AllJoyn.js and the console application.

* [AllJoyn.js Windows](https://build.allseenalliance.org/ci/job/alljoyn-js-win/)
* [AllJoyn.js Linux](https://build.allseenalliance.org/ci/job/linux-js-nightly/)
* [AllJoyn.js Mac](https://build.allseenalliance.org/ci/job/alljoyn-js-mac/)

The console application still requires several Standard Client
libraries. Those libraries can be obtained, pre-compiled, by downloading the SDK.
Similar to building from source, you will need to point the console to the location
of these libraries.

#### Windows

```
set ALLJOYN_DIST="<path-to-SDK>"
```

#### Linux

```
export ALLJOYN_DIST="<path-to-SDK>"
```

Once that is done, you can download the pre-built console application for your platform.

* [Console Windows](https://build.allseenalliance.org/ci/job/alljoyn_js-console-win/)
* [Console Linux](https://build.allseenalliance.org/ci/job/alljoyn_js-console-linux/)
* [Console Mac](https://build.allseenalliance.org/ci/job/alljoyn_js-console-mac/)


#### Arduino Yun

These instructions assume you have updated your Yun to the LininoIO image.

Install these packages: duktape, ajtcl, ajtcl-services, alljoyn.js

```
wget http://download.linino.org/linino_distro/lininoIO/latest/packages/duktape_1.1.0-1_ar71xx.ipk && opkg install duktape_1.1.0-1_ar71xx.ipk

wget http://download.linino.org/linino_distro/lininoIO/latest/packages/ajtcl_1.0.1-1_ar71xx.ipk && opkg install ajtcl_1.0.1-1_ar71xx.ipk

wget http://download.linino.org/linino_distro/lininoIO/latest/packages/ajtcl-services_1.0.1-1_ar71xx.ipk && opkg install ajtcl-services_1.0.1-1_ar71xx.ipk

wget http://download.linino.org/linino_distro/lininoIO/latest/packages/ajtcl-alljoynjs_1.0.1-1_ar71xx.ipk && opkg install ajtcl-alljoynjs_1.0.1-1_ar71xx.ipk
```
