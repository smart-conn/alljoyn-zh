# Running a script
Once AllJoyn.js is [built][build_page] you can begin running scripts. You should
have an executable in the alljoyn-js folder named "alljoynjs(.exe)". Before running
the alljoynjs binary another environment variable needs to be set. On Linux, LD_LIBRARY_PATH
tells alljoynjs where to search for libraries like libajtcl.so. This library is located in the
local Thin Client dicectory the library was built in.

[build_page]: /develop/building/alljoyn-js

```
export LD_LIBRARY_PATH=<path-to-libajtcl.so>
```

Since this is an environment variable you may also set it in .bashrc, .bashprofile file, or
similar initialization files.

Another option is to specify LD_LIBRARY_PATH in the command line when you run alljoynjs:

```
LD_LIBRARY_PATH=<path-to-libajtcl.so>; ./alljoynjs
```

#### Directly installing a script

The quickest way to install and run a script is to directly supply the script
as a parameter to alljoynjs(.exe). The optional parameters are:

```
--name          Set the device name for the AllJoyn.js instance

--nvram-file    Specify an NVRAM file to be used (useful if running multiple instances
                from the same directory)

--log-file      Specify a log file to be used (Linux only)

--daemon        Run in daemon mode (background, Linux only)

--debug         Print debug logs

<script>        The script to be run (must be last parameter)

./alljoynjs --name my_js --nvarm-file ajtcl.nvram --log-file log.txt --daemon my_script.js
```

#### Installing a script via the Console

As with alljoynjs, LD_LIBRARY_PATH will need to be set. Instead of libajtcl.so it
needs to point to the location of liballjoyn.so . The library will either be in the same directory
as the console itself or in the build directory of the alljoyn git repository. The
full path in the git repository is (for a Linux x86 debug build) is:

```
export LD_LIBRARY_PATH="<path-to-alljoyn-folder>/build/linux/x86/debug/dist/cpp/lib"
```

Once that is set the console can be run. There are just two optional parameters allowed:

```
--name          A specific AllJoyn.js device you want to connect to

--debug         Start the console in debugger mode

<script>        The script to be installed (must be last parameter)

./ajs_console --name my_js my_script.js
```

In the console window you will see this (where unique name and session ID are different):

```
Found script console service: :sL2zNFpI.35
Joined session: 1744270397
```

At this point you can start interacting with the AllJoyn.js device. Basic usage
allows for “Evals” which are simple lines of JavaScript that the AllJoyn.js device
will execute and then return the result

```
var i = 10;
Eval: var i = 10;
Eval result=0: undefined
var j = 20;
Eval: var j = 20;
Eval result=0: undefined
i + j
Eval: i + j;
Eval result=0: 30
```

Don't worry about the undefined eval results. These mean the line
“var i = 10” had no return value. The console also supports real time debugging which
is covered below.


