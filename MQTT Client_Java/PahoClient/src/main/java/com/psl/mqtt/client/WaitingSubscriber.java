package com.psl.mqtt.client;

import org.eclipse.paho.client.mqttv3.MqttClient;

public class WaitingSubscriber {
	public void start() throws Exception {
		MqttClient client = new MqttClient("tcp://broker.hivemq.com:1883", MqttClient.generateClientId());
		client.setCallback(new MQTTCallBackHandler());
		client.connect();
		client.subscribe("/merakimv/Q2GV-H7PZ-DBWW/668784544664518708");
		System.out.println("Connected With Waiting Broker");
	}
}
