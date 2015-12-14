# Configuration API Guide - C++

## Reference code

### Classes used to provide ConfigData

|Server class | Description |
|---|---|
| ConfigService | Class that implements the interface org.alljoyn.Config as a service framework.|
| PropertyStore | Interface that supplies the list of properties required for ReadAll() and enables user manipulation of their values via Update(), Delete() and Reset().|

### Classes used to remotely manipulate ConfigData

|Client class | Description |
|---|---|
| ConfigClient | Class that implements the interface org.alljoyn.Config as a client. |

## Obtain the Configuration service framework

See the [Building Linux section][building-linux]
for instructions on compiling the Configuration service framework.

## Build an application that uses ConfigServer

The following steps provide the high-level process to build an
application that will maintain ConfigData.

1. Create the base for the AllJoyn&trade; application.
2. Implement the ProperyStore to produce a ConfigStore.
3. Initialize the AboutService in service mode.
4. Instantiate a ConfigStore.
5. Implement the callbacks required by the Config Server.
6. Initialize the ConfigService in server mode, providing
it with the ConfigStore and callbacks.

## Setting up the AllJoyn framework and About feature

The steps required for this service framework are universal
to all applications that use the AllJoyn framework and for
any application using one or more AllJoyn service frameworks.
Prior to use of the Configuration service framework as a Config
Server or Config Client, the About feature must be implemented
and the AllJoyn framework set up.

Complete the procedures in the following documents to guide
you in this process:

* [Building Linux section][building-linux]
* [About API Guide][about-api-guide-cpp]

## Implementing an App: Config Server

Implementing a Config Server requires creating and registering
an instance of the ConfigService class. Any application using
Config Server also requires an About Server to facilitate the
discovery via Announcements.

**NOTE:** Verify the BusAttachment has been created, started and
connected before implementing the ConfigService. See the
[About API Guide][about-api-guide-cpp] for the code snippets.
Code in this chapter references a variable `mBus`
(the BusAttachment variable name).

### Initialize the AllJoyn framework

See the [Building Linux section][building-linux] for instructions
to set up the AllJoyn framework.

#### Create bus attachment

```cpp
bus->Start();
bus->Connect();
```

### Enable peer security

Config Server uses peer security.

Create a KeyListener class that inherits from ajn::AuthListener.
It needs to implement two functions: RequestCredentials and
AuthenticationComplete.

```cpp
class SrpKeyXListener : public ajn::AuthListener {
   public:
      bool RequestCredentials(const char* authMechanism,
         const char* authPeer,
         uint16_t authCount, const char* userId,
         uint16_t credMask, Credentials& creds);
      void AuthenticationComplete(const char* authMechanism, const char* authPeer,

   bool success);
};
```

`RequestCredentials()` needs to set the password using Creds
and return true.

```cpp
creds.SetPassword(Password);
return true;
```

Instantiate the keylistener class and enable peer security.

```cpp
SrpKeyXListener* keyListener = new SrpKeyXListener();
bus->EnablePeerSecurity("ALLJOYN_PIN_KEYX ALLJOYN_SRP_KEYX ALLJOYN_ECDHE_PSK", keyListener);
```

### Implement PropertyStore to produce a ConfigStore

The PropertyStore interface is required by the AboutService
to store the provisioned values for the About interface data
fields. See the [About Interface Definition][about-interface-definition] for more information.

The ProperyStore interface is also required by the ConfigService
to store and facilitate manipulation of some updateable fields
(listed in [Config interface data fields][config-interface-data-fields]).
See the [Configuration Interface Definition] for more information.

#### Config interface data fields

|Field name | Required | Type |
|---|---|---|
| `DefaultLanguage` | yes | `s` |
| `DeviceName` | yes | `s` |

An example PropertyStore implementation (ConfigStore) is
provided below that specifies the following dictionary of
metadata fields:

