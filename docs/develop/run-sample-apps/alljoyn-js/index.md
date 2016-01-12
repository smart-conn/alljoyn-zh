# 运行一个脚本
在 AllJoyn.js 处于 [built][build_page] 时，你可以开始运行脚本。在 AllJoyn的文件夹中你会发现一个名为 "alljoynjs(.exe)" 的可执行文件。在运行
AllJoyn 二进制码之前，还需要设置一个环境变量。在 Linuux 上， LD_LIBRARY_PATH 告知 alljoynjs 在哪里可以搜索类似 libajtcl.so 的库。此库被放置
在本地 Thin Client 目录中。

[build_page]: /develop/building/alljoyn-js

```
export LD_LIBRARY_PATH=<path-to-libajtcl.so>
```

由于这是一个环境变量，你也可以在  .bashrc, .bashprofile, 或者类似的初始化文件中进行设置。

另一个选择是在你运行 alljoynjs 时在命令行中指定 LD_LIBRARY_PATH.

```
LD_LIBRARY_PATH=<path-to-libajtcl.so>; ./alljoynjs
```

#### 直接安装脚本

安装并运行脚本最快捷的方法就是将脚本作为一个参数提供给 alljoynjs(.exe). 可选的参数如下：

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

#### 通过控制台安装脚本

在 alljoyjs 中，LD_LIBRARY_PATH 需要被设置。不同于 libajtcl.so，他需要指向 liballjoyn.so 所在的位置。此库如果不是与控制台处于同样的目录，就
是处于 alljoyn git reposity 的构建目录中。Git repository 的地址是（针对 Linux x86 debug build）：

```
export LD_LIBRARY_PATH="<path-to-alljoyn-folder>/build/linux/x86/debug/dist/cpp/lib"
```

设置好之后控制台便可以运行。其中只有两个可选参数：

```
--name          A specific AllJoyn.js device you want to connect to

--debug         Start the console in debugger mode

<script>        The script to be installed (must be last parameter)

./ajs_console --name my_js my_script.js
```

在控制台窗口中你将会看到如下显示： (唯一标识符和会话 ID 会有所不同):

```
Found script console service: :sL2zNFpI.35
Joined session: 1744270397
```

到此为止，你可以开始与 AllJoyn.js 设备进行交互。这里支持“ Evals ”操作，传入设备可执行的 JavaScript 命令，随后返回结果:

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

不需要担心未定义的 eval 结果。这些结果意味着 “var i = 10” 没有返回值。控制台同时也支持实时 debugging，下文会有描述。
Don't worry about the undefined eval results. These mean the line
“var i = 10” had no return value. The console also supports real time debugging which
is covered below.


# Dashboard 应用程序
为了全面的使用 AllJoyn.js 所实现的服务，你可以使用一个叫做 Dashboard 的 Android 应用程序。Dashboard 会渲染一个控制面板，使用提醒以及已连接
的 AllJoyn(.js) 设备，并允许你编辑这些设备的配置值。Dashboard 可在以下网址获取：

