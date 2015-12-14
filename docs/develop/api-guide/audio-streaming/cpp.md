# Audio API Usage Guide - C++

## Reference code

The reference code consists of an application that implements
an audio sink and audio source.

Audio.h contains definitions that are common to both audio
sinks and sources.

### Sink classes

| Sink class | Description |
|---|---|
| AudioSinkObject | <p>Class that implements the following AllJoyn&trade; interfaces:</p><ul><li>org.alljoyn.Stream.Port</li><li>org.alljoyn.Stream.Port.AudioSink</li><li>org.alljoyn.Control.Volume</li></ul> |
| StreamObject | <p>Class that implements the following AllJoyn interfaces:</p><ul><li>org.alljoyn.Stream</li><li>org.alljoyn.Stream.Clock</li></ul> |
| AudioDevice | Abstract class for implementing access to an audio device/sound card. |
| ALSADevice | Subclass of AudioDevice that implements access to an audio device using the Audio Linux Sound Architecture (ALSA) API. |

### Source classes

| Source class | Description |
|---|---|
| SinkSearcher | Helper class for discovering AudioSinks. |
| SinkPlayer | Implements streaming of DataSources to an AudioSink. |
| DataSource | Abstract class for providing data to SinkPlayer for streaming. |
| WavDataSource | Subclass of DataSource that provides data from WAV files to SinkPlayer for streaming. |

### Reference C++ application code

| Application class | Description |
|---|---|
| SinkService | Command line application that receives and plays streamed audio by registering an instance of StreamObject on the AllJoyn bus. |
| SinkClient | Command line application that uses SinkSearcher to discover audio sinks and uses SinkPlayer to stream a WAV file to the sink. |

## Compile the Audio service framework

1. Follow the steps in the [Configuring the Build Environment (Linux Platform) section][config-build-env-linux].
Stop prior to the Building AllJoyn section.
2. Pull down the source code:

   ```sh
   $ repo init -u git clone git://git.allseenalliance/core/alljoyn.git
   ```
3. Run SCons to compile the Audio service framework, test suite, and samples.
   ```sh
   $ cd services/audio
   ```

   * For 64-bit:

      ```sh
      $ scons CPU=x86_64 ABOUT_BASE=$ALLJOYN_BASE/about/cpp
      ```

   * For 32-bit:

      ```sh
      $ scons ABOUT_BASE=$ALLJOYN_BASE/about/cpp
      ```

   The build completes, and a build folder contains the compiled files.

## Build a Sink

The following steps provide the high-level process to build a Sink.

1. Create the base for the AllJoyn application.
2. Implement the AboutStore and use this with the AboutService API.
See the [appropriate About API Guide][about-api-guides] for the platform
you are targeting for instructions.
3. Implement the AudioDevice if the audio device/sound card
used by your platform is not supported.
4. Create and register a StreamObject.

## Build a Source

The following steps provide the high-level process to build a Source.

1. Create the base for the AllJoyn application.
2. Create a class that extends SinkSearcher and SinkListener.
3. Create a new SinkPlayer and register the SinkListener.
4. Register the SinkSearcher.

## Setting Up the AllJoyn Framework

Every AllJoyn application requires a base set to be in place
before implementing specific features.

* Create BusAttachment
* Connect to the AllJoyn framework

### Create BusAttachment

To use the Audio service framework, an AllJoyn object called
the BusAttachment is needed that is used internally by the
service to leverage the AllJoyn API calls.

```cpp
BusAttachment* msgBus = new BusAttachment("SinkService", true);
```

### Start and connect the BusAttachment

Once created, the BusAttachment must be connected to the AllJoyn framework.

```cpp
QStatus status = msgBus->Start(); if( status == ER_OK ) {
status = msgBus->Connect(NULL);
}
```

## Implementing a Sink

Implementing a Sink to receive streaming audio requires
creating and registering an instance of the StreamObject class.

