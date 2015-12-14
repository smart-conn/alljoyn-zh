# Build From Source - Linux

## Build tools and libs

1. Open a terminal window and run the following command:

  ```sh
  $ sudo apt-get install build-essential libgtk2.0-dev
     libssl-dev xsltproc ia32-libs libxml2-dev libcap-dev
  ```
2. To create a 32-bit build of the AllJoyn&trade; framework
on a 64-bit operating system, install these required development libraries:
  ```sh
  $ sudo apt-get install gcc-multilib g++-multilib libc6-i386
     libc6-dev-i386 libssl-dev:i386 libxml2-dev:i386
  ```

**NOTE:** libssl-dev does not have multilib support.
If the 32-bit version of libssl-dev is installed, then the 64-bit version is
replaced with the 32-bit version. You can delete the 32-bit version of the
libraries and reinstall the 64-bit version if you wish to go back to 64-bit.
libssl-dev is not required if building AllJoyn with the CRYPTO=builtin option.

## Python v2.6/2.7

**NOTE:** Python v3.0 is not compatible and will cause errors.

1. Python is a common part of most Linux distributions. You can
determine whether Python is already installed on your system by
opening a terminal window and running the following command:
  ```sh
  $ which python
  ```

  If a path (e.g., /usr/bin/python) is returned, Python is already installed.

2. Otherwise, open a terminal window and run the following command:
  ```sh
  $ sudo apt-get install python
  ```

