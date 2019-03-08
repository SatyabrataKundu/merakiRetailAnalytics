package com.psl.mqtt.client.PahoClient;

import java.util.HashMap;
import java.util.Map;

import com.psl.mqtt.client.ApparelSubscriber;
import com.psl.mqtt.client.CheckOut1Subscriber;
import com.psl.mqtt.client.CheckOut2Subscriber;
import com.psl.mqtt.client.EntranceSubscriber;
import com.psl.mqtt.client.GrocerySubscriber;
import com.psl.mqtt.client.KidsSubscriber;
import com.psl.mqtt.client.WaitingSubscriber;

/**
 * Hello world!
 *
 */
public class App {
	public static Map<String, Long> zoneMapping = null;

	public static void main(String args[]) throws Exception {
		System.out.println("Starting Subscribers.");

		zoneMapping = new HashMap<String, Long>();
		zoneMapping.put("/merakimv/Q2GV-H7PZ-DBWW/668784544664518704", 668784544664518704L);
		zoneMapping.put("/merakimv/Q2GV-H7PZ-DBWW/668784544664518706", 668784544664518706L);
		zoneMapping.put("/merakimv/Q2GV-H7PZ-DBWW/668784544664518707", 668784544664518707L);
		zoneMapping.put("/merakimv/Q2GV-H7PZ-DBWW/668784544664518708", 668784544664518708L);
		zoneMapping.put("/merakimv/Q2GV-H7PZ-DBWW/668784544664518705", 668784544664518705L);
		zoneMapping.put("/merakimv/Q2GV-H7PZ-DBWW/668784544664518709", 668784544664518709L);
		zoneMapping.put("/merakimv/Q2GV-H7PZ-DBWW/668784544664518711", 668784544664518711L);

		ApparelSubscriber apparelSubscriber = new ApparelSubscriber();
		CheckOut1Subscriber checkOut1Subscriber = new CheckOut1Subscriber();
		CheckOut2Subscriber checkOut2Subscriber = new CheckOut2Subscriber();
		EntranceSubscriber entranceSubscriber = new EntranceSubscriber();
		GrocerySubscriber grocerySubscriber = new GrocerySubscriber();
		KidsSubscriber kidsSubscriber = new KidsSubscriber();
		WaitingSubscriber waitingSubscriber = new WaitingSubscriber();

		apparelSubscriber.start();
		checkOut1Subscriber.start();
		checkOut2Subscriber.start();
		entranceSubscriber.start();
		grocerySubscriber.start();
		kidsSubscriber.start();
		waitingSubscriber.start();
	}
}
