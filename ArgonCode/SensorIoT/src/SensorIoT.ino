//  SYSTEM_THREAD(ENABLED)

 #include <Wire.h>
 #include "MAX30105.h"
 #include "spo2_algorithm.h"


 MAX30105 particleSensor;

 #define MAX_BRIGHTNESS 255

 /////////////////////////////////////////////////////////////////// Variables declared for Database connection and offline functionality
 int startTime = -1; //initialize so that it runs by default, this is the time in 24 hour format after which device will ask user for data. it comes from database
 int endTime = 50;  //initialize so that it runs by default, this is the time in 24 hour format after which device will no longet ask for data. comes from the database
 int interval = 1;  //initialize so that it runs by default, this is time interval between each time user is asked to give data. comes from database
 double memoryHR[1000]; //array to store readings when offline
 double memorySPO2[1000]; //array to store readings when offline
 int i = 0; //array index
 String heartRateStr = "0.00"; //strings to send reading to database
 String spo2Str = "0.00";
 const pin_t GREEN_LED = D5; //green LED to indicate user to start taking reading
 const pin_t RED_LED = D4; //red led to indicate idle state

 

 ////////////////////////////////////////////////////////////////////////////// Variables obtained from external library to get heart rate and spo2
 uint32_t irBuffer[100]; //infrared LED sensor data
 uint32_t redBuffer[100];  //red LED sensor data

 int32_t bufferLength; //data length
 int32_t spo2; //SPO2 value
 int8_t validSPO2; //indicator to show if the SPO2 calculation is valid
 int32_t heartRate; //heart rate value
 int8_t validHeartRate; //indicator to show if the heart rate calculation is valid

 byte pulseLED = 11; //Must be on PWM pin
 byte readLED = 13; //Blinks with each data read

 void setup()
 {
   Serial.begin(115200); // initialize serial communication at 115200 bits per second:

   pinMode(pulseLED, OUTPUT);
   pinMode(readLED, OUTPUT);
   pinMode(GREEN_LED, OUTPUT);
   pinMode(RED_LED, OUTPUT);
  
    
   // Initialize sensor
   if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) //Use default I2C port, 400kHz speed
   {
     Serial.println(F("MAX30105 was not found. Please check wiring/power."));
     while (1);
   }

   // Serial.println(F("Attach sensor to finger with rubber band. Press any key to start conversion"));
   // while (Serial.available() == 0) ; //wait until user presses a key
   // Serial.read();

   byte ledBrightness = 60; //Options: 0=Off to 255=50mA
   byte sampleAverage = 4; //Options: 1, 2, 4, 8, 16, 32
   byte ledMode = 2; //Options: 1 = Red only, 2 = Red + IR, 3 = Red + IR + Green
   byte sampleRate = 100; //Options: 50, 100, 200, 400, 800, 1000, 1600, 3200
   int pulseWidth = 411; //Options: 69, 118, 215, 411
   int adcRange = 4096; //Options: 2048, 4096, 8192, 16384
   particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange); //Configure sensor with these settings
 }

 void loop()
 {

    // the current our of the day and compare with time window obtained from database
    int hour = Time.hour() - 7;
    if (hour < 0) {
        hour = 24 + hour;
    }
    
    //if current time is within time window then take data between set intervals
    if (hour >= startTime && hour <= endTime) {

      //To take readings for 20s after triggered 
      int start, end;
      double elapsed = 0;  // seconds
      start = Time.now();
      int terminate = 1;
      
      bufferLength = 100; //buffer length of 100 stores 4 seconds of samples running at 25sps

      //////////////////////////////////////// calibrate sensor before taking a reading
      //read the first 100 samples, and determine the signal range
      Serial.println("Calibrating");
      for (byte i = 0 ; i < bufferLength ; i++) {
        while (particleSensor.available() == false) //do we have new data?
          particleSensor.check(); //Check the sensor for new data

        redBuffer[i] = particleSensor.getRed();
        irBuffer[i] = particleSensor.getIR();
        particleSensor.nextSample(); //We're finished with this sample so move to next sample
      }
      Serial.println("Calibration done");

      //calculate heart rate and SpO2 after first 100 samples (first 4 seconds of samples)
      maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);

      //Continuously taking samples from MAX30102.  Heart rate and SpO2 are calculated every 1 second
      while (terminate) { //while loop runs for 20 seconds during which green light is on so user to place finger on sensor

        //turn on green led to take reading
        digitalWrite(GREEN_LED, HIGH);
        digitalWrite(RED_LED, LOW);

        end = Time.now();
        elapsed = end - start;
        if (elapsed >= 20.0 /* seconds */) { //after 20 seconds has passed either save data to database or save in onboard memory if not connected
          terminate = 0;

          if (Particle.connected() == true) { //if connected to database send all data to database with POST request
              //populate post request data
              String data = String::format("{ \"heartRate\": \"%s\", \"spo2\": \"%s\", \"timeStamp\": \"%s\" }", heartRateStr.c_str(), spo2Str.c_str(), String(Time.now()).c_str());
              // Trigger the integration
              //call webhook
              Particle.publish("SensorData", data, PRIVATE);
              Serial.println("\nPublished");
              //get response from server which will update starttime endtime and interval after every post call to see if user has changed settings
              Particle.subscribe("hook-response/SensorData", getConstraints);
              i = 0; //reset index so memory array is populated from 0 index again when offline since all data has been sent to database
          }
          else { //if not connected to database save data in onboard memory
              memoryHR[i] = heartRate;
              memorySPO2[i] = spo2;
              i++;
          }
          
          
          Serial.print(F(", HR="));
          Serial.print(heartRateStr.c_str());
          Serial.print(F(", SPO2="));
          Serial.print(spo2Str.c_str());
          
          // turn off green led and turn on red led to indicate user to stop placing finger and readings have been taken and exported
          digitalWrite(GREEN_LED, LOW);
          digitalWrite(RED_LED, HIGH);

          //delay for set interval// can be modified and set by user /physician and coems from database
          delay(interval * 60000);
        }

        else  {

          /////////////////////////////////////////////// takes readings code taken from library
          //dumping the first 25 sets of samples in the memory and shift the last 75 sets of samples to the top
          for (byte i = 25; i < 100; i++) {
            redBuffer[i - 25] = redBuffer[i];
            irBuffer[i - 25] = irBuffer[i];
          }

          //take 25 sets of samples before calculating the heart rate.
          for (byte i = 75; i < 100; i++) {
            while (particleSensor.available() == false) { //do we have new data? 
              particleSensor.check(); //Check the sensor for new data
            }

            digitalWrite(readLED, !digitalRead(readLED)); //Blink onboard LED with every data read

            redBuffer[i] = particleSensor.getRed();
            irBuffer[i] = particleSensor.getIR();
            particleSensor.nextSample(); //We're finished with this sample so move to next sample

            //when data is valid set to string to send to database
            if (validHeartRate == 1) {
              heartRateStr = String(heartRate).c_str();
            }
            if (validSPO2 == 1) {
              spo2Str = String(spo2).c_str();
            }

          }

          //After gathering 25 new samples recalculate HR and SP02
          maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);
        }
        Serial.println(elapsed);
      }
    }
 }

// handler to receive response from server
 void getConstraints(const char *event, const char *data) {
    Serial.println();
    Serial.println(data);
    startTime = ((int(data[14]) - 48) * 10) + ((int(data[15]) - 48) * 1);
    endTime = ((int(data[29]) - 48) * 10) + ((int(data[30]) - 48) * 1);
    interval = ((int(data[49]) - 48) * 10) + ((int(data[50]) - 48) * 1);
 }