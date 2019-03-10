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
	public static Map<Long, String> zoneNameMapping = null;
	public static Map<Long, Integer> zonePeopleCount = null;
	public static Map<Long, Long> zonePeopleUpdateTime = null;

	public static void main(String args[]) throws Exception {
		System.out.println("Starting Subscribers.");
		
		zoneNameMapping = new HashMap<Long, String>();
		zoneNameMapping.put(668784544664518758L,"Checkout1");
		zoneNameMapping.put(668784544664518759L,"Exit");
		zoneNameMapping.put(668784544664518757L,"Enstrance");
		
		zonePeopleCount = new HashMap<>();
		zonePeopleCount.put(668784544664518758L,-1);
		zonePeopleCount.put(668784544664518759L,-1);
		zonePeopleCount.put(668784544664518757L,-1);		
		
		zonePeopleUpdateTime = new HashMap<>();
		zonePeopleUpdateTime.put(668784544664518758L,0L);
		zonePeopleUpdateTime.put(668784544664518759L,0L);
		zonePeopleUpdateTime.put(668784544664518757L,0L);	
		
		zoneMapping = new HashMap<String, Long>();
		zoneMapping.put("/merakimv/Q2GV-H7PZ-DBWW/668784544664518757", 668784544664518757L);
		zoneMapping.put("/merakimv/Q2GV-H7PZ-DBWW/668784544664518758", 668784544664518758L);
		zoneMapping.put("/merakimv/Q2GV-H7PZ-DBWW/668784544664518759", 668784544664518759L);
//		zoneMapping.put("/merakimv/Q2GV-H7PZ-DBWW/668784544664518708", 668784544664518708L);
//		zoneMapping.put("/merakimv/Q2GV-H7PZ-DBWW/668784544664518705", 668784544664518705L);
//		zoneMapping.put("/merakimv/Q2GV-H7PZ-DBWW/668784544664518709", 668784544664518709L);
//		zoneMapping.put("/merakimv/Q2GV-H7PZ-DBWW/668784544664518711", 668784544664518711L);

//		ApparelSubscriber apparelSubscriber = new ApparelSubscriber();
		CheckOut1Subscriber checkOut1Subscriber = new CheckOut1Subscriber();
		CheckOut2Subscriber exitZone = new CheckOut2Subscriber();
		EntranceSubscriber entranceSubscriber = new EntranceSubscriber();
//		GrocerySubscriber grocerySubscriber = new GrocerySubscriber();
//		KidsSubscriber kidsSubscriber = new KidsSubscriber();
//		WaitingSubscriber waitingSubscriber = new WaitingSubscriber();

//		apparelSubscriber.start();
		checkOut1Subscriber.start();
		exitZone.start();
		entranceSubscriber.start();
//		grocerySubscriber.start();
//		kidsSubscriber.start();
//		waitingSubscriber.start();
	}
	public static String getZoneName(long zoneId) {
		
		return zoneNameMapping.get(zoneId);			
	}
	
	public static int getPeopleCount(long zoneId) {
		return (int)zonePeopleCount.get(zoneId);
	}
	public static void setPeopleCount(long zoneId,int peopleCount) {
		zonePeopleCount.put(zoneId,peopleCount);
		App.setPeopleUpdateTime(zoneId,System.currentTimeMillis());
	}

	public static long getPeopleUpdateTime(long zoneId) {
		return zonePeopleUpdateTime.get(zoneId);
	}
	public static void setPeopleUpdateTime(long zoneId,long time) {
		zonePeopleUpdateTime.put(zoneId,time);
		
	}
	
}
