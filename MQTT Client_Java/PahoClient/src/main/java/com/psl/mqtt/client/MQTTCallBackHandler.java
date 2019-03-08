package com.psl.mqtt.client;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.json.JSONObject;

import com.psl.mqtt.client.PahoClient.App;
import com.psl.mqtt.dao.DAO;

public class MQTTCallBackHandler implements MqttCallback {

	public void connectionLost(Throwable cause) {
		// TODO Auto-generated method stub

	}

	public void messageArrived(String topic, MqttMessage message) throws Exception {
		// TODO Auto-generated method stub

		System.out.println("Topic " + topic);
		System.out.println(message.toString());
		JSONObject data = new JSONObject(message.toString());
		Runnable runnable = new DAO(data, App.zoneMapping.get(topic));
		Thread th = new Thread(runnable);
		th.start();
	}

	public void deliveryComplete(IMqttDeliveryToken token) {
		// TODO Auto-generated method stub

	}

}
