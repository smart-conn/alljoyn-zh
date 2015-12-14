# Audio Streaming

The AllJoyn&trade; Audio service framework is a full-feature implementation
using the AllJoyn framework that allows for synchronized audio playback on
one or many Sinks. An application using the Audio service framework can
discover nearby Sinks and by adding them have the ability to stream audio
(PCM data) by calling a single command to play on all added Sinks. The
service provides controls to pause, stop, play, volume up/down, and mute.

## Concepts and Terminology

### Sink and Source

Two roles exist:
* Sink. This is who receives the raw audio data.
* Source. This is who sends the raw audio data.

## How Does It Work?

The Audio Service framework uses the interfaces standardized in this
software framework in order to move PCM data to each device. When PCM
data is sent is is done so via an AllJoyn Signal. The Source will form
a point-to-point session with each Sink that it wishes to send audio.
It will then send a Signal on each session that includes the audio
data chunk and a timestamp. The timestamp is used to provide an simple
synchronization between the multiple speakers.

Prior to being able to send audio, a Source must first tell the Sink
the details of the audio that it wishes to send. The Source is
responsible for requesting the capabilities of each Sink in addition
to the FIFO size. The Source then prefills the FIFO and starts the
process of sending more data chunks as the song plays.

When media and volume controls are used the function on a separate
AllJoyn Interface for each respective part. For example, volume control
on a Sink specifies the current volume via an AllJoyn Property that is
read/write and a volume range represented by a structure that defines
the max, min, and step values.

In addition to providing the audio data a Source can provide the audio
metadata. For example the icon, album, artist, and/or track name.
Doing this allows for a Sink, if capable, to display the content.
The metadata is optional and not mandatory to a Source application.

## Learn More

* [Learn more about the Audio Streaming Interface Definition][audiostreaming-interface]
* [Download the SDK][download] and [build][build]
* [Learn more about the APIs][api-guide]

[audiostreaming-interface]: /learn/base-services/audiostreaming/interface
[download]: https://allseenalliance.org/framework/download
[build]: /develop/building
[api-guide]: /develop/api-guide/audio-streaming
