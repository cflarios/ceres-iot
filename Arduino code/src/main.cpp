// Librerías
#include <Arduino.h>
#include <SPI.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <Arduino.h>
#include <Wire.h>
#include "Adafruit_SHT31.h"

Adafruit_SHT31 sht31 = Adafruit_SHT31();

// Credenciales de tu red Wi-Fi
const char *ssid = "YOURSSID";
const char *password = "YOURPASSWORD";

// Credenciales de tu servidor MQTT
const char *mqtt_server = "test.mosquitto.org"; // Red Local con Raspberry pi
// Red pública de mosquitto --> test.mosquitto.org

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;
const int ledPin = 2;
float t = 0;
float h = 0;
const int Trigger = 5;
const int Echo = 18;

// PWM config
const int PWM_pin = 13;
const int freq = 5000;
const int ledChannel = 0;
const int resolution = 8;
float pwm_cmd = 0;

void callback(char *topic, byte *message, unsigned int length)
{
  Serial.print("Llegó un mensaje del tópico: ");
  Serial.print(topic);
  Serial.print(". Mensaje: ");
  String messageTemp;

  char command_str[8];
  char module_str[length - 8];

  if (strncmp((char *)module_str, (char *)"module1=", 8) == 0)
  {
    pwm_cmd = (float)atoi((char *)command_str);
    // conversion from max=100% PWM to 8-bits output
    pwm_cmd *= 255.0 / 100;

    Serial.print("PWM Ratio:");
    Serial.print(pwm_cmd);
    Serial.println("%");
  }
  if (pwm_cmd >= 50)
  {
    digitalWrite(ledChannel, HIGH);
  }
  for (int i = 0; i < length; i++)
  {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();

  if (String(topic) == "esp32/LED")
  {
    Serial.print("Changing output to ");
    if (messageTemp == "on")
    {
      Serial.println("Led encendido");
      digitalWrite(ledPin, HIGH);
    }
    else if (messageTemp == "off")
    {
      Serial.println("Led apagado");
      digitalWrite(ledPin, LOW);
    }
  }
  Serial.println();
}

void setup_wifi()
{

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Conectándose a: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.print("Dirección IP del ESP32: ");
  Serial.print(WiFi.localIP());
  Serial.println("");
}

void setup()
{
  Serial.begin(9600);
  pinMode(Trigger, OUTPUT);
  pinMode(Echo, INPUT);
  pinMode(ledPin, OUTPUT);

  ledcSetup(ledChannel, freq, resolution); // PWM setup
  ledcAttachPin(PWM_pin, ledChannel);

  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  
  if (!sht31.begin(0x44))
  {
    Serial.println("No se pudo encontrar el SHT31");
    while (1)
      delay(1);
  }
}

void reconnect()
{
  // Loop until we're reconnected
  while (!client.connected())
  {
    Serial.print("Intentando conexión MQTT..");
    // Attempt to connect
    if (client.connect("ESP32Client"))
    {
      Serial.println("¡conectado!");
      client.subscribe("esp32/LED");
      client.subscribe("esp32/PWM");
    }
    else
    {
      Serial.print("falló, rc=");
      Serial.print(client.state());
      Serial.println(" intentar otra vez en 5 segundos");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void loop()
{
  long time;
  float distance;

  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  long now = millis();
  if (now - lastMsg > 5000)
  {
    lastMsg = now;

    t = sht31.readTemperature(); // Convertir la variable t de float a char
    char tempString[8];
    dtostrf(t, 1, 2, tempString);
    Serial.print("Temperatura: ");
    Serial.print(tempString);
    Serial.print(" °C");
    Serial.println("");
    client.publish("esp32/temperatura", tempString);

    h = sht31.readHumidity(); // Convertir la variable h de float a char
    char humString[8];
    dtostrf(h, 1, 2, humString);
    Serial.print("Humedad: ");
    Serial.print(humString);
    Serial.print(" %");
    Serial.println("");
    delay(1000);
    client.publish("esp32/humedad", humString);

    digitalWrite(Trigger, HIGH);
    delayMicroseconds(10); // Enviamos un pulso de 10us
    digitalWrite(Trigger, LOW);

    time = pulseIn(Echo, HIGH); // Obtenemos el ancho del pulso
    distance = time * 0.034 / 2;

    char distanceString[8];
    dtostrf(distance, 1, 2, distanceString);
    Serial.print("Distancia: ");
    Serial.print(distanceString);
    Serial.print(" cm");
    Serial.println("");
    delay(1000);
    client.publish("esp32/distancia", distanceString);
  }
}
