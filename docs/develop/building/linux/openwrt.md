# Building OpenWRT

The AllJoyn&trade; framework feeds exist on the following OpenWRT platform releases:

* v12.09 - official tagged release
* Attitude Adjustment - current stable release
* Barrier breaker - current development version

## Build and Install the AllJoyn framework

Follow these instructions to add the AllJoyn framework to your OpenWRT environment.

### Patch OpenSSL

* For Attitude Adjustment, use [39585][aa-branch] or later, or apply
  [patch 4802][aa-patch] (The 12.09 tagged release requires this 
  patch. The latest version on the Attitude Adjustment branch already
  has the patch applied.)

* For Barrier Breaker, use [39048][bb-branch] or later, or apply
  [patch 4576][bb-patch] (The latest version of Barrier Breaker, aka
  trunk, already has the patch applied.)

### Edit Feed

Add <u>**only one**</u> of these lines to your feeds.conf:

* For the official OpenWrt v12.09 tagged release

  ```sh
  src-git alljoyn https://git.allseenalliance.org/gerrit/core/openwrt_feed;openwrt_12.09
  ```

* For Attitude Adjustment

  ```sh
  src-git alljoyn https://git.allseenalliance.org/gerrit/core/openwrt_feed;attitude_adjustment
  ```

* For Barrier Breaker

  ```sh
  src-git alljoyn https://git.allseenalliance.org/gerrit/core/openwrt_feed;barrier_breaker
  ```

### Update Feeds

```sh
./scripts/feeds update -a
```

### Install the AllJoyn package definitions

```sh
./scripts/feeds install -a -p alljoyn
```

### Enable the AllJoyn packages to build

```sh
make menuconfig
        Networking --->
                < > alljoyn --->
                        < > alljoyn-about
                        < > alljoyn-c
                        < > alljoyn-config --->
                                < > alljoyn-config-samples
                        < > alljoyn-controlpanel --->
                                < > alljoyn-controlpanel-samples
                        < > alljoyn-notification --->
                                < > alljoyn-notification-samples
                        < > alljoyn-sample_apps
                        < > alljoyn-services_common
```

### Install the AllJoyn framework

If you built the AllJoyn framework as a module, move those IPKs over to
your OpenWRT device and run `opkg install <alljoyn-package>`.

If you built the AllJoyn framework directly into the image, simply flash 
the new firmware onto your OpenWRT device.

AllJoyn libs will be installed in `/usr/lib/` and binaries
will be installed in `/usr/bin/`.

## Run the AllJoyn framework

### Start the AllJoyn framework

Start the AllJoyn daemon

```sh
/etc/init.d/alljoyn start
```

Optionally, enable the AllJoyn daemon to start at boot-up.

```sh
/etc/init.d/alljoyn enable
```

### Run Sample Apps

Follow the Linux instructions to [run sample apps][running-sample-apps].
Note that since AllJoyn binaries and libs are installed in `/usr/bin/` 
and `/usr/lib/`, that the AllJoyn apps can run directly from any path
without setting `LD_LIBRARY_PATH`.

[aa-branch]: https://dev.openwrt.org/browser/branches/attitude_adjustment?rev=39585
[aa-patch]: http://patchwork.openwrt.org/patch/4802/

[bb-branch]: https://dev.openwrt.org/browser?rev=39048
[bb-patch]: http://patchwork.openwrt.org/patch/4576/

[running-sample-apps]: /develop/run-sample-apps