* Keys are the field names.
* Values are a Map of String to Object entries where the
String is the language tag associated with the Object value.

This implementation extends the example AboutStore implementation
in the [About API Guide][about-api-guide-cpp] and is
passed to the AboutService instead of AboutStore.

```cpp
PropertyStoreImpl::PropertyStoreImpl(const char* factoryConfigFile, const char*
configFile) : m_IsInitialized(false)
{
   m_configFileName.assign(configFile);
   m_factoryConfigFileName.assign(factoryConfigFile);
}

void PropertyStoreImpl::Initialize()
{
   m_IsInitialized = true; m_factoryProperties.clear();
   m_factoryProperties.insert(m_Properties.begin(), m_Properties.end());

   //m_factoryProperties - overwrite the values that are found in
FactoryConfigService file
   UpdateFactorySettings();
}

void PropertyStoreImpl::FactoryReset()
{
   std::ifstream factoryConfigFile(m_factoryConfigFileName.c_str(), std::ios::binary);
   std::ofstream configFile(m_configFileName.c_str(), std::ios::binary);

   if (factoryConfigFile && configFile) {
      configFile << factoryConfigFile.rdbuf();

      configFile.close();
      factoryConfigFile.close();
   } else {
      std::cout << "Factory reset failed" << std::endl;
   }

   m_Properties.clear();
   m_Properties.insert(m_factoryProperties.begin(), m_factoryProperties.end());
}

const qcc::String& PropertyStoreImpl::GetConfigFileName()
{
   return m_configFileName;
}

PropertyStoreImpl::~PropertyStoreImpl()
{
}

QStatus PropertyStoreImpl::ReadAll(const char* languageTag, Filter filter, ajn::MsgArg& all)
{
   if (!m_IsInitialized) {
      return ER_FAIL;
   }

   if (filter == ANNOUNCE || filter == READ) {
      return AboutPropertyStoreImpl::ReadAll(languageTag, filter, all);
   }

   if (filter != WRITE) {
      return ER_FAIL;
   }

   QStatus status = ER_OK;
   if (languageTag != NULL && languageTag[0] != 0) { // check that the language is in the supported languages;
      CHECK_RETURN(isLanguageSupported(languageTag))
   } else {
      PropertyMap::iterator it = m_Properties.find(DEFAULT_LANG);
      if (it == m_Properties.end()) {

         return ER_LANGUAGE_NOT_SUPPORTED;
      }
      CHECK_RETURN(it->second.getPropertyValue().Get("s", &languageTag))
   }

   MsgArg* argsWriteData = new MsgArg[m_Properties.size()];
   uint32_t writeArgCount = 0;
   do {
      for (PropertyMap::const_iterator it = m_Properties.begin(); it !=
m_Properties.end(); ++it) {
         const PropertyStoreProperty& property = it->second;

         if (!property.getIsWritable()) {
            continue;
         }

         // check that it is from the defaultLanguage or empty. if (!(property.getLanguage().empty() ||
property.getLanguage().compare(languageTag) == 0)) {
            continue;
         }

         CHECK(argsWriteData[writeArgCount].Set("{sv}", property.getPropertyName().c_str(),
                                          new
MsgArg(property.getPropertyValue())))

         argsWriteData[writeArgCount].SetOwnershipFlags(MsgArg::OwnsArgs,true;

         writeArgCount++;
      }
      CHECK(all.Set("a{sv}", writeArgCount, argsWriteData))
      all.SetOwnershipFlags(MsgArg::OwnsArgs, true);
   } while (0);

   if (status != ER_OK) {
      delete[] argsWriteData;
   }

   return status;
}

QStatus PropertyStoreImpl::Update(const char* name, const char* languageTag, const ajn::MsgArg* value)
{
   if (!m_IsInitialized) {
   return ER_FAIL;
}

   PropertyStoreKey propertyKey = getPropertyStoreKeyFromName(name);
   if (propertyKey >= NUMBER_OF_KEYS) {
      return ER_FEATURE_NOT_AVAILABLE;

   }

   // check the languageTag
   // case languageTag == NULL: is not a valid value for the languageTag
   // case languageTag == "": use the default language
   // case languageTag == string: check value, must be one of the supported languages
   QStatus status = ER_OK;
   if (languageTag == NULL) {
      return ER_INVALID_VALUE;
   } else if (languageTag[0] == 0) {
      PropertyMap::iterator it = m_Properties.find(DEFAULT_LANG);
      if (it == m_Properties.end()) {
         return ER_LANGUAGE_NOT_SUPPORTED;
      }
      status = it->second.getPropertyValue().Get("s", &languageTag);
   } else {
      status = isLanguageSupported(languageTag);
      if (status != ER_OK) {
         return status;
      }
   }

   // Special case DEFAULT_LANG is not associated with a language in the PropertyMap and
   // its only valid languageTag = NULL
   // By setting it here, we to let the user follow the same language rules as any other property
   if (propertyKey == DEFAULT_LANG) {
      languageTag = NULL;
   }

   //validate that the value is acceptable
   qcc::String languageString = languageTag ? languageTag : ""; status = validateValue(propertyKey, *value, languageString); if (status != ER_OK) {
      std::cout << "New Value failed validation. Will not update" << std::endl;

      return status;
   }

   PropertyStoreProperty* temp = NULL;
   std::pair<PropertyMap::iterator, PropertyMap::iterator> propertiesIter =
m_Properties.equal_range(propertyKey);

   for (PropertyMap::iterator it = propertiesIter.first; it !=
propertiesIter.second; it++) {
      const PropertyStoreProperty& property = it->second;
      if (property.getIsWritable()) {
         if ((languageTag == NULL && property.getLanguage().empty()) || (languageTag != NULL && property.getLanguage().compare(languageTag)

== 0)) {

            temp = new PropertyStoreProperty(property.getPropertyName(),

*value, property.getIsPublic(),

               property.getIsAnnouncable());
            if (languageTag) {

            property.getIsWritable(),

               temp->setLanguage(languageTag);
         }
         m_Properties.erase(it);
         break;
      }
   }
}

if (temp == NULL) {
   return ER_INVALID_VALUE;
}

m_Properties.insert(PropertyPair(propertyKey, *temp));

if (persistUpdate(temp->getPropertyName().c_str(), value->v_string.str, languageTag)) {
   AboutService* aboutService = AboutServiceApi::getInstance();
   if (aboutService) {
      aboutService->Announce();
   std::cout << "Calling Announce after UpdateConfiguration" << std::endl;

   }
   delete temp;
   return ER_OK;
} else {
   delete temp;
   return ER_INVALID_VALUE;
   }
}

QStatus PropertyStoreImpl::Delete(const char* name, const char* languageTag)
{
   if (!m_IsInitialized) {
      return ER_FAIL;
   }

   PropertyStoreKey propertyKey = getPropertyStoreKeyFromName(name);
   if (propertyKey >= NUMBER_OF_KEYS) {
      return ER_FEATURE_NOT_AVAILABLE;
   }

   QStatus status = ER_OK;
   if (languageTag == NULL) {
      return ER_INVALID_VALUE;
   } else if (languageTag[0] == 0) {


      PropertyMap::iterator it = m_Properties.find(DEFAULT_LANG);
      if (it == m_Properties.end()) {
         return ER_LANGUAGE_NOT_SUPPORTED;
      }
      status = it->second.getPropertyValue().Get("s", &languageTag);
      } else {
         status = isLanguageSupported(languageTag);
         if (status != ER_OK) {
            return status;
         }
      }

      if (propertyKey == DEFAULT_LANG) {
         languageTag = NULL;
      }

      bool deleted = false;
      std::pair<PropertyMap::iterator, PropertyMap::iterator> propertiesIter =
   m_Properties.equal_range(propertyKey);

      for (PropertyMap::iterator it = propertiesIter.first; it !=
   propertiesIter.second; it++) {
         const PropertyStoreProperty& property = it->second;
         if (property.getIsWritable()) {
            if ((languageTag == NULL && property.getLanguage().empty()) || (languageTag != NULL && property.getLanguage().compare(languageTag)

   == 0)) {

               m_Properties.erase(it);
               // insert from backup. deleted = true;
               break;
            }
         }
      }

      if (!deleted) {
         if (languageTag != NULL) {
            return ER_LANGUAGE_NOT_SUPPORTED;
         } else {
            return ER_INVALID_VALUE;
         }
      }

      propertiesIter = m_factoryProperties.equal_range(propertyKey);

      for (PropertyMap::iterator it = propertiesIter.first; it !=
   propertiesIter.second; it++) {
         const PropertyStoreProperty& property = it->second;
         if (property.getIsWritable()) {
            if ((languageTag == NULL && property.getLanguage().empty()) || (languageTag != NULL && property.getLanguage().compare(languageTag)

   == 0)) {

               m_Properties.insert(PropertyPair(it->first, it->second));
               char* value;
               it->second.getPropertyValue().Get("s", &value);
               if (persistUpdate(it->second.getPropertyName().c_str(), value,

   languageTag)) {

                  AboutService* aboutService = AboutServiceApi::getInstance();
                  if (aboutService) {
                     aboutService->Announce();
                     std::cout << "Calling Announce after ResetConfiguration"

   << std::endl;

                 }
                 return ER_OK;
              }
           }
        }
      }
      return ER_INVALID_VALUE;
   }

   bool PropertyStoreImpl::persistUpdate(const char* key, const char* value, const char* languageTag)
   {
      std::map<std::string, std::string> data;
      std::string skey(key);
      if (languageTag && languageTag[0]) { skey.append("."); skey.append(languageTag);
      }

   data[skey] = value;
   return IniParser::UpdateFile(m_configFileName.c_str(), data);
}

PropertyStoreKey PropertyStoreImpl::getPropertyStoreKeyFromName(qcc::String const&
   propertyStoreName)
   {
      for (int indx = 0; indx < NUMBER_OF_KEYS; indx++) {
         if (PropertyStoreName[indx].compare(propertyStoreName) == 0) {
            return (PropertyStoreKey)indx;
         }
      }
      return NUMBER_OF_KEYS;
   }

   bool PropertyStoreImpl::FillDeviceNames()
   {
      std::map<std::string, std::string> data;

      if (!IniParser::ParseFile(m_factoryConfigFileName.c_str(), data)) {

      std::cerr << "Could not parse configFile" << std::endl;
      return false;
   }

   typedef std::map<std::string, std::string>::iterator it_data;
   for (it_data iterator = data.begin(); iterator != data.end(); iterator++) {

      if
(iterator->first.find(AboutPropertyStoreImpl::getPropertyStoreName(DEVICE_NAME).c_str())
== 0) {
         size_t lastDotLocation = iterator->first.find(".");
         if ((lastDotLocation ==	std::string::npos) || (lastDotLocation + 1
>= iterator->first.length())) {
            continue;
         }
         std::string language = iterator->first.substr(lastDotLocation + 1);
         std::string value = iterator->second;

         UpdateFactoryProperty(DEVICE_NAME, language.c_str(), MsgArg("s", value.c_str()));
      }
   }

   return true;
}

bool PropertyStoreImpl::UpdateFactorySettings()
{
   std::map<std::string, std::string> data;
   if (!IniParser::ParseFile(m_factoryConfigFileName.c_str(), data)) {
      std::cerr << "Could not parse configFile" << std::endl;
      return false;
   }

   std::map<std::string, std::string>::iterator iter;

   iter =
data.find(AboutPropertyStoreImpl::getPropertyStoreName(DEVICE_ID).c_str());
   if (iter != data.end()) {
      qcc::String deviceId = iter->second.c_str(); UpdateFactoryProperty(DEVICE_ID, NULL, MsgArg("s", deviceId.c_str()));
   }

   if (!FillDeviceNames()) {
      return false;
   }

   iter = data.find(AboutPropertyStoreImpl::getPropertyStoreName(APP_ID).c_str());

   if (iter != data.end()) {
      qcc::String appGUID = iter->second.c_str();

      UpdateFactoryProperty(APP_ID, NULL, MsgArg("s", appGUID.c_str()));
   }

   iter =
data.find(AboutPropertyStoreImpl::getPropertyStoreName(APP_NAME).c_str());
   if (iter != data.end()) {
      qcc::String appName = iter->second.c_str(); UpdateFactoryProperty(APP_NAME, NULL, MsgArg("s", appName.c_str()));
   }

   iter =
data.find(AboutPropertyStoreImpl::getPropertyStoreName(DEFAULT_LANG).c_str());
   if (iter != data.end()) {
      qcc::String defaultLanguage = iter->second.c_str(); UpdateFactoryProperty(DEFAULT_LANG, NULL, MsgArg("s",
defaultLanguage.c_str()));
   }

   return true;
}


void PropertyStoreImpl::UpdateFactoryProperty(PropertyStoreKey propertyKey, const char* languageTag,
   const ajn::MsgArg& value)
{
   PropertyStoreProperty* temp = NULL;
   std::pair<PropertyMap::iterator, PropertyMap::iterator> propertiesIter =
m_factoryProperties.equal_range(propertyKey);

   for (PropertyMap::iterator it = propertiesIter.first; it !=
propertiesIter.second; it++) {
   const PropertyStoreProperty& property = it->second;

   if ((languageTag == NULL && property.getLanguage().empty()) || (languageTag != NULL && property.getLanguage().compare(languageTag)

== 0)) {


      temp = new PropertyStoreProperty(property.getPropertyName(), value,

property.getIsPublic(),
property.getIsWritable(),
property.getIsAnnouncable());
      if (languageTag) {

         temp->setLanguage(languageTag);
      }
      m_factoryProperties.erase(it);
      break;
   }
}


   if (temp == NULL) {
      return;
   }

   m_factoryProperties.insert(PropertyPair(propertyKey, *temp));
   delete temp;
}
```

