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
const char *topic3 = "ceres/sensor/distancia";
const char *topic6 = "ceres/sensor/planta/humedad-tierra";
const char *topic7 = "ceres/tanque/principal/estado";              // El estado del tanque principal es (...)
const char *topic8 = "ceres/tanque/auxiliar/estado";               // El estado del tanque auxiliar es (...)
const char *topic9 = "ceres/tanque/principal/volumen-total";       // La cantidad que soporta el tanque principal es (...) litros
const char *topic10 = "ceres/tanque/auxiliar/volumen-total";       // La cantidad que soporta el tanque auxiliar es (...) litros
const char *topic11 = "ceres/tanque/principal/volumen-liquido";    // La cantidad de liquido faltante en el interior del tanque principal es: (...) litros
const char *topic12 = "ceres/tanque/auxiliar/volumen-liquido";     // La cantidad de liquido faltante en el interior del tanque auxiliar es: (...) litros
const char *topic13 = "ceres/tanque/principal/porcentaje-liquido"; // El porcentaje que ocupa el liquido en el tanque principal es: (...) %
const char *topic14 = "ceres/tanque/auxiliar/porcentaje-liquido";  // El porcentaje que ocupa el liquido en el tanque auxiliar es: (...) %

// Tópicos a los que se suscribe
const char *topic4 = "ceres/led";
const char *topic5 = "ceres/slider";
const char *topic17 = "ceres/sliderr";

// Variables
long lastMsg = 0;
int value = 0;
const int ledPin = 2;
float t = 0;
float h = 0;
const int Trigger_one = 5; // Sensor ultrasónico tanque principal
const int Echo_one = 18;
/*
const int Trigger_two = 33; // Sensor ultrasónico tanque auxiliar
const int Echo_two = 32;
*/
const int sensor_humedad = 33;
int mp;

// Slider (PWM)
const int Pwm_pin = 13;
const int freq = 5000;
const int led_channel = 0;
const int resolution = 8;
// String slider_value = "0";

//-------------Bombas------------------
const int Bomba_Entrada = 15;
const int Bomba_Salida = 4;

// Pin indicadores Tanque N°1
const int led_low_one = 12;
const int led_middle_one = 14;
const int led_full_one = 27;

// Pin indicadores Tanque N°2
const int led_low_two = 1;
const int led_middle_two = 3;
const int led_full_two = 23;