**NOTE:** Verify the BusAttachment has been created, started and
connected before implementing the Sink. See [Setting up the
AllJoyn Framework][set-up-alljoyn-framework] for the code snippets.
Code in this section references a variable `msgBus` (the
BusAttachment variable name).

### Declare listener class

Declare a listener class to receive the SessionPortListener callbacks.
Typically, an AcceptSessionJoiner callback in SessionPortListener
has a check to allow or disallow access. Since the Sink requires
access to everyone, return true when this callback is triggered.
Use the SessionJoined handler to set the session timeout to 20 seconds.

```cpp
class MyListener : public SessionPortListener {
   private:
      BusAttachment *mMsgBus;

   public:
      MyListener( BusAttachment *msgBus ) { mMsgBus = msgBus;
      }

      bool AcceptSessionJoiner( SessionPort sessionPort, const char* joiner,
const SessionOpts& opts ) {

         printf("Accepting join session request from %s (opts.proximity=%x,
opts.traffic=%x, opts.transports=%x)\n",
            joiner, opts.proximity, opts.traffic, opts.transports);

         return true;
      }

      void SessionJoined( SessionPort sessionPort, SessionId id,
const char* joiner ) {
         printf("SessionJoined with %s (id=%d)\n", joiner, id);
         mMsgBus->EnableConcurrentCallbacks();
         uint32_t timeout = 20;
         QStatus status = mMsgBus->SetLinkTimeout(id, timeout);
         if( status == ER_OK ) {
            printf("Link timeout has been set to %ds\n", timeout);
         } else {
            printf("SetLinkTimeout(%d) failed\n", timeout);

         }
      }
};
```

### Use the AboutService API to announce Sink details

1. Declare a PropertyStore class to advertise about properties.
The properties advertised should be customized for the device
the Sink is running on.

  **NOTE:** See the [About API Guide][about-api-guides] for the
  platform you are targeting for required and optional properties
  that the About feature can assign. The AppId field and other
  values below are examples and should not be reused in commercial
  products. See the [About Best Practices][about-best-practices] for
  details on generating the AppId and other values.

   ```cpp
   class AboutStore : public PropertyStore {
     public:
         AboutStore(const char* friendlyName)
            { struct utsname utsname; uname(&utsname);
            mDeviceId = strdup(utsname.nodename);
            mFriendlyName = strdup(friendlyName);
         }
         ~AboutStore() {
            if (mDeviceId != NULL)
               free((void*)mDeviceId);
            if (mFriendlyName != NULL)
               free((void*)mFriendlyName);
         }
         QStatus ReadAll(const char* languageTag, PropertyStore::Filter
            filter, MsgArg& all) {
            if (languageTag && strcmp(languageTag, "en") != 0) { return ER_FAIL;
            }
            if (PropertyStore::WRITE == filter) {
               return ER_NOT_IMPLEMENTED;
            }

            size_t numProps = (PropertyStore::READ == filter) ? 11 : 7;
            MsgArg* props = new MsgArg[numProps];
            static const uint8_t appId[] = { 0x5a, 0x1e, 0xff, 0xf1, 0xf7,
               0x99, 0x4d, 0x22, 0x82, 0xc0, 0x93, 0x4d, 0x3c, 0x86, 0x16, 0xa6 };
               props[0].Set("{sv}", "AppId", new MsgArg("ay", 16, appId));
               props[1].Set("{sv}", "DefaultLanguage", new MsgArg("s", "en"));
               props[2].Set("{sv}", "DeviceName", new MsgArg("s", mFriendlyName));
               props[3].Set("{sv}", "DeviceId", new MsgArg("s", mDeviceId));
               props[4].Set("{sv}", "AppName", new MsgArg("s", "SinkService"));
               props[5].Set("{sv}", "Manufacturer", new MsgArg("s", "AllJoyn"));
               props[6].Set("{sv}", "ModelNumber", new MsgArg("s", "1"));
               if (PropertyStore::READ == filter) {
                  static const char* supportedLanguages[] = { "en" };
                  props[7].Set("{sv}", "SupportedLanguages", new MsgArg("as",
1, supportedLanguages));
                  props[8].Set("{sv}", "Description", new MsgArg("s", "AllJoyn Audio Sink"));
                  props[9].Set("{sv}", "SoftwareVersion", new MsgArg("s", "v0.0.1"));
                  props[10].Set("{sv}", "AJSoftwareVersion", new MsgArg("s", ajn::GetVersion()));
               }

               all.Set("a{sv}", numProps, props);
               all.SetOwnershipFlags(MsgArg::OwnsArgs, true);
               return ER_OK;
         }
      private:
         const char* mDeviceId;
         const char* mFriendlyName;
      };
   ```