### Instantiate a ConfigStore

```cpp
propertyStore = new PropertyStoreImpl(FACTORYCONFIGFILENAME, CONFIGFILENAME);
propertyStore->setDeviceName(deviceName);
propertyStore->setAppId(appIdHex);
propertyStore->setAppName(appName);
propertyStore->setDefaultLang(defaultLanguage);

propertyStore->setModelNumber("Wxfy388i");
propertyStore->setDateOfManufacture("10/1/2199");
propertyStore->setSoftwareVersion("12.20.44 build 44454");
propertyStore->setAjSoftwareVersion(ajn::GetVersion());
propertyStore->setHardwareVersion("355.499. b");

std::vector<qcc::String> languages(3);
languages.push_back("en");
languages.push_back("sp");
languages.push_back("fr");
propertyStore->setSupportedLangs(languages);

DeviceNamesType::const_iterator iter = deviceNames.find(languages[0]);
   if (iter != deviceNames.end()) {
      CHECK_RETURN(propertyStore->setDeviceName(iter->second.c_str(), languages[0]));
   } else {
      CHECK_RETURN(propertyStore->setDeviceName("My device name", "en"));
   }

   iter = deviceNames.find(languages[1]);
   if (iter != deviceNames.end()) {
      CHECK_RETURN(propertyStore->setDeviceName(iter->second.c_str(), languages[1]));
   } else {
      CHECK_RETURN(propertyStore->setDeviceName("Mi nombre de dispositivo",
"sp"));
   }

   iter = deviceNames.find(languages[2]);
   if (iter != deviceNames.end()) {
      CHECK_RETURN(propertyStore->setDeviceName(iter->second.c_str(), languages[2]));
   } else {

      CHECK_RETURN(propertyStore->setDeviceName("Mon nom de l'appareil", "fr"));

   }
propertyStore->setDescription("This is an AllJoyn application", "en");
propertyStore->setDescription("Esta es una AllJoyn aplicacion", "sp");
propertyStore->setDescription("C'est une Alljoyn application", "fr");

propertyStore->setManufacturer("Company", "en");
propertyStore->setManufacturer("Empresa", "sp");
propertyStore->setManufacturer("Entreprise", "fr");

propertyStore->setSupportUrl("http://www.allseenalliance.org");
propertyStore->Initialize();
```

