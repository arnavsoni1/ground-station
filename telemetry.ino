#include<math.h>
void setup() {
  Serial.begin(115200);
}

void loop() {
  float altitude = random(0,100);
  float velocity = random(0,100);
  float temperature = random(0,100);
  float pressure = random(0,100);
  float accelerate_x = random(0,100);
  float accelerate_y = random(0,100);
  float accelerate_z = random(0,100);
  float gyro_x = random(0,100);
  float gyro_y = random(0,100);
  float gyro_z = random(0,100);

  Serial.printf("%.1f,%.1f,%.1f,%.1f,%.1f,%.1f,%.1f,%.1f,%.1f,%.1f\n", altitude, velocity, temperature, pressure, accelerate_x, accelerate_y, accelerate_z, gyro_x, gyro_y, gyro_z);
  delay(1000);
}
