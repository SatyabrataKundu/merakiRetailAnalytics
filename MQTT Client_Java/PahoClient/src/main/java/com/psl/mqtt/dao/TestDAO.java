package com.psl.mqtt.dao;

import org.json.JSONObject;

public class TestDAO {
	public static void main(String args[]) {
		JSONObject object=new JSONObject("{\"ts\":1552047690173, \"counts\":{\"person\":2}}");
		Runnable runnable =new DAO(object, 668784544664518704L);
		Thread th=new Thread(runnable);
		th.start();
	}
}