// Datos de las bombas
float vc_one;
float vl_one;
float nc_one;
float nl_one;
float c_one;
float NTc_one;
float NTl_one;

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
    if ((messageTemp >= "18") && (messageTemp <= "20"))
    {
      digitalWrite(led_low_one, HIGH);
      digitalWrite(led_middle_one, LOW);
      digitalWrite(led_full_one, LOW);
      digitalWrite(Bomba_Entrada, LOW);
      digitalWrite(Bomba_Salida, HIGH);
      client.publish(topic15, "Nivel bajo");
    }

    if ((messageTemp >= "11") && (messageTemp <= "13"))
    {
      digitalWrite(led_low_one, LOW);
      digitalWrite(led_middle_one, HIGH);
      digitalWrite(led_full_one, LOW);
      client.publish(topic15, "Nivel medio");
    }

    if ((messageTemp >= "5") && (messageTemp <= "7"))
    {
      digitalWrite(led_low_one, LOW);
      digitalWrite(led_middle_one, LOW);
      digitalWrite(led_full_one, HIGH);
      digitalWrite(Bomba_Entrada, HIGH);
      digitalWrite(Bomba_Salida, LOW);
      client.publish(topic15, "Nivel alto");
    }
  }
  if (String(topic) == topic17)
  {
    if ((messageTemp >= "18") && (messageTemp <= "20"))
    {
      digitalWrite(led_low_two, HIGH);
      digitalWrite(led_middle_two, LOW);
      digitalWrite(led_full_two, LOW);
      digitalWrite(Bomba_Entrada, LOW);
      digitalWrite(Bomba_Salida, HIGH);
      client.publish(topic16, "Nivel bajo");
    }

    if ((messageTemp >= "11") && (messageTemp <= "13"))
    {
      digitalWrite(led_low_two, LOW);
      digitalWrite(led_middle_two, HIGH);
      digitalWrite(led_full_two, LOW);
      client.publish(topic16, "Nivel medio");
    }

    if ((messageTemp >= "5") && (messageTemp <= "7"))
    {
      digitalWrite(led_low_two, LOW);
      digitalWrite(led_middle_two, LOW);
      digitalWrite(led_full_two, HIGH);
      digitalWrite(Bomba_Entrada, HIGH);
      digitalWrite(Bomba_Salida, LOW);
      client.publish(topic16, "Nivel alto");
    }
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

  // Ultrasónicos
  pinMode(Trigger_one, OUTPUT);
  pinMode(Echo_one, INPUT);
  /*
  pinMode(Trigger_two, OUTPUT);
  pinMode(Echo_two, INPUT);
*/
  // Led del botón (dashboard)
  pinMode(ledPin, OUTPUT);

  // Bombas
  pinMode(Bomba_Entrada, OUTPUT);
  pinMode(Bomba_Salida, OUTPUT);

  // Leds indicadores del Tanque N°1
  pinMode(led_low_one, OUTPUT);
  pinMode(led_middle_one, OUTPUT);
  pinMode(led_full_one, OUTPUT);

  /* Leds indicadores del Tanque N°2
  pinMode(led_low_two, OUTPUT);
  pinMode(led_middle_two, OUTPUT);
  pinMode(led_full_two, OUTPUT);
*/
  // Slider (pwm)
  ledcSetup(led_channel, freq, resolution);
  ledcAttachPin(Pwm_pin, led_channel);
  // ledcWrite(led_channel, slider_value.toInt());

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
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
  long time_one;
  float distance_one;
  /*
    long time_two;
    float distance_two;
  */
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  long now = millis();
  if (now - lastMsg > 5000)
  {
    lastMsg = now;

    t = sht31.readTemperature();
    // Convertir la variable t de float a array char
    char tempString[8];
    dtostrf(t, 1, 2, tempString);
    Serial.print("Temperatura: ");
    Serial.print(tempString);
    Serial.print(" °C");
    Serial.println("");
    client.publish(topic1, tempString);

    h = sht31.readHumidity();
    // Convertir la variable h de float a array char
    char humString[8];
    dtostrf(h, 1, 2, humString);
    Serial.print("Humedad: ");
    Serial.print(humString);
    Serial.print(" %");
    Serial.println("");
    delay(1000);
    client.publish(topic2, humString);

    // Mapeo de la lectura análoga
    mp = analogRead(sensor_humedad);
    mp = map(mp, 4095, 0, 0, 100);

    // Convertir la variable mp de int a array char
    char mpString[8];
    dtostrf(mp, 1, 2, mpString);
    Serial.print("Humedad de la tierra: ");
    Serial.print(mpString);
    Serial.print(" %");
    Serial.println("");
    delay(1000);
    client.publish(topic6, mpString);

    // Ultrasónico Tanque N°1
    digitalWrite(Trigger_one, HIGH);
    delayMicroseconds(10); // Enviamos un pulso de 10us
    digitalWrite(Trigger_one, LOW);

    time_one = pulseIn(Echo_one, HIGH); // Obtenemos el ancho del pulso
    distance_one = time_one * 0.034 / 2;

    /* Ultrasónico Tanque N°2
    digitalWrite(Trigger_two, HIGH);
    delayMicroseconds(10); // Enviamos un pulso de 10us
    digitalWrite(Trigger_two, LOW);

    time_two = pulseIn(Echo_two, HIGH); // Obtenemos el ancho del pulso
    distance_two = time_two * 0.034 / 2;
*/
    // Convertir la variable distance_one de float a array char
    char distance_oneString[8];
    dtostrf(distance_one, 1, 2, distance_oneString);
    Serial.print("Distancia: ");
    Serial.print(distance_oneString);
    Serial.print(" cm");
    Serial.println("");
    delay(1000);
    client.publish(topic3, distance_oneString);

    /* Bombas (Tanque N°1)
    vc = 3146;                      // Volumen total en [cm]
    vl = vc / 1000;                 // Volumen total en [L]
    nc = vc - (121 * distance_one); // Volumen vacio en [cm]
    nl = nc / 1000;                 // Volumen vacio en [L]
    NTc = vc - nc;                  // Volumen que ocupa el líquido en [cm]
    NTl = vl - nl;                  // Volumen que ocupa el líquido en [L]
    c = (100 * nl) / (vl);          // Porcentaje de capacidad del tanque

    if ((distance_one > 18) && (distance_one < 20))
    {
      digitalWrite(led_low_one, HIGH);
      digitalWrite(led_middle_one, LOW);
      digitalWrite(led_full_one, LOW);
      digitalWrite(Bomba_Entrada, LOW);
      digitalWrite(Bomba_Salida, HIGH);
    }

    if ((distance_one > 11) && (distance_one < 13))
    {
      digitalWrite(led_low_one, LOW);
      digitalWrite(led_middle_one, HIGH);
      digitalWrite(led_full_one, LOW);
    }

    if ((distance_one > 5) && (distance_one < 7))
    {
      digitalWrite(led_low_one, HIGH);
      digitalWrite(led_middle_one, LOW);
      digitalWrite(led_full_one, LOW);
      digitalWrite(Bomba_Entrada, HIGH);
      digitalWrite(Bomba_Salida, LOW);
    }
*/
    /* Bombas (Tanque N°2)
    vc = 3146;                      // Volumen total en [cm]
    vl = vc / 1000;                 // Volumen total en [L]
    nc = vc - (121 * distance_two); // Volumen vacio en [cm]
    nl = nc / 1000;                 // Volumen vacio en [L]
    NTc = vc - nc;                  // Volumen que ocupa el líquido en [cm]
    NTl = vl - nl;                  // Volumen que ocupa el líquido en [L]
    c = (100 * nl) / (vl);

    if ((distance_two > 18) && (distance_two < 20))
    {
      digitalWrite(led_low_two, HIGH);
      digitalWrite(led_middle_two, LOW);
      digitalWrite(led_full_two, LOW);
      digitalWrite(Bomba_Entrada, LOW);
      digitalWrite(Bomba_Salida, HIGH);
    }

    if ((distance_two > 11) && (distance_two < 13))
    {
      digitalWrite(led_low_two, LOW);
      digitalWrite(led_middle_two, HIGH);
      digitalWrite(led_full_two, LOW);
    }

    if ((distance_two > 5) && (distance_two < 7))
    {
      digitalWrite(led_low_two, HIGH);
      digitalWrite(led_middle_two, LOW);
      digitalWrite(led_full_two, LOW);
      digitalWrite(Bomba_Entrada, HIGH);
      digitalWrite(Bomba_Salida, LOW);
    }
    */
  }
}