### Implement a BusListener and SessionPortListener

In order to bind a SessionPort and accept sessions, a new
class must be created that inherits from the AllJoyn
BusListener and SessionPortListener classes.

The class must contain the following function:

```cpp
bool AcceptSessionJoiner(SessionPort sessionPort, const char* joiner, const
SessionOpts& opts)
```

The AcceptSessionJoiner function will be called any time a
joinsession request is received; the Listener class needs
to dictate whether the joinsession request should be accepted
or rejected by returning true or false, respectively. These
considerations are application-specific and can include any
of the following:

* The SessionPort the request was made on
* Specific SessionOpts limitations
* The number of sessions already joined

Here is an example of a full class declaration for the listener class.

```cpp
class CommonBusListener : public ajn::BusListener, public ajn::SessionPortListener {

public:
   CommonBusListener();
   ~CommonBusListener();
   bool AcceptSessionJoiner(ajn::SessionPort sessionPort,
      const char* joiner, const ajn::SessionOpts& opts);
   void setSessionPort(ajn::SessionPort sessionPort);
      ajn::SessionPort getSessionPort();
   private:
      ajn::SessionPort m_SessionPort;
};
```

### Initialize the AboutService in server mode

```cpp
busListener = new CommonBusListener();
AboutServiceApi::Init(*bus, *propertyStore);
AboutServiceApi* aboutService = AboutServiceApi::getInstance();
busListener->setSessionPort(port);
bus->RegisterBusListener(*busListener);
TransportMask transportMask = TRANSPORT_ANY;
SessionPort sp = port;
SessionOpts opts(SessionOpts::TRAFFIC_MESSAGES, false,
SessionOpts::PROXIMITY_ANY, transportMask);
bus->BindSessionPort(sp, opts, *busListener);
aboutService->Register(port);
bus->RegisterBusObject(*aboutService);
```

