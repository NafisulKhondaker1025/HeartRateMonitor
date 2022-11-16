void setup() {
  Serial.begin(9600);
  String type = "user";
  String username = "kg";
  String password = "123456789aA";
  String data = String::format("{ \"type\": \"%s\", \"username\": \"%s\", \"password\": \"%s\" }", type.c_str(), username.c_str(), password.c_str());
  // Trigger the integration
  Particle.publish("TestUserSignup", data, PRIVATE);
  // Wait 60 seconds
  Serial.println("Published");
}

void loop() {

}