2. Create an instance of the new AboutStore class to provide
to the StreamObject (see [Create and register StreamObject][create-register-streamobject].)

   ```cpp
      const char *friendlyName = "Living Room";
      AboutStore* aboutProps = new AboutStore(friendlyName);
   ```

### Bind session port

To allow incoming connections, the formation of a session is needed.
The AllJoyn framework needs to be told that connections are allowed.

```cpp
MyListener* myListener = new MyListener(msgBus);
SessionOpts opts(SessionOpts::TRAFFIC_MESSAGES, false,
SessionOpts::PROXIMITY_ANY, TRANSPORT_ANY);
SessionPort sessionPort = SESSION_PORT_ANY;

if( status == ER_OK )
   status = msgBus->BindSessionPort(sessionPort, opts, *myListener);
```

### Create an AudioDevice object

Some platforms use different audio drivers. As such, there is an
abstraction layer called AudioDevice that must be implemented
for the platform driver. The current release supports the following platforms:

* Linux:

  ```cpp
  AudioDevice* audioDevice = new ALSADevice();
  ```

* Android:

  ```java
  AudioDevice* audioDevice = new AndroidDevice();
  ```

### Create and register StreamObject

StreamObject is an implementation wrapper around AllJoyn
native calls that handle the interactions between Sink and Source.

```cpp
StreamObject *streamObj = NULL; if( status == ER_OK ) {
   streamObj = new StreamObject(msgBus, "/Speaker/In", audioDevice,
      sessionPort, aboutProps);
   status = streamObj->Register();
   if (status != ER_OK)
      printf("Failed to register stream object (%s)\n",
         QCC_StatusText(status));
}
```

### Advertise

To accept connections, we need to advertise over the AllJoyn framework.
The unique name the AllJoyn framework provides is acceptable
for this purpose because the Audio service framework relies
on the AboutService API to distribute information about the device.

**NOTE:** In most applications that use the AllJoyn framework and
do not use the About feature, a descriptive well-known name
is chosen to advertise.

```cpp
String name = msgBus->GetUniqueName();
if( status == ER_OK ) {
   status = msgBus->AdvertiseName(name.c_str(), opts.transports);
   if (status != ER_OK)
      printf("Failed to advertise name %s (%s)\n", name.c_str(),
         QCC_StatusText(status));
}
```

### Unregister and delete StreamObject

When your process is done with the Sink and no longer wishes
to receive audio input, unregister the process from the AllJoyn
bus and then delete the StreamObject instance.

```cpp
if( streamObj != NULL ) {
   streamObj->Unregister();
   delete streamObj;
   streamObj = NULL;
}
delete aboutProps;
aboutProps = NULL;
delete msgBus;


msgBus = NULL;
delete myListener;
myListener = NULL;
```

## Implementing a Source

To implement a Source to stream to a Sink, use the SinkSearcher
and SinkPlayer classes. By declaring a SinkSearcher subclass,
your application is notified when Sinks are found and lost.
When a Sink is found, you can add it to a SinkPlayer instance.
Verify the BusAttachment has been created, started and connected
before implementing an AudioSource. See [Setting up the AllJoyn Framework]
[set-up-alljoyn-framework] for the code snippets. Code in this
section references a variable msgBus (the BusAttachment variable name).