[Google Play Store](https://play.google.com/store/apps/details?id=org.alljoyn.dashboard&hl=en)


# 调试 AllJoyn.js

到现在，你可能已经开始编写你自己的脚本了。AllJoyn.js 有 debug 功能，与 GDB 或者其他 debugger 类似。AllJoyn.js 控制台应用程序集成了一个命令 行 debugger. 同时也有一个基于 python 的有图形界面的 debugger (推荐使用)。

使用命令行 debugger 没有特殊的依赖。他与控制台应用程序一通搭建，可以立即使用。只需在运行控制台时加入“--debug” 标示。

```
./ajs_console --debug
```
控制台应该照常连接。你的脚本在控制台连接到 AllJoyn.js 目标时会立即被暂停，而不是直接执行。在此时你可以开始执行 debug 命令。为了方便区分，
所有的 Debug 命令都会加上前缀 “$”.下面的列表展示了所有 debug 命令：

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

如果你已经对 debug 原理以及/或者 GDB 很熟悉，你可以跳过此部分；如果不是，请继续阅读。



## Stepping

在你 debug 的过程中，最常用的命令将会是各种类型的“ step ”. Stepping 使你可以逐行越过代码。Debugger 有三种 step 命令：In, Out, 和 Over. 
"Stepping in" 有两种作用。如果你正位于一行有关函数的代码，此命令将带你进入函数。如果这一行不是函数，此命令则带你跳至下一行。"Step over" 
则会单纯地跳至下一行，不管这一行是否是函数。"Step out" 将把你带出目前的领域。例如，你正在一个函数当中，同时你执行了 step out，你将会被带到
函数被调用的那一行命令上。

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

在上面的例子中，你会由记号（1）的地方开始（第13行）。由此，step in 函数将会带你进入位于记号（2）的 main()函数中。随后你可调用 step over, 因而到达记号（3）。再次调用 step in 会把你带入记号（4）的 my_func() 的开始处。如果你决定在记号（4）使用 step over，余下的 my_func() 会执行，在 my_func() 被调用后，你会被安置在记号（5）处。


## Breakpoints

如果你想处理大规模的代码，逐行跳跃则变得乏味。如果你知道某个函数中存在 bug, 你不需要使用 step 来越过余下的代码。这就是 breakpoints 派上用场的地方。Breakpoint 是一个位于一行代码上的“标签”或者“记号”，在脚本执行到 breakpoint 时会暂停。使用 addbreak 命令可以添加 breakpoint.

```
$addbreak <file> <line>
```
File 参数是你脚本的名字，line 参数是你希望 breakpoint 被添加到的行数。每当你完成添加 breakpoint 你可以继续执行。如果那一行出现问题，
debugger 会自动停止在这一行。

使用 delbreak 命令可以删除 breakpoint.

```
$delbreak <index>
```

Breakpoint 指数（0 - N）指示着你定义 breakpoint 的顺序。例如，你添加的第一个 breakpoint 指数是 '0'，第二个的指数是 '1',等等。如果你删除一个
breakpoint 则所有高于被删除 breakpoint 指数的指数都会被调低，也就是说指数总是连续的。如果你有三个 breakpoint ('0', '1', and '2')，并且你删
除了 breakpoint '1'，则原来的 breakpoint '2' 会变为 '1'，原来的 breakpoint '0' 保持不变。

“$lb” 可以列出所有的 breakpoints. 如果你在添加和删除 breakpoints 之后不确定指数与 breakpoints 的对应关系，你可以调用此命令，并会得到如下的
结果：

```
$lb
Breakpoints:
File: print2.js, Line: 10   <-- Index 0
File: print2.js, Line: 20   <-- Index 1
File: print2.js, Line: 15   <-- Index 2
```

## Stack 追踪

在 debug 过程中你可能已经不知道程序执行到哪一行，这种情况发生时，知道自己身处程序的哪个位置变得很重要。 Stack 追踪功能可以列出你的近期位置
以及其他你曾改变过视野时的位置。依然使用之前的例子：

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

如果你正在遍历以上的脚本，并且停在了第四行，此时你执行'$bt'命令，会出现以下结果：

```
$bt
File: my_script.js, Function: my_func, Line: 4, PC: 3
File: my_script.js, Function: main, Line: 10, PC: 2
```

第一行结果指示你正位于 my_func() 函数内的第四行。第二行结果解释了 my_func()函数是在 main() 函数的第十行被调用的。此例仅仅是一个简单的 stack
追踪，在你使用更深层的函数时追踪也会更复杂。



## 变量函数

可以知道变量的值在寻找 bug 的过程中非常有帮助。截止到此，你可能不得不通过在运行时打印出变量来确定变量的值。现在有几个可以使你在 debug 过程
中就能看到变量值的函数。首先，你需要使用 $locals 命令来得到变量列表：

```
$locals
```

此命令会打印出你视野内的所有本地变量以及对应值。有一些类似对象或者指针的复杂数据类型可能没有特定的用处，因为他们只是代表着指向变量的指针；
但是诸如 numbers，strings 或者 buffers 的数据类型将会呈现给你变量的真实值。与 $locals 类似的是 $getvar 命令，他可以获取单独命名的变量值。两
者的主要区别就是 $getvar 既可以操作全局变量也可以操作和本地变量：

```
var glb1 = "I am a global";

function main() {
   var local = "I am a local";
   print('Im in main');
}

main();
```

在此例中，只能通过 $getvar 来查看 glb1 变量的值。

```
$getvar glb1
I am a global
```

与 $getvar 相对应的是 $putvar. $putvar 可以在 debug 过程中改变一个变量的值：

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

假设你停在了第四行，你可以使用 $putvar 来改变第五行中 print 命令的输出值：

```
$putvar s "changed "
$over
$over
PRINT: "changed another string"
```

如上面代码所示，运行结果将会是打印 “changed another string”，而不是打印 “a string another string”. 在你需要向函数传入不同值以观测结果时此，
命令将会派上用场。你可以直接使用 $putvar，而不需要一遍遍修改脚本重新运行。

## Eval

在 debug 时使用 Eval 与使用控制台 eval 的效果几乎相同。注意，如果你希望在使用 eval 的同时将 debug 功能发挥到最大，你必须使用 "$eval" 命令，
而不能使用标准的控制台 eval.使用 eval 的 debug 变形（"$eval"）可是使任何被 eval 执行的代码变为 debug 代码运行，这样你就可以进行添加 breakpoint 和设置变量等的操作。Debug 代码中的 Eval 在语意上没有不同，你只需要在你的 eval 字符串前加上 $eval 前缀。


```
$eval 1+1
2
```
在 debug 时使用 $eval 命令会非常有效率。使用 $eval 同样可以追踪和改变变量名，与 $getvar 和 $putvar 相同：

```
$eval i = 10; // equivalent to "$putvar i 10"
$eval i;      // equivalent to "$getvar i"
```

在 debug 时，你可以使用 $eval 来创建新变量，然后使用这些新变量与已经存在的本地或全局变量连接到一起。另一个用途是对象检查。由于 getvcar 不能
告诉你对象的元素，你可以使用 eval 来 stringify 和查看对象中的元素，同时也可以查看元素所包含的值。例如：

```
var object = {
   int_val:100,
   str_val:"string"
}
```

随后，你可以使用 eval 来观看对象的成员。

```
$eval print(JSON.stringify(object));
{"int_val":100,"str_val":"string"}
```

不仅如此，知道了此对象有 'int_val' 和 'str_val' 元素后，你可以使用 $eval 对他们进行查询.

```
$eval object.int_val
100
$eval object.str_val
"string"
```

甚至可以使用 Eval 在 debug 时执行一个函数。

```
$eval foo(bar);
<foo will then be executed>
```

命令行 debugger 非常实用，但是也比较原始。使用 GUI 可以一次性看到更丰富的信息，从而提供了更好的 debug 体验。控制台文本被彻底的描述，以更好
的描述 debugger 内部发生的事情。GUI debugger 也使用之前描述过的那些命令，但是输出结果会经过视觉上的排列整理，使得观看和操作变得更容易。


# Python GUI Debugger

假设你已经成功为自己的平台搭建了 Python debugger 扩展， 你可以开始对一个 AllJoyn.js 应用程序进行 debug. 首先要运行 debugger GUI，选择性地
指定一个 AllJoyn.js 设备名。在 Windows 上，请确认你的 PATH 环境变量包括如下所示的 Python 3.4 的目录：

```
python pydebugger.py --name my_ajs
python pydebugger.py
```

一旦连接了 AllJoyn.js 设备，GUI 中将会显示最近安装的脚本（如果存在的话）以及可使用的控制按钮。

![][DebuggerPicture]

[DebuggerPicture]: /files/develop/run-sample-apps/alljoyn-js/DebugGUIFull.png

1. 控制按钮在 GUI 的左侧。在这里你可以完成 single stepping, pause, resume, attach, detach, script install, 或者 closing the GUI 这些控制。

2. 这里是源码观察窗口，你可以看到正在设备上运行的 JavaScript 代码。在窗口的左边是行数。被红色高亮的行数代表此处有 breakpoint 插入。在本例中
设置了两个 breakpoints，分别位于第35行和第53行。你可以通过双击行号来设定 breakpoints. 黄色高亮行指示着 debugger 暂停的位置，既第46行。

3. 右上角的窗口包括所有的本地变量以及可供改变变量值的空间 (例如 $putvar 功能)。若要使用 $putvar 功能，必须先选择一个变量，将其高亮为黄色，
然后在 “PutVar” 按钮旁边的文本框内键入新的设定值。点击 “PutVar” 按钮将改变所选变量的值。

4. 这里是 breakview 试图。在这里你可以添加和删除 breakpoints. 若要添加 breakpoint，必须键入脚本名和行号的组合，随后点击 "Add Breakpoint" 按钮。若要删除 breakpoint，可以通过点击 breakpoint 将其高亮为黄色，然后按下 delete 键。也可以通过将 breakpoint 的指数键入 “Delete” 按钮上方
的文本框中，随后按下 “Delete” 按钮。

5. 这里是你的 stack 追踪试图。伴随你使用 step in 或者 step out 功能时这里会动态地变化。 你可以看到你目前所处的函数，行号，以及每一个 stack
窗口的 Program Counter （PC）.

6. 这里的框和按钮在 debug 的时候用来执行 $eval 命令。你可以在控制台文本框键入任何合法的 eval 字符串并点击 “Eval” 来执行。在控制台窗口中可以
看到命令的输出（参见下面第7条）。

7. 此窗口会展示任何在 debug 途中相关的信息。包括任何打印文本，AllJoyn 提醒服务发送的提醒以及 eval 结果。除此之外你还可以看到相关的 debug 状
态信息，例如 添加或删除 breakpoints. 窗口的左边是过滤器按钮，可以控制打印三种类型提醒的开关。