For more information about the About feature, see the
[About API Guide][about-api-guide-cpp].

### Implement the callbacks required by the Config Server

```cpp
ConfigServiceListenerImpl::ConfigServiceListenerImpl(PropertyStoreImpl& store, BusAttachment& bus) :
   ConfigService::Listener(), m_PropertyStore(&store), m_Bus(&bus)
{
}

QStatus ConfigServiceListenerImpl::Restart()
{
   printf("Restart has been called !!!\n");
   return ER_OK;
}

QStatus ConfigServiceListenerImpl::FactoryReset()
{
   QStatus status = ER_OK;
   printf("FactoryReset has been called!!!\n"); m_PropertyStore->FactoryReset(); printf("Clearing Key Store\n");
   m_Bus->ClearKeyStore();

   AboutServiceApi* aboutService = AboutServiceApi::getInstance();
   if (aboutService) {
      status = aboutService->Announce();
      printf("Announce for %s =%d\n", m_Bus->GetUniqueName().c_str(), status);
   }

   return status;
}

QStatus ConfigServiceListenerImpl::SetPassphrase(const char* daemonRealm, size_t passcodeSize, const char* passcode)
{
   qcc::String passCodeString(passcode, passcodeSize);
   printf("SetPassphrase has been called daemonRealm=%s passcode=%s passcodeLength=%lu\n", daemonRealm,
passCodeString.c_str(), passcodeSize); PersistPassword(daemonRealm, passCodeString.c_str());

   printf("Clearing Key Store\n");
   m_Bus->ClearKeyStore();

   return ER_OK;
}

ConfigServiceListenerImpl::~ConfigServiceListenerImpl()
{
}

void ConfigServiceListenerImpl::PersistPassword(const char* daemonRealm, const char* passcode)
{
   std::map<std::string, std::string> data;
   data["daemonrealm"] = daemonRealm;
   data["passcode"] = passcode;
   IniParser::UpdateFile(m_PropertyStore->GetConfigFile().c_str(), data);
}
```