# Dashboard Application
In order to take full advantage of the services that AllJoyn.js implements you
can use an Android application called Dashboard. Dashboard will render a control panel,
consume notifications, on-board AllJoyn(.js) devices, and allow you to edit config
values of those devices. Dashboard can be found in the
[Google Play Store](https://play.google.com/store/apps/details?id=org.alljoyn.dashboard&hl=en)


# Debugging AllJoyn.js
Now that you have AllJoyn.js running you've probably started writing your own scripts.
AllJoyn.js has the capabilities to debug your program, similar to GDB or other debuggers.
A command line debugger is bundled with the AllJoyn.js console application.
There is also a Python based GUI debugger (recommended).

To use the command line debugger there are no special dependencies. It builds with
the console application out of the box. To use it you simply run the console with
the flag “-–debug”.

```
./ajs_console --debug
```

You should see the console connect as usual. Instead of your script immediately
executing it will be paused as soon as the console connects to the AllJoyn.js
target. At this point you can begin to execute debug commands. Debug commands are
all prefixed with “$” to separate them from regular console commands like Eval.
Below is a list of all the debug commands:

```
$in                      // Step in
$out                     // Step out
$over                    // Step over
$pause                   // Pause execution
$resume                  // Resume execution
$addbreak <file> <line>  // Add a breakpoint
$delbreak <index>        // Delete a breakpoint
$lb                      // List all breakpoints
$locals                  // List all local variables
$bt                      // See your stack trace
$getvar <name>           // See a variable and its value
$putvar <name> <value>   // Change a variables value
$getscript               // See the current script
$eval <command>          // Do an eval while debugging
$attach                  // Attach to an AllJoyn.js target
$detach                  // Disconnect the debugger
```

If you're already familiar with debugging principles and/or GDB then you can continue
on to the next section; otherwise, read on!


## Stepping

While you are debugging the most common commands will be some form of a "step". Stepping
allows you to walk over your code line by line. Debuggers have three step commands:
In, Out, and Over. "Stepping in" can have two effects. If the line you're on is a
function you will be taken into that function. If it is not you will simply step to the
next line. "Step over" simply steps to the next line of code, no matter what the
current line does. "Step out" will take you out of the current scope. For
example, if you are in a function and you execute step out, you will be brought up
to the line where that function was called.

```
1.  function my_func() {
2.      var s = 'a string';       <-- (4)
3.      var t = 'another string';
4.      print('In my_func()');
5.      print(s + t);
6.  }
7.
8.  function main() {
9.      print('In main()');  <-- (2)
10.     my_func();           <-- (3)
11. }                        <-- (5)
12.
13. main();    <--- (1)
```

In the example above you would start at the marker labeled (1) or line 13. From
here stepping in would take you into main() at marker (2). You could then step
over, arriving at (3). Stepping in again would take you to the start of my_func()
at marker (4). If you decided to step out from (4) the remainder of my_func() would
execute and you would step to after my_func() was called, or marker (5).


## Breakpoints

Single stepping becomes tedious if you need to cover large sections of code. You
may know that you have a bug in a specific function and don't need to step through
the rest of your script. This is where breakpoints become useful. A breakpoint
is a “tag” or “marker” on a line of code that halts execution when the script
execution reaches that point. To add a breakpoint using the text console you will
use the addbreak command.

```
$addbreak <file> <line>
```

The file parameter is the name of your script and the line is the line number
you wish to add the breakpoint to. Once you have added a breakpoint you can resume
execution. If that line gets hit the debugger will automatically pause at that line.

To delete a breakpoint use the delbreak command.

```
$delbreak <index>
```

The breakpoint indexes (0 - N) are assigned in the order you defined the breakpoints. For
example, the first breakpoint you add is index '0', the second is '1', etc. If you
delete a breakpoint all higher indexes are shifted down, meaning you will never have a
gap in indexes. If you have three breakpoint ('0', '1', and '2') and you delete breakpoint '1',
the breakpoint that was '2' will now be '1', and breakpoint '0' will remain the same.

The “$lb” command will list breakpoints. If you have added and removed
breakpoints and are not sure what indexes correspond to breakpoints simply execute
$lb and you will be shown all current breakpoints.

```
$lb
Breakpoints:
File: print2.js, Line: 10   <-- Index 0
File: print2.js, Line: 20   <-- Index 1
File: print2.js, Line: 15   <-- Index 2
```

## Stack Trace

During debugging you may have lost track of where you are in the program's execution,
when this happens it will be important to see where in the program you are. The stack
trace will list your current position and all other points in
time where your scope has changed. Take the previous example:

```
1.  function my_func() {
2.      var s = 'a string';
3.      var t = 'another string';
4.      print('In my_func()');     <-- You are here
5.      print(s + t);
6.  }
7.
8.  function main() {
9.      print('In main()');
10.     my_func();
11. }
12.
13. main();
```

If you are stepping through the above script and you stop at line 4
and execute '$bt' you will be presented with:

```
$bt
File: my_script.js, Function: my_func, Line: 4, PC: 3
File: my_script.js, Function: main, Line: 10, PC: 2
```

You are currently at line 4 in my_func(). The second line shows
how my_func() was called in main() at line 10.
This is just a simple stack trace but as you get deeper and deeper into functions
the trace will grow.


## Variable Functions

Being able to see the value of variables is quite useful for finding a bug in your
script. Up until now you have probably had to print out variables in question to
determine their values at run time. There are several debugging functions that allow
you to see variable values during debugging. First you will need to get a list of
variables using $locals:

```
$locals
```

This prints out all the local variables and their values in your current
scope. Some complex data types like objects or pointers may not be particularly
useful because they will show the C pointer to that variable; however, types
such as numbers, strings, or buffers will show you the real value those variables contain.
Similar to $locals is $getvar which gets the single named variable value.
The key difference is that $getvar works on both global and local
variables:

```
var glb1 = "I am a global";

function main() {
   var local = "I am a local";
   print('Im in main');
}

main();
```

In this example the only way to see the value of glb1 is to use $getvar:

```
$getvar glb1
I am a global
```

The counterpart to $getvar is $putvar. It allows you to change the value of a
variable while debugging:

```
1.  function my_func() {
2.      var s = 'a string ';
3.      var t = 'another string';
4.      print('In my_func()');     <-- You are here
5.      print(s + t);
6.  }
7.
8.  function main() {
9.      print('In main()');
10.     my_func();
11. }
12.
13. main();
```

Assuming you are paused at line 4, you can use $putvar to change the output of the print
statement on line 5.

```
$putvar s "changed "
$over
$over
PRINT: "changed another string"
```

Instead of printing “a string another string” it prints “changed another string”.
This can be very useful if you want to pass in different values into
a function and see the result. Instead of having to change the script and re-run
it repeatedly you can use $putvar.

## Eval

Using Eval while debugging behaves almost identically as using console eval. Note
that if you want to take advantage of any debugging features while using Eval,
you must use "$eval" and cannot use the standard console eval. Using the debugging
variant of Eval ("$eval") allows any code executed by Eval to be run as debug code,
allowing you to do things like hit breakpoints and set variables. Eval in the context
of debugging is syntactically the same, you just need to prefix your eval
string with $eval.

```
$eval 1+1
2
```

Using $eval while debugging is very powerful. It is possible to use $eval to
change and retrieve variable names just like $getvar and $putvar:

```
$eval i = 10; // equivalent to "$putvar i 10"
$eval i;      // equivalent to "$getvar i"
```

You can use $eval to create new variables while you are debugging, then use those
new variables in conjunction with locals or globals that already exist in your script.
Object inspection is another use. Since getvar does not give you an object's
elements you can use eval to stringify and view the elements of an object, as well as
the values contained in the elements. For example:

```
var object = {
   int_val:100,
   str_val:"string"
}
```

You can then use eval to view the members of that object:

```
$eval print(JSON.stringify(object));
{"int_val":100,"str_val":"string"}
```

Further, knowing that the object has elements 'int_val' and 'str_val' you can
interrogate them using $eval.

```
$eval object.int_val
100
$eval object.str_val
"string"
```

Eval can even be used to execute a function while debugging

```
$eval foo(bar);
<foo will then be executed>
```

The command line debugger is useful but primitive. The GUI allows
much more information to be seen at once, which provides a better debugging
experience. The text console was described in depth because it
better illustrates what is happening within
the debugger. The GUI debugger executes the same commands that were just described, but the output
is visually organized to be more easily viewed and manipulated. The GUI debugger
has some extra dependencies.

# Python GUI Debugger

Provided you have sucessfully built the Python debugger extension for your platform,
you can begin debugging an AllJoyn.js application. Begin by starting the debugger GUI,
optionally specifying an AllJoyn.js device name. On Windows, make sure your PATH
environment variable has the Python 3.4 directory listed first.

```
python pydebugger.py --name my_ajs
python pydebugger.py
```

Once connected to the AllJoyn.js device, the GUI will display the currently
installed script (if one exists) as well as the available control buttons.

![][DebuggerPicture]

[DebuggerPicture]: /files/develop/run-sample-apps/alljoyn-js/DebugGUIFull.png

1. The control buttons are along the left side of the GUI. This is how functions
like single stepping, pause, resume, attach, detach, script install, or
closing the GUI are controlled.

2. This is the source viewer window where you see the JavaScript code that is
running on the device. Along the left side of this window are
the line numbers. Line numbers highlighted in red have indicate that a breakpoint
has been set there. In this case there are two breakpoints set, one at line 35
and the other at line 53. You can set breakpoints in this window by double clicking
the line number. The line the debugger is
paused on is highlighted in yellow. Here we are paused at line 46.

3. The top right window contains all local variables as well as a space to change
the values of the locals (i.e. $putvar functionality). To use the $putvar
functionality you must select a variable, highlighting it yellow, and then type
the desired value in the text box next to the "PutVar" button. Clicking "PutVar"
will change the selected variables value.

4. This is the breakpoint view. Here you can add and delete breakpoints.
To add a breakpoint you must type the script name followed by the line number
then press the "Add Breakpoint" button.
To delete a breakpoint you can either click the breakpoint (highlighting
it yellow) and press the delete key or type the breakpoint's index into the text box above
"Delete" and press the "Delete" button.

5. Here is your stack trace viewer. It will dynamically change as you step in or
out of functions. You can see the current function you're in, the line number, and
the Program Counter (PC) for each stack window.

6. This box and button are for executing $eval while debugging. You can do everything
that is available in the text console by typing in the eval string and clicking
"Eval". You will see the output in the console window (see 7 below).

7. This window displays any relevant information as you are debugging. It will show
any printed text, notifications from the AllJoyn notification service, and eval results.
You can also see relevant debug state information, like breakpoints being added or deleted.
To the left of this window are filter buttons which turn on or off printing of the three
notification types.
