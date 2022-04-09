import paho.mqtt.client as mqtt
import time
import random
from datetime import datetime

user = "rw"
password = "readwrite"
topic1 ="esp32/temperatura"
topic2 ="esp32/humedad"
topic3 ="esp32/distancia"

# MQTT Parameters
broker="test.mosquitto.org" 
port = 1884         
keepalive = 60      # Maximum time [Sec] with Broker Communication

def on_connect(client, userdata, flags, rc):
    if rc==0:
        client.connected_flag=True #set flag
        print("connected OK")
    else:
        print("Bad connection Returned code=",rc)

def on_message(client, userdata, msg):
 #  print(msg.topic+" "+str(msg.payload))
    if(msg.topic == topic1):
        marco= "ºC"
    elif(msg.topic == topic2):
        marco= "%";
    else:
        marco = "cm"
    print(datetime.now().strftime("%H:%M:%S") + " - "+str(msg.payload)+ marco + " - " + msg.topic)

# Create Flags in class as Global Variables
mqtt.Client.connected_flag = False 
mqtt.Client.flag_end = False


client = mqtt.Client()  
client.on_connect = on_connect
client.on_message = on_message

# User Authentication
client.username_pw_set(user, password)

# Connect to MQTT Broker
client.connect(broker, port, keepalive)

# Action to realize
client.subscribe([(topic1,0),(topic2,1),(topic3,2)])


#client.tls_set()  # <--- even without arguments
if(client.flag_end==False):
    client.loop_forever()





