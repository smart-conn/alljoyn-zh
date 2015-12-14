# Audio Streaming API Guide

* [C++][audio-streaming-cpp]

[audio-streaming-cpp]: /develop/api-guide/audio-streaming/cpp

## Best Practices

### Sending audio data

The audio source should not use session ID 0 to broadcast the
Data signal; it should send Data signals on each AudioSink's session.

**NOTE:** Care should be taken when specifying the amount of data
to send in each signal so as not to interrupt the delivery of
audio data.

### Clock synchronization

The maximum error of the clock synchronization algorithm defined
in the [Audio Interface Definition][audio-interface-definition]
is the value used in the AdjustTime step. The algorithm may be
repeated to bind the maximum error.

### UI considerations

#### Button to list Sinks in proximity

To provide the best experience for a consumer using an application
that allows for streaming audio to applications/devices running
the Audio service framework, configure the application to let
the consumer select the Sinks to stream to. It is entirely
possible to play audio on any Sink found, but this may not
be the best option for a user.

The Android sample includes a button that a user can select
to list nearby Sinks. These Sinks can be selected/deselected
as desired by the user. The list is populated via the `SinkFound`
callback. The button should only appear if there is a Sink in proximity.

The appearance of a button allows the user of the application
to recognize that the application supports the Audio service framework.

#### Button to refresh list of Sinks

There are times, due to UDP propagation delays, when a Sink
is not displayed right away. Providing the user with a button
to refresh the list is an easy way to empower the user with
the ability to start searching for Sinks again.

When the Refresh button is pressed, make a call into your
SinkSearcher object to call the `Refresh()` method. When doing
this, the list that is displayed should be cleared and, as
the SinkSearcher responds with SinkFound callbacks, the list
is populated again.

Refer to the Audio service framework APIs for more information
about `SinkSearcher::Refresh()`.

### When to add a Sink

While it's possible to place the AddSink call when a Sink
is found, it is not recommended. A button should be present
to let the consumer control where the audio from the device is being sent.

### Handle losing a Sink

If a SinkLost callback occurs and audio is not being played,
remove the line item representing the lost Sink. There is no
reason to alert a consumer, and it does not impact the user experience.

If audio is being played on a single Sink and SinkLost or
SinkRemoved occurs, a pop-up should appear that gives the user
the option to continue playing locally or refresh to find other
sinks. See [When to add a Sink][add-sink].

When playing to multiple Sinks, the audio should continue
on the other connected Sinks. A popup should appear that
informs the user that a Sink has disappeared and include
the name of the Sink. This allows the user to investigate
the cause. Some possible causes include:

* The Sink has powered off.
* Another application is now using the Sink.
* The Sink is no longer in proximity.

### Play multiple audio formats

The Audio service framework supports PCM data over the wire.
(The current release does not support sending compressed audio.)

To provide the best user experience when displaying the list
of songs on the devices, consider filtering the list in advance
to avoid playback issues.

* If the application is intended to run on devices running
Android versions earlier than 4.0 (Ice Cream Sandwich, ICS),
the developer must decode the MP3 file.
* If the application is intended to run on ICS, use the
Android OpenSL ES APIs to decode audio formats into 16-bit
44.1 kHz or 48 kHz.

See the [Audio API Guide][audio-api-guide] for instructions on
writing a custom DataSource implementation.

[audio-interface-definition]: /learn/base-services/audiostreaming/interface
[add-sink]: #add-sink
[audio-api-guide]: /develop/api-guide/audio-streaming/cpp
