# Audio Streaming

The AllJoyn&trade; Audio 服务架构是一种使用了 AllJoyn 架构，实现了设备从不同 Sinks 同步播放音频的全部功能。应用程序使用 Audio 服务架构能够发现附近的 Sinks，只需要一个命令，便可以让应用程序串流 （PCM data）播放所有加入的 Sinks 的音频。

## 概念和术语

### Sink 与 Source

有两个角色：
* Sink. 用于接收原始音频数据。
* Source. 用于发送原始音频数据。

## 工作方式
Audio Service 架构使用软件架构中的标准化接口将 PCM 数据转移到每一个设备中。当 PCM 数据通过 AllJoyn 信号被发送后，Source 会形成一个端到端的会话。连接所有希望发送音频的 Sink。它将会在每一个会话中发送一个包含音频数据块和时间戳的信号。时间戳用于提供一种简单的同步多个扬声器的功能。

在能够发送音频之前，Source 必须首先告知 Sink 它希望发送的音频的细节信息。Source 负责获取除 FIFO 大小以外每个 Sink 的容量。Source 随后会重新填满 FIFO 并且随着乐曲的播放，开始发送更多数据块的进程。

媒体和音量控制使用不同 AllJoyn Interface 功能控制不同的部分。举例说明，在 Sink 中的音量控制通过可读／写的 AllJoyn Property 控制当前音量，声音范围通过定义最大、最小和单位值的结构来表示。

除提供音频数据之外，Source 还能够提供音频元数据。举例说明，图表、专辑、艺术家和／或曲名。使用这些，如果可能的话，使得 Sink 能够显示内容。元数据是可选的，不强制 Source 应用程序使用。

## 了解更多

* [了解更多关于 Audio Streaming Interface Definition][audiostreaming-interface]
* [下载 SDK][download] 和 [build][build]
* [了解更多关于 APIs][api-guide]

[audiostreaming-interface]: /learn/base-services/audiostreaming/interface
[download]: https://allseenalliance.org/framework/download
[build]: /develop/building
[api-guide]: /develop/api-guide/audio-streaming