### Initialize the ConfigService in server mode, providing it with the ConfigStore and callbacks

```cpp
configServiceListenerImpl = new ConfigServiceListenerImpl(*propertyStoreImpl,
*msgBus);
configService = new ConfigService(*msgBus, *propertyStoreImpl,
*configServiceListenerImpl);

std::vector<qcc::String> interfaces;
interfaces.push_back("org.alljoyn.Config");
aboutService->AddObjectDescription("/Config", interfaces);

configService->Register();
msgBus->RegisterBusObject(*configService);
```

### Advertise name and announce

```cpp
AdvertiseName(SERVICE_TRANSPORT_TYPE);
aboutService->Announce();
```

### Unregister and delete ConfigService and BusAttachment

When your process is done with the ConfigService delete variables used:

```cpp
if (configService) {
   delete configService;
   configService = NULL;
}

if (configServiceListenerImpl) {
   delete configServiceListenerImpl;
   configServiceListenerImpl = NULL;
}

if (keyListener) {
   delete keyListener;
   keyListener = NULL;
}

if (propertyStoreImpl) {
   delete propertyStoreImpl;
   propertyStoreImpl = NULL;
}

delete msgBus;
msgBus = NULL;
```

## Implementing an App: Config Client

To implement an application to receive and modify ConfigData,
use the ConfigClient class. The AboutClient class must be used
so that your application is notified when applications with
About Server and possibly Config Server instances can send announcements.

