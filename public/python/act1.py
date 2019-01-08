import RPi.GPIO as GPIO
import time

signalPin = 14

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)


GPIO.setup(signalPin, GPIO.OUT)
GPIO.output(signalPin, 1)

# sleep for 100ms to allow relay to change
time.sleep(0.1);

GPIO.output(signalPin, 0)

GPIO.setup(signalPin, GPIO.IN)
GPIO.cleanup()
