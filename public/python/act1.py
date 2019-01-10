import RPi.GPIO as GPIO
import time

# Turn a light on that uses a pushbutton switch to power on (instead of toggle)
# In order to simulate the switch, activate a relay for a short period of time

# GPIO pin used to provide signal to the relay
signalPin = 14

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)


GPIO.setup(signalPin, GPIO.OUT)

#Apply voltage out from signalPin
GPIO.output(signalPin, 1)

# sleep for 100ms to allow relay to change
time.sleep(0.1);

#Remove voltage from signalPin
GPIO.output(signalPin, 0)

#Cleanup
GPIO.setup(signalPin, GPIO.IN)
GPIO.cleanup()
