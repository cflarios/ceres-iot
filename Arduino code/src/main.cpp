// Librerías
#include <Arduino.h>
#include <SPI.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include "Adafruit_SHT31.h" //Librería sensor SHT31 (Importante cambiar si el sensor que usarás no es el SHT31)

Adafruit_SHT31 sht31 = Adafruit_SHT31();

WiFiClient espClient;
PubSubClient client(espClient);

// Credenciales de tu red Wi-Fi
const char *ssid = "YOUR_SSID";
const char *password = "YOUR_PASSWORD";

// Credenciales de tu servidor MQTT
const char *mqtt_server = "test.mosquitto.org";
const char *mqtt_username = "rw";
const char *mqtt_password = "readwrite";
const int mqtt_port = 1884;

// Tópicos que publica
const char *topic1 = "ceres/sensor/ambiente/temperatura";
const char *topic2 = "ceres/sensor/ambiente/humedad";
const char *topic3 = "ceres/sensor/planta/humedad-tierra";
const char *topic6 = "ceres/sensor/fotoresistencia/estado";
const char *topic7 = "ceres/sensor/fotoresistencia";
// Tópicos a los que se suscribe
const char *topic4 = "ceres/led";
const char *topic5 = "ceres/slider";

// Variables
long lastMsg = 0;
int value = 0;
const int ledPin = 2;
float temp = 0;
float hum = 0;
const int sensor_humedad = 33;
int mp;
int pinLDR = 34;
int valorLDR = 0; // Variable donde se almacena el valor del LDR

// Slider (PWM)
const int Pwm_pin = 13;
const int freq = 5000;
const int led_channel = 0;
const int resolution = 8;
String slider_value = "0";

void callback(char *topic, byte *message, unsigned int length)
{
  Serial.print("Llegó un mensaje del tópico: ");
  Serial.print(topic);
  Serial.print(". Mensaje: ");
  String messageTemp;

  for (int i = 0; i < length; i++)
  {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();

  if (String(topic) == topic4)
  {
    Serial.print("Cambiando la salida a:");
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
  if (String(topic) == topic5)
  {
    slider_value = messageTemp;
    ledcWrite(led_channel, slider_value.toInt());
  }

  Serial.println();
}

void setup_wifi()
{

  delay(10);
  // Conexión a tu red Wi-Fi
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

  // Led del botón (dashboard)
  pinMode(ledPin, OUTPUT);

  // Fotoresistencia
  pinMode(pinLDR, OUTPUT);

  // Slider (pwm)
  ledcSetup(led_channel, freq, resolution);
  ledcAttachPin(Pwm_pin, led_channel);
  ledcWrite(led_channel, slider_value.toInt());

  // Llamamos los otros voids
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  // Verificamos si el sensor SHT31 está bien conectado
  if (!sht31.begin(0x44))
  {
    Serial.println("No se pudo encontrar el SHT31");
    while (1)
      delay(1);
  }
}

void reconnect()
{
  // Loop hasta que se conecte
  while (!client.connected())
  {
    String client_id = "esp32-client-";
    client_id += String(WiFi.macAddress());
    Serial.print("Intentando conexión MQTT..");
    // Intento de reconección
    if (client.connect(client_id.c_str(), mqtt_username, mqtt_password))
    {
      Serial.println("¡conectado!");
      client.subscribe(topic4); // Subscripción al tópico del led
      client.subscribe(topic5); // Subscripción al tópico del slider (PWM)
    }
    else
    {
      Serial.print("falló, rc=");
      Serial.print(client.state());
      Serial.println(" intentar otra vez en 5 segundos");
      // Espera 5 segundos y vuelve a intentar
      delay(5000);
    }
  }
}

void loop()
{
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  long now = millis();
  if (now - lastMsg > 10000)
  {
    lastMsg = now;
    callback; // Esto es importante para realizar procesos en paralelo con la interacción en la Dashboard

    temp = sht31.readTemperature();
    // Convertir la variable t de float a array char
    char tempString[8];
    dtostrf(temp, 1, 2, tempString);
    Serial.print("Temperatura: ");
    Serial.print(tempString);
    Serial.print(" °C");
    Serial.println("");
    client.publish(topic1, tempString);

    hum = sht31.readHumidity();
    // Convertir la variable h de float a array char
    char humString[8];
    dtostrf(hum, 1, 2, humString);
    Serial.print("Humedad: ");
    Serial.print(humString);
    Serial.print(" %");
    Serial.println("");
    delay(1000);
    client.publish(topic2, humString);

    // Mapeo de la lectura análoga
    mp = analogRead(sensor_humedad);
    mp = map(mp, 4095, 0, 0, 100);

    // Mapeo de la lectura análoga
    valorLDR = analogRead(pinLDR);
    valorLDR = map(valorLDR, 4095, 0, 0, 100);

    if (valorLDR <= 20)
    {
      digitalWrite(ledPin, HIGH);
      Serial.print("El led se ha encendido");
      Serial.println("");
      client.publish(topic6, "Encendido");
    }

    if (valorLDR >= 21)
    {
      digitalWrite(ledPin, LOW);
      Serial.print("El led se ha apagado");
      Serial.println("");
      client.publish(topic6, "Apagado");
    }

    // Convertir la variable mp de int a array char
    char valorLDR_String[8];
    dtostrf(valorLDR, 1, 2, valorLDR_String);
    Serial.print("Porcentaje de luz: ");
    Serial.print(valorLDR_String);
    Serial.print(" %");
    Serial.println("");
    delay(1000);
    client.publish(topic7, valorLDR_String);

    // Convertir la variable mp de int a array char
    char mpString[8];
    dtostrf(mp, 1, 2, mpString);
    Serial.print("Humedad de la tierra: ");
    Serial.print(mpString);
    Serial.print(" %");
    Serial.println("");
    delay(1000);
    client.publish(topic3, mpString);
  }
}