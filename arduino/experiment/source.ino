#include <NTPClient.h>
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <WiFiUdp.h>

#define NTP_OFFSET 60 * 60     // In seconds
#define NTP_INTERVAL 60 * 1000 // In miliseconds
#define NTP_ADDRESS "id.pool.ntp.org"

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, NTP_ADDRESS, NTP_OFFSET, NTP_INTERVAL);

#define FIREBASE_HOST "CHANGE_THIS"
#define FIREBASE_AUTH "CHANGE_THIS"

FirebaseData fbdo;

const char *ssid = "INTERNET";
const char *password = "internet123";
int sensor_pin = D0;

String deviceid = "device-1";
String patientid = "";
unsigned long weightA = 3000;
unsigned long weightB = 3000;
unsigned long dropCount = 0;

void setup()
{
  pinMode(sensor_pin, INPUT);
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  // Firebase.setInt("infus", count);
  FirebaseData fbdata;
  Firebase.get(fbdata, "/devicestore/" + deviceid + "/patientid");
  patientid = fbdata.stringData();
  timeClient.begin();
}

void mockSensor()
{
  weightA = weightA - 1;
  weightB = weightB - 1;
  dropCount = dropCount + 1;
}

void loop()
{
  timeClient.update();
  unsigned long epochTime = timeClient.getEpochTime();
  String strtime = String(epochTime);
  String usageid = deviceid + "_" + strtime;

  mockSensor();

  FirebaseJson jsonData;
  jsonData.set("usageid", usageid);
  jsonData.set("deviceid", deviceid);
  jsonData.set("patientid", patientid);
  jsonData.set("weightA", weightA);
  jsonData.set("weightB", weightB);
  jsonData.set("time", epochTime);
  jsonData.set("dropCount", dropCount);

  Firebase.set(fbdo, "/usagestore/" + usageid, jsonData);

  Serial.println("datasent " + strtime);
  delay(60000);
  // int sensor_value = digitalRead(sensor_pin);
  // if (sensor_value == HIGH) {
  //   count++;
  //   Serial.print("Infus masuk ke tubuh pasien, jumlah: ");
  //   Serial.println(count);
  //   Firebase.setInt(fbdo, "infus", count);
  //   delay(1000);
  // }
}