**NOTE:** Verify the BusAttachment has been created, started and
connected before implementing a Config Client. See the [About
API Guide][about-api-guide-cpp] for the code snippets.
Code in this chapter references a variable `mBus`
(the BusAttachment variable name).

### Initialize the AllJoyn framework

See the [Building Linux section][building-linux] for
instructions to set up the AllJoyn framework.

#### Create bus attachment

```cpp
busAttachment ->Start();
busAttachment ->Connect();
```

### Enable peer security

Config Client uses peer security.

Create a KeyListener class that inherits from ajn::AuthListener.
It needs to implement two functions: RequestCredentials and
AuthenticationComplete.

```cpp
class SrpKeyXListener : public ajn::AuthListener {
   public:
      bool RequestCredentials(const char* authMechanism, const char* authPeer, uint16_t authCount, const char* userId,
            uint16_t credMask, Credentials& creds);
      void AuthenticationComplete(const char* authMechanism, const char*
authPeer, bool success);
};
```

RequestCredentials needs to set the password using Creds and return true.

```cpp
creds.SetPassword(Password);
return true;
```

Instantiate the keylistener class and enable peer security.

```cpp
SrpKeyXListener* keyListener = new SrpKeyXListener();
bus->EnablePeerSecurity("ALLJOYN_PIN_KEYX ALLJOYN_SRP_KEYX ALLJOYN_ECDHE_PSK", keyListener);
```

### Initialize the AboutService in client mode

Complete the following steps.

1. Implement the announce handler.
2. Implement the announce method.
3. Register the announce handler, if there is a Config interface.
4. Join a session.

For more information about the About feature, see the [About
API Guide][about-api-guide-cpp].