3. If this installation method does not give you the correct
version of Python, install the [required version](http://www.python.org/download/).

## SCons

[SCons](http://www.scons.org/) is a software construction tool
used to build the AllJoyn framework. SCons is a default package
on most Linux distributions.

Open a terminal window and run the following command:

```sh
$ sudo apt-get install scons
```

AllJoyn's builds are verified with SCons v2.3.

## OpenSSL (optional)

OpenSSL is an open-source toolkit for implementing secure network
communication and cryptographic functions. AllJoyn only uses the
cryptographic functions of OpenSSL.
It is recommended that you always use the [newest version of
OpenSSL](http://www.openssl.org/).

Open a terminal window and run the following command:

```sh
$ sudo apt-get install libssl-dev
```

## git

[Git](http://git-scm.com/) is a source code repository access tool. The AllJoyn
source code is stored in a set of [git projects](https://git.allseenalliance.org/cgit).

Open a terminal window and run the following command:

```sh
$ sudo apt-get install git-core
```

## Repo

Repo is a tool used to manage projects that consist of multiple
git projects. The AllJoyn source code is stored in a set of git
projects that can be cloned individually or as a group using
[Google's repo tool](http://source.android.com/source/version-control.html).
This tool is not required, but is highly recommended.

1. Open a terminal window and run the following command to install curl:

  ```sh
  $ sudo apt-get install curl
  ```

2. Navigate to your home directory and download repo by running
the following command:

  ```sh
  $ curl https://storage.googleapis.com/git-repo-downloads/repo >
  ~/bin/repo
  ```

3. Copy repo to /usr/local/bin and make it executable using the following commands:

  ```sh
  $ sudo cp repo /usr/local/bin
  $ sudo chmod a+x /usr/local/bin/repo
  ```

### Uncrustify

Uncrustify is a source code formatting tool used to maintain a consistent
coding style in the AllJoyn code base. It is not required to build AllJoyn,
but if you intend to contribute code changes to the AllJoyn project you should
configure and use the tool.

**NOTE:** Uncrustify v0.61 is required for AllJoyn v15.04 and
later. Earlier AllJoyn versions require uncrustify v0.57. Since the
existing AllJoyn code was formatted with a specific version of
uncrustify, using any other version of uncrustify can cause unexpected
build errors when not building with the WS=off option.

There are two ways to install Uncrustify.

* Download the source and then build and install Uncrustify:

  ```sh
   $ mkdir $HOME/uncrustify # for example
   $ cd $HOME/uncrustify
   $ git clone http://github.com/bengardner/uncrustify.git
   $ # or use
   $ #git clone git://uncrustify.git.sourceforge.net/gitroot/uncrustify/uncrustify
   $ cd uncrustify
   $ git checkout uncrustify-0.61
   $ # or for v0.57:
   $ #git checkout uncrustify-0.57
   $ ./configure
   $ sudo make install
  ```

**NOTE:** In some cases, Uncrustify has failed to build on more recent
Ubuntu versions. Try making the following change to get
Uncrustify to build:

  ```sh
   diff --git a/src/uncrustify.cpp b/src/uncrustify.cpp index 2635189..7aba76d 100644
   --- a/src/uncrustify.cpp
   +++ b/src/uncrustify.cpp
   @@ -32,6 +32,7 @@
   #ifdef HAVE_STRINGS_H
   #include <strings.h>	/* strcasecmp() */
   #endif
   +#include <unistd.h>

   /* Global data */
   struct cp_data cpd;
  ```

* Install the Uncrustify v0.57 package on Ubuntu:
   1. Go to: http://packages.ubuntu.com/precise/uncrustify.
   2. From the website, click in the "Download uncrustify"
   table to select your machine's architecture.
   3. From the page that opens after your selection, choose
   a mirror based on your location, and download the .deb package.
   4. Install the package using either of these two commands, as appropriate:

   ```sh
   $ sudo dpkg -i uncrustify_0.57-1_amdd64.deb
   $ sudo dpkg -i uncrustify_0.57-1_i386.deb
   ```
   Uncrustify v0.61 packages are not currently available.

## Doxygen

The [Doxygen tool](http://www.doxygen.org) builds HTML documentation from
source code. It is not required for building AllJoyn binaries.

Open a terminal window and run the following command:

```sh
$ sudo apt-get install doxygen
```

### Graphviz

The [Graphviz Dot tool](http://www.graphviz.org/) diagrams class hierarchies
and is used by doxygen.

Open a terminal window and run the following command:

```sh
$ sudo apt-get install graphviz
```

## TeX Live

[TeX Live](http://www.tug.org/texlive/) provides LaTeX binaries
and style sheets for Linux. This optional tool may be used to
produce AllJoyn's API documentation as a PDF document from
the source. It is possible to compile the AllJoyn framework
without producing the documentation.

Install TeX Live if you want to produce PDF documentation.

```sh
$ sudo apt-get install texlive
```

## Gecko SDK

The [Gecko SDK](https://developer.mozilla.org/en/Gecko_SDK) (aka XULRunner SDK)
is only required if you are building the AllJoyn JavaScript
plug-in. Otherwise, this section is optional.

The plug-in was developed against version 1.9.2 of the SDK,
although it may be possible to use an earlier version.
On 64-bit Linux, download the 32-bit version anyway (only
the headers in the SDK are used).

## Install Java

Java 6 or greater may be used to build the AllJoyn framework
on a Linux platform.

**IMPORTANT:** Using apt-get install java will download open-jdk not
sun-jdk. The AllJoyn framework requires sun-jdk.

Install Java using one of these two mechanisms.

#### Installing Java 6 when older than Ubuntu 12.04

1. Install Java 6

   ```sh
      $ sudo add-apt-repository "deb http://archive.ubuntu.com/ubuntu lucid partner"
      $ sudo apt-get update
      $ sudo apt-get install sun-java6-jdk
   ```

2. Install junit 3.8 or newer (junit is required when building
the AllJoyn Java bindings).
   1. Navigate to (https://github.com/junit-team/junit/wiki/Download-and-Install).
   2. Download the jar file "junit-4.9.jar".
   3. Copy it to usr/share/java/junit-4.9 from the Downloads folder:

      ```sh
         $ sudo cp junit-4.9.jar /usr/share/java/
      ```

3. If you want to run junit tests, install the Apache Ant build
tool (only required to run junit tests, not required to build the
AllJoyn framework).

   ```sh
      $ sudo apt-get install ant
   ```

#### Installing Java 6 when using Ubuntu 12.04 or newer

With the Ubuntu 12.04 Precise Pangolin release, partner
repositories are no longer available. You must manually
install Java using the following instructions:

1. Download the JDK bin file corresponding to your cpu type
(x86 or x64) from Java SE 6u32 Downloads.

2. Use chmod to make the file executable:

   ```sh
      $ chmod +x jdk-6u32-linux-x64.bin
   ```

3. Extract the bin file:

   ```sh
      $ ./jdk-6u32-linux-x64.bin
   ```

4. Move extracted folder to /usr/lib/jvm/:

   ```sh
      $ sudo mv jdk1.6.0_32 /usr/lib/jvm/
   ```

5. Add the newly installed Java to the list of alternatives:

   ```sh
      $ sudo update-alternatives --install /usr/bin/javac javac
      /usr/lib/jvm/jdk1.6.0_32/bin/javac 2
      $ sudo update-alternatives --install /usr/bin/java java
      /usr/lib/jvm/jdk1.6.0_32/bin/java 2
      $ sudo update-alternatives --install /usr/bin/javaws javaws
      /usr/lib/jvm/jdk1.6.0_32/bin/javaws 2
   ```

6. Choose default Java:

   ```sh
      $ sudo update-alternatives --config javac
      $ sudo update-alternatives --config java
      $ sudo update-alternatives --config javaws
   ```

7. Check Java version to verify it is installed correctly:

   ```sh
      $ java -version
   ```

   It should return something similar to:

   ```sh
      java version "1.6.0_26"
      Java(TM) SE Runtime Environment (build 1.6.0_26-b03)
      Java HotSpot(TM) 64-Bit Server VM (build 20.1-b02, mixed mode)
   ```

8. Verify the symlinks all point to the new Java location:

   ```sh
      $ ls -la /etc/alternatives/java*
   ```

9. (Optional, but recommended) Enable Java plug-in for Mozilla
Firefox (even for Chrome).

   * For 64-bit jdk:

      ```sh
         $ sudo update-alternatives --install \
         /usr/lib/mozilla/plugins/libjavaplugin.so mozilla-javaplugin.so \
         /usr/lib/jvm/jdk1.6.0_32/jre/lib/amd64/libnpjp2.so 2
         $ sudo update-alternatives --config mozilla-javaplugin.so
      ```

   * For 32-bit jdk

      ```sh
         $ sudo update-alternatives --install \
         /usr/lib/mozilla/plugins/libjavaplugin.so mozilla-javaplugin.so \
         /usr/lib/jvm/jdk1.6.0_32/jre/lib/i386/libnpjp2.so 2
         $ sudo update-alternatives --config mozilla-javaplugin.so
      ```

   Test the Java web plug-in by going to http://www.java.com/en/download/testjava.jsp.

10.  Install junit 3.8 or newer (junit is required when building
the AllJoyn Java bindings).
   1. Navigate to https://github.com/junit-team/junit/wiki/Download-and-Install.
   2. Download the jar file "junit-4.9.jar" and copy it to
   usr/share/java/junit-4.9 from the Downloads folder:

   ```sh
      $ sudo cp junit-4.9.jar /usr/share/java/
   ```

11. If you want to run junit tests, install the Apache Ant build
tool (only required to run junit tests, not required to build
the AllJoyn framework).

   ```sh
      $ sudo apt-get install ant
   ```

## googletest

Google Test is Google's framework for writing C++ tests.
Google Test is an xUnit testing architecture used by the
AllJoyn framework to test its C++ APIs. Google Test is optional,
but is required for building the C++ unit tests.

1. Open a browser and navigate to http://code.google.com/p/googletest/downloads/list.
2. From the googletest download page, download gtest-1.7.0.zip.
3. Unzip the contents of gtest-1.7.0.zip to a known location
(e.g., $HOME/gtest/gtest-1.7.0).

**IMPORTANT:** Do not use apt-get install libgtest-dev. Download
the source code from code.google.com.

## Obtain the AllJoyn source

```sh
$ cd $HOME
$ export AJ_ROOT = `pwd`/alljoyn # for example
$ git clone https://git.allseenalliance.org/gerrit/core/alljoyn.git

$AJ_ROOT/core/alljoyn
```

## Building the AllJoyn Framework

Use the following commands to build the AllJoyn framework for Linux.

```sh
$ export JAVA_HOME="/usr/lib/jvm/java-6-sun" # or java-1.5.0-sun
$ export CLASSPATH="/usr/share/java/junit4.9.jar" # for building Java binding
$ export GECKO_BASE=~/xulrunner-sdk # for building Javascript binding
$ cd $AJ ROOT/core/alljoyn
```

For 32-bit:

```sh
$ scons BINDINGS=<comma separated list(cpp,java,c,js)>

   ex) $ scons BINDINGS="cpp,java"
```

For 64-bit:

```sh
$ scons CPU=x86_64 BINDINGS=<comma separated list (cpp,java,c,js)>

   ex) $ scons CPU=x86_64 BINDINGS="cpp,java"
```

**NOTE:** For a full list of SCons command line options to build
the AllJoyn framework, enter `scons -h`.

**NOTE:** Use the SCons variable `BINDINGS` to list the language
bindings for which you would like to build. To limit the build
to just C++, for example, use BINDINGS=cpp. Use a comma-separated
list for multiple bindings. For example, to build for Java and
C++, use  BINDINGS=java,cpp.

**NOTES**

* The path specified for the CLASSPATH environment variable
is the full path name to the junit jar file that was downloaded earlier.
* The path specified for the JAVA HOME environment variable
is the path to the jdk directory.
* For building Javascript on both Linux and Windows, we need
the GECKO_BASE while building the AllJoyn framework.
* If you are building a version older than AllJoyn framework
2.6, CPU=x86-64 will be required to build a 64-bit version of the AllJoyn framework.

### Possible build errors

`" ImportError: No module named argparse"` reported when reading
`"File "../build_core/tools/bin/whitespace.py", line 18".`
Python does not have the argparse module installed (versions of
python 2.7.1 or newer have it installed by default).

```sh
$ sudo apt-get install python-setuptools
$ sudo easy_install argparse
```

## Build the API documentation

By default, the AllJoyn API documentation is not built during
the build stage (except for Java Docs). To build the API
documentation use the following commands:

```sh
$ scons DOCS=html
$ scons DOCS=pdf
```

The documentation will be placed in <workspace>/alljoyn_core/docs/html
or <workspace>/alljoyn_core/docs/latex.

* Open <workspace>/alljoyn_core/docs/html/index.html in a web
browser to view the documentation.
* Open <workspace>/alljoyn_core/docs/refman.pdf in a PDF viewer
to view the PDF documentation.

### Whitespace policy checker

By default, the whitespace policy checker does not run. If you are
contributing changes to AllJoyn, you should run your builds with the
whitespace checker enabled:

```sh
$ scons WS=check
```

If the whitespace policy checker reports a whitespace policy
violation, it lists which files have the violation. To see the
lines of code that are violating the AllJoyn whitespace policy, run:

```sh
$ scons WS=detail
```

Uncrustify can automatically fix your files to adhere to the whitespace policy.

```sh
$ scons WS=fix
```

### Build variant

By default, the AllJoyn framework builds the debug variant. To build
the release version of the AllJoyn framework, use this:

```sh
$ scons VARIANT=release
```

## Bindings option

The default SCons script tries to build all of the language bindings
by default. If you are only interested in a particular language binding,
the `BINDINGS` option can be used to select the language(s) of interest.

The `BINDINGS` option takes a comma-separated list of languages you
wish to build. Current valid languages are cpp, c, java, and js. The language is
always specified in all lower case with no extra spaces between languages. If a
dependency is not listed, the dependency will automatically be built. For
example, java requires that cpp is built. If an empty string is used only the
core files will be built.

For example:

```sh
$ scons BINDINGS=java #this will build core files and Java language bindings
$ scons BINDINGS=c,java #this will build C language bindings and Java language bindings
$ scons BINDINGS= #only build the core files alljoyn_core and common
```

## Crypto option

AllJoyn v15.04 adds a CRYPTO option to the scons command line. To build AllJoyn
without dependencies on OpenSSL libcrypto, use CRYPTO=builtin:

```sh
$ scons CRYPTO=builtin
```

To use crypto implementations in OpenSSL:

```sh
$ scons CRYPTO=openssl
```


## PolicyDB option

AllJoyn v14.06 provides functionality that
can be compiled into AllJoyn routers that acts as firewall/filter
for delivering messages. The POLICYDB option controls whether this
functionality is included or not. It can be set to either on or off.

The default policy rules are for the AllJoyn router to behave as
though PolicyDB is excluded. The default is to not include PolicyDB.

Example:

```sh
$ scons POLICYDB=on
```

## Build C++ unit tests

The AllJoyn framework now includes a set of unit tests that
are built using the Google Test C++ framework. To build the
unit test, the location of the Google Test source code must
be specified as explained in googletest. Use the GTEST_DIR
option to specify the location of the Google Test source code.

Example:

```sh
$ scons GTEST_DIR=$HOME/gtest/gtest-1.7.0
```

## Running the AllJoyn Applications


**NOTE:** For v2.6 and onward, Bundled Router mode only.

To ensure that the Linux development platform is set up
correctly, use the instructions in this section to run
the AllJoyn router.

With the release of AllJoyn v2.6, running a separate standalone
router (alljoyn-daemon) is no longer required. All of the
functionality of the router can now be built into each individual
application, which means:

* Users of your program no longer need to install and run a
background service (daemon) to run a program that uses the AllJoyn framework.
* Each application that you run will have its own built-in router.

1. On the command line, type the following commands to run
the AllJoyn application:

   ```sh
      $ cd <workspace>/build/{OS}/{CPU}/{VARIANT}/dist/cpp/bin
      {OS} = linux
      {CPU} = x86 or x86-64
      {VARIANT} = debug or release
      $	./bbservice -n com.test
   ```

2. Open another tab and type the following commands to run
another application:

   ```sh
      $ cd <workspace>/build/{OS}/{CPU}/{VARIANT}/dist/cpp/bin
      $	./bbclient -n com.test -d
   ```

3. Check for the following output on bbclient:

   ```sh
      Sending "Ping String 1" to org.alljoyn.alljoyn_test.my_ping synchronously
         org.alljoyn.alljoyn_test.my_ping ( path=/org/alljoyn/alljoyn_test ) returned
         "Ping String 1"
   ```

## AllJoyn router command line executable

**NOTE:** Applies only to versions before 2.6.

The concept of bundling a router with the application was
introduced in v2.6. Prior to this version, to run any AllJoyn
application, you needed to run the alljoyn-daemon first.

As part of the build process, an executable for the alljoyn-daemon is built.

1. On the command line, type the following commands to run
the AllJoyn router as a separate process:

   ```sh
      $ cd <workspace>/build/{OS}/{CPU}/{VARIANT}/dist/cpp/bin
      $ ./alljoyn-daemon --internal
   ```
   The options for the variables are as follows:

   {OS} = linux
   {CPU} = x86 or x86-64
   {VARIANT} = debug or release

   This starts the AllJoyn router with a built-in default
   configuration. For most users the command listed is sufficient
   to run the AllJoyn framework.

2. Press **Ctrl-c** at any time to stop the alljoyn-daemon process.
3. To display other options, type the following:

   ```sh
      $ ./alljoyn-daemon -h

      alljoyn-daemon [--config-file=FILE] [--print-address]
      [--verbosity=LEVEL] [--no-bt] [--version]

         --config-file=FILE
            Use the specified configuration file.

         --print-address
            Print the socket address to STDOUT.

         --no-bt
            Disable the Bluetooth transport (override config file setting).

         --verbosity=LEVEL
            Set the logging level to LEVEL.

         --version
            Print the version and copyright string, and exit.
   ```

For examples of different configuration files, see examples in:

```sh
<workspace>/alljoyn_core/daemon/test/conf.
```

**NOTE:** Not all configuration files found in the daemon/test/conf
directory are valid for use on a computer running Linux.

### Verify that the router is running

Navigate to the projects samples directory and run the service
and the client as follows:

```sh
$ cd <workspace>/build/{OS}/{CPU}/{VARIANT}/dist/cpp/bin/samples
$ ./basic_service & #this will be a background process; it could be run on its own command-line
$ ./basic_client
```

When the client runs, the following will display:

```
AllJoyn Library version: v2.6.0
AllJoyn Library build info: Alljoyn Library v2.6.0
   (Built Wed Sep 02 23:30:23 UTC 2012
Interface Created. BusAttachment started.
BusAttachment connected to unix:abstract=alljoyn
BusListener Registered.
FoundAdvertisedName(name=org.alljoyn.Bus.sample,
prefix=org.alljoyn.Bus.sample)
JoinSession SUCCESS (Session id=-1126874739)
org.alljoyn.Bus.sample.cat ( path=/sample) returned "Hello World!"
basic client exiting with status 0 (ER_OK)
```

## Running Unit Tests

**NOTE:** The following instructions are valid only for the AllJoyn
framework version 2.6 and newer.

### Running C++ unit tests

If the `GTEST_DIR` option was specified when building the code,
the C++ unit tests will automatically be built and placed in
the following location:

```sh
<workspace>/build/{OS}/{CPU}/{VARIANT}/test/cpp/bin.
```

There will be two executable files there: ajtest and cmtest.

#### cmtest

The cmtest executable tests the code from the common project
and does not require the AllJoyn router to be running.
Run cmtest as follows:

```sh
<workspace>/build/{OS}/{CPU}/{VARIANT}/test/cpp/bin/cmtest
```

#### ajtest

The ajtest executable tests the code found in alljoyn_core.
For the tests to run successfully, an AllJoyn router must
also be running. Currently, ajtest is limited; it cannot test
bus-to-bus (i.e., device-to-device) communication.
Run ajtest as follows:

1. Start the alljoyn-daemon (optional-see note below):

   ```sh
      <workspace>/build/{OS}/{CPU}/{VARIANT}/dist/cpp/bin/alljoyn-daemon --internal
   ```

2. Run ajtest.

   ```sh
      <workspace>/build/{OS}/{CPU}/{VARIANT}/test/cpp/bin/ajtest
   ```

For all paths, replace {OS}, {CPU}, and {VARIANT} with the
actual value used when the code was built (i.e., use the same OS,
CPU, and VARIANT option specified when running SCons).

**NOTE:** If the code was built using the bundled router
(i.e., SCons flag BR=on), then ajtest can be run without
first starting the separate alljoyn-daemon.

### Running the Java junit tests

The junit tests are always built at the same time as the Java
bindings. The junit tests are specifically designed to test the
Java bindings.

1. From the top build folder, use ant to start the test.

   ```sh
      ant test -DOS={OS} -DCPU={CPU} -DVARIANT={VARIANT}
   ```

2. Find the HTML version of the results in the following location:

   ```sh
      <workspace>/build/{OS}/{CPU}/{VARIANT}/test/java/reports/junit/
   ```

   For all paths and commands, replace {OS}, {CPU}, and {VARIANT}
   with the actual value used when the code was built (i.e., use
   the same OS, CPU, and VARIANT option specified when running SCons).

## Miscellaneous

### Library liballjoyn.so not found

If the following error is returned:

```
error while loading shared libraries: liballjoyn.so:
cannot open shared object file: No such file or directory
```

The SCons scripts build a shared library and link
against that shared library. Add the library to the link path.

```sh
$ export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:<workspace>/build/{OS}/{CPU}/
   {VARIANT}/dist/cpp/lib
```

After adding the library LD_LIBRARY_PATH re-run the program
that produced the error.

### Additional projects

The AllJoyn source code has other projects, such as alljoyn_js
(javascript), and alljoyn_c (C bindings). These bindings are supported from
version 2.6 onward. The build instructions for these projects are outside the
scope of this section. For more information, see https://allseenalliance.org.