### Declare SinkSearcher subclass

To interact with different Sinks, the SinkPlayer subclass
provides an API containing AddSink and RemoveSink methods,
as well as check if they have already been added.
The following code snippet adds any new Sink that has not
already been added.

**NOTE:** AddSink allows for audio to be played back on that device
once `SinkAdded` (from the SinkListener below) has been called.
After `SinkAdded` is called, call `OpenSink` on each Sink that
should receive audio. Play and Pause commands will affect all
opened Sinks. Refer to the API documentation for more details.

```cpp
static SinkPlayer *g_sinkPlayer = NULL;
class MySinkSearcher : public SinkSearcher {
   virtual void SinkFound( Service *sink ) {
      const char *name = sink->name.c_str();
      const char *path = sink->path.c_str();
      printf("Found %s objectPath=%s, sessionPort=%d\n", name, path,
         sink->port);
      if( !g_sinkPlayer->HasSink(name) )
         g_sinkPlayer->AddSink(name, sink->port, path);
   }

   virtual void SinkLost( Service *sink ) {
   const char *name = sink->name.c_str();
   printf("Lost %s\n", name);
   }
};
```

### Declare SinkListener subclass

SinkPlayer methods such as AddSink and RemoveSink are asynchronous.
You can create and register a SinkListener to be notified when
these calls have completed. The SinkRemoved handler is also called
when a sink's session is lost.

```cpp
class MySinkListener : public SinkListener {
   void SinkAdded( const char *name ) {
      printf("SinkAdded: %s\n", name);

      g_sinkPlayer->OpenSink(name);
   }

   void SinkAddFailed( const char *name ) {
      printf("SinkAddFailed: %s\n", name);
   }

   void SinkRemoved( const char *name, bool lost ) {
      printf("SinkRemoved: %s lost=%d\n", name, lost);
   }

   void MuteChanged(const char* name, bool mute) {
      printf("MuteChanged: %s mute=%s\n", name, mute ? "on" : "off");
   }

   void VolumeChanged(const char* name, int16_t volume) {
      printf("VolumeChanged: %s volume=%d\n", name, volume);
   }
};
```

### Create and configure SinkPlayer

The SinkPlayer object is responsible for sending a supplied
DataSource over the AllJoyn framework to any open sinks.
The DataSource can be set any time prior to calling the
`OpenSink()` method.

```cpp
MySinkListener listener;
g_sinkPlayer = new SinkPlayer(msgBus);
g_sinkPlayer->AddListener(&listener);
```

### Set the preferred audio data format

`SinkPlayer` lets you specify which format to use for streaming.
However, there is no guarantee that the format you specify
will be used. If a Sink does not support your preferred format,
`SinkPlayer` automatically defaults to raw audio.

**NOTE:** This must be called prior to adding a Sink using `AddSink()`.

To support ALAC (Apple Lossless):

```cpp
g_sinkPlayer->SetPreferredFormat(MIMETYPE_AUDIO_ALAC);
```

To support RAW audio support:

```cpp
g_sinkPlayer->SetPreferredFormat(MIMETYPE_AUDIO_RAW);
```

### Set the data source

To best support multiple audio file formats, a DataSource
class is created that represents how the audio file will be
decoded and read. Currently, support for WAV files is provided.
Adding support for other audio formats will require implementing
a new class derived from DataSource.
A .WAV file example follows.

```cpp
WavDataSource dataSource;
dataSource.Open("/path/to/file.wav"); // the WAV file to stream to the sink(s)
g_sinkPlayer->SetDataSource(&dataSource);
```

### Create and register SinkSearcher

Create an object of the class that is derived from SinkSearcher
from [Declare SinkSearcher subclass][declare-sinksearcher-subclass]
and register it with the BusAttachment.

```cpp
MySinkSearcher searcher;
status = searcher.Register(msgBus);
```

### Start playback once a Sink has been found