### Create the ConfigService client object

```cpp
configClient = new ConfigClient(*busAttachment);
```

#### Request the ConfigData

The Configurations data structure is filled by the `GetConfigurations()`
method call. Configurations can be iterated through to determine
the contents. The content definition is found in the [Configuration
Interface Definition][config-interface-definition].

```cpp
ConfigClient::Configurations configurations;
if ((status = configClient->GetConfigurations(busname.c_str(),
      "en", configurations, id)) == ER_OK) {
   for (ConfigClient::Configurations::iterator it = configurations.begin();
      it != configurations.end(); ++it) { qcc::String key = it->first; ajn::MsgArg value = it->second;
      if (value.typeId == ALLJOYN_STRING) {
         printf("Key name=%s value=%s\n", key.c_str(), value.v_string.str);
         } else if (value.typeId == ALLJOYN_ARRAY &&
value.Signature().compare("as") == 0) {
         printf("Key name=%s values: ", key.c_str());
         const MsgArg*stringArray;
         size_t fieldListNumElements;
         status = value.Get("as", &fieldListNumElements, &stringArray);
         for (unsigned int i = 0; i < fieldListNumElements; i++) {
            char* tempString; stringArray[i].Get("s", &tempString);
            printf("%s ", tempString);
         }
         printf("\n");
      }
   }
```

####  Update the ConfigData

The received data can be updated through the ConfigClient
using the `UpdateConfigurations()` method call.

```cpp
configurations.insert(std::pair<qcc::String, ajn::MsgArg>("DeviceName", MsgArg("s", "New Device Name")));
configClient->UpdateConfigurations(busname.c_str(), NULL, configurations, id);
```

#### Get the interface version

The peer device/application configuration can query for the
interface version.

```cpp
int version;
configClient->GetVersion(busname.c_str(), version, id);
```

#### Reset the ConfigData

The ConfigData can be reset to default through the ConfigClient
using the `ResetConfigurations()` method call.

```cpp
std::vector<qcc::String> configNames;
configNames.push_back("DeviceName");
configClient->ResetConfigurations(busname.c_str(), "en", configNames, id);
```

#### Reset the peer device application to factory defaults

The peer device/application configuration can be reset to
factory defaults through the ConfigClient using the
`FactoryReset()` method call.

**NOTE:** This is a no-reply call, so its success cannot be
determined directly.

```cpp
configClient->FactoryReset(busname.c_str(), id);
```

#### Restart the peer

The peer application can be restarted though the ConfigClient
using the Restart() method call.

**NOTE:** This is a no-reply call, so its success cannot be
determined directly.

```cpp
configClient->Restart(busname.c_str(), id);
```

#### Setting a passcode on the peer

The peer application can be set to have a different passcode
though the ConfigClient using the `SetPasscode()` method call.
This revokes the current encryption keys and regenerates new
ones based on the new shared secret, namely the passcode.

**NOTE:** The realm name is currently ignored.

```cpp
configClient->SetPasscode(busname.c_str(), "MyDeamonRealm", 8, (const uint8_t*) NEW_PASSCODE, id);
   srpKeyXListener->setPassCode(NEW_PASSCODE);
   qcc::String guid;
   busAttachment->GetPeerGUID(busname.c_str(), guid);
   busAttachment->ClearKeys(guid);
```

### Delete variables and unregister listeners

Once you are done using the Config Service, Configuration
service framework, and the AllJoyn framework, free the variables
used in the application.

```cpp
if (configClient) {
   delete configClient;
   configClient = NULL;
}
busAttachment->Stop();
delete busAttachment;
```

[building-linux]: /develop/building/linux
[about-api-guide-cpp]: /develop/api-guide/about/cpp
[about-interface-definition]: /learn/core/about-announcement/interface
[config-interface-definition]: /learn/base-services/configuration/interface
[config-interface-data-fields]: #config-interface-data-fields