It is recommended that developers verify the number of connected
Sinks = 1 prior to calling the Play method to ensure audio will
be played remotely. The Play method will start audio on every
sink that OpenSink() has been called on.

```cpp
// Sleep until sink is found and then play. An alternative approach would be to
// call Play() in the SinkListener on the SinkAdded event.
while( g_sinkPlayer->GetSinkCount() < 1 )
   usleep(100 * 1000);
g_sinkPlayer->Play();
```

### Unregister SinkSearcher and delete SinkPlayer

Once you are done streaming, unregister the SinkSearcher,
remove any sinks that are still part of the SinkPlayer,
and then delete the SinkPlayer.

**NOTE:** The SinkPlayer object must be deleted before the BusAttachment object.

```cpp
searcher.Unregister();
g_sinkPlayer->RemoveAllSinks();
// Wait for sinks to be removed
while( g_sinkPlayer->GetSinkCount() > 0 )
   usleep(100 * 1000);
delete g_sinkPlayer;
```

## Implementing an AudioDevice

The reference code includes an AudioDevice subclass that uses
the ALSA API. If your target environment uses a different sound
card API, you must do the following:

* Implement a new AudioDevice subclass.
* When creating a StreamObject create a new instance of the AudioDevice
and pass it into the StreamObject constructor. For example:

  ```cpp
  audioDevice = new MyAudioDevice();
  streamObj = new StreamObject(msgBus, "/Speaker/In", audioDevice,
  sessionPort, aboutProps);
  ```

The following defines the AudioDevice methods your subclass must implement.

| Method | Description |
|---|---|
| `Open()` | Open and prepare the audio device for playback, and start playing as soon as it receives data. |
| `Close()` | Close audio device and free any resources. |
| `Play()` | Start audio device playback. |
| `Pause()` | Pause audio device playback. |
| `Play()` | Resume after a pause. |
| `Recover()` | Recover from underrun if one has occurred. |
| `GetDelay()` | Get audio device delay (time until new samples will be audible). |
| `GetFramesWanted()` | Get the number of frames the audio device wants. |
| `Write()` | Write samples to audio device. |
| `GetMute()` | Gets the audio device mute state. |
| `SetMute()` | Sets the audio device mute state. |
| `GetVolumeRange()` | Gets the audio device volume range. |
| `GetVolume()` | Gets the audio device volume. |
| `SetVolume()` | Set audio device volume and mute state. |
| `AddListener()` | Adds a listener for volume and mute events. |
| `RemoveListener()` | Removes a listener for volume and mute events. |


### Example `Open()` implementation

```cpp
bool ALSADevice::Open( const char *format, uint32_t sampleRate,
uint32_t numChannels, uint32_t &bufferSize ) {
   int err;
   if( mAudioDeviceHandle != NULL ) { fprintf(stderr, "Open: already open\n"); return false;
   }

   uint32_t bitsPerChannel;
   snd_pcm_format_t pcmFormat;

   if( strcmp(format, "s16le") == 0 ) {
      pcmFormat = SND_PCM_FORMAT_S16_LE; bitsPerChannel = 16;
   } else {
      fprintf(stderr, "Unsupported audio format: %s\n", format);
      return false;
   }

   if( (err = snd_pcm_open(&mAudioDeviceHandle, "plughw:0,0",
SND_PCM_STREAM_PLAYBACK, 0)) < 0 ) {
      fprintf(stderr, "cannot open audio device (%s)\n", snd_strerror(err));
      return false;
   }

   snd_pcm_hw_params_t *hw_params = NULL;
      if( (err = snd_pcm_hw_params_malloc(&hw_params)) < 0 ) {
         fprintf (stderr, "cannot allocate hardware parameter structure (%s)\n",
snd_strerror(err));
            snd_pcm_close(mAudioDeviceHandle);
            return false;
      }

#define AUDIO_CLEANUP() \
if( mAudioDeviceHandle != NULL ) { \
   snd_pcm_close(mAudioDeviceHandle); \
   mAudioDeviceHandle = NULL; \
} \
if( hw_params != NULL ) { \
   snd_pcm_hw_params_free(hw_params); \
   hw_params = NULL; \
}

   if( (err = snd_pcm_hw_params_any(mAudioDeviceHandle, hw_params)) < 0 ) {
      fprintf(stderr, "cannot initialize hardware parameter structure (%s)\n",
snd_strerror(err));
      AUDIO_CLEANUP();
      return false;
   }

   if( (err = snd_pcm_hw_params_set_access(mAudioDeviceHandle, hw_params,
SND_PCM_ACCESS_RW_INTERLEAVED)) < 0 ) {
   fprintf(stderr, "cannot set access type (%s)\n", snd_strerror(err));

   AUDIO_CLEANUP();
   return false;
}

if( (err = snd_pcm_hw_params_set_format(mAudioDeviceHandle, hw_params,
pcmFormat)) < 0 ) {
   fprintf(stderr, "cannot set sample format (%s)\n", snd_strerror(err));
   AUDIO_CLEANUP();
   return false;
}

if( (err = snd_pcm_hw_params_set_rate_near(mAudioDeviceHandle, hw_params,
&sampleRate, 0)) < 0 ) {
   fprintf(stderr, "cannot set sample rate (%s)\n", snd_strerror(err));
   AUDIO_CLEANUP();
   return false;
}

if( (err = snd_pcm_hw_params_set_channels(mAudioDeviceHandle, hw_params,
numChannels)) < 0 ) {
   fprintf(stderr, "cannot set channel count (%s)\n", snd_strerror(err));
   AUDIO_CLEANUP();
   return false;
}

uint32_t bytesPerFrame = (bitsPerChannel >> 3) * numChannels;
snd_pcm_uframes_t bs = 4096 * bytesPerFrame;
if( (err = snd_pcm_hw_params_set_buffer_size(mAudioDeviceHandle, hw_params,
bs)) < 0 ) {
   fprintf(stderr, "snd_pcm_hw_params_set_buffer_size failed: %s\n",
   snd_strerror(err));
}

if( (err = snd_pcm_hw_params(mAudioDeviceHandle, hw_params)) < 0 ) {
   fprintf(stderr, "cannot set parameters (%s)\n", snd_strerror(err));
   AUDIO_CLEANUP();
   return false;
}

snd_pcm_hw_params_get_buffer_size(hw_params, &bs);
bufferSize = (uint32_t)bs;

mHardwareCanPause = snd_pcm_hw_params_can_pause(hw_params) == 1;
snd_pcm_hw_params_free(hw_params);

return true;
}
```

### Example `Write()` implementation

An important part of the write implementation is that the
call should be blocking until the write is complete.

The implementation of the audio driver presents the following options:

* If it's buffer-based, this method should block while waiting
for a buffer to free up.
* In the case of ALSA, the snd_pcm_writei method is blocking.

```cpp
bool ALSADevice::Write( const uint8_t *buffer, uint32_t bufferSizeInFrames ) {
   snd_pcm_sframes_t err = snd_pcm_writei(mAudioDeviceHandle, buffer,
bufferSizeInFrames);
   if( err < 0 )
      err = snd_pcm_recover(mAudioDeviceHandle, err, 0);
   if( err < 0 )
      fprintf(stderr, "write to audio interface failed (%s)\n",
snd_strerror(err));
   if( err > 0 && err != (snd_pcm_sframes_t)bufferSizeInFrames )
      fprintf(stderr, "short write (expected %u, wrote %li)\n",
bufferSizeInFrames, err);
   return err > 0;
}
```

[about-api-guides]: /develop/api-guide/about
[set-up-alljoyn-framework]: #setting-up-the-alljoyn-framework
[config-build-env-linux]: /develop/building/linux/build-source
[about-best-practices]: /develop/api-guide/about
[create-register-streamobject]: #create-and-register-streamobject
[declare-sinksearcher-subclass]: #declare-sinksearcher-subclass
