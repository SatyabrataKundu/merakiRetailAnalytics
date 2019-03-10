package com.psl.mqtt.dao;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

import com.psl.mqtt.client.PahoClient.App;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import org.json.JSONObject;

public class DAO implements Runnable {
	private JSONObject json;
	private long zoneId;
	private java.sql.Connection connection = null;
	private final String insertTableSQL = "INSERT INTO meraki.realtime_mqtt_detections " + "(zone_id," + "entrances,"
			+ "datetime, " + "dateformat_date," + "dateformat_year, " + "dateformat_month," + "dateformat_week, "
			+ "dateformat_day, " + "dateformat_hour, " + "dateformat_minute)" + " VALUES (?,?,?,?,?,?,?,?,?,?)";

	public DAO(JSONObject json, long zoneId) {
		this.json = json;
		this.zoneId = zoneId;
	}

	private static class StreamGobbler implements Runnable {
		private InputStream inputStream;
		private Consumer<String> consumer;

		public StreamGobbler(InputStream inputStream, Consumer<String> consumer) {
			this.inputStream = inputStream;
			this.consumer = consumer;
		}

		@Override
		public void run() {
			new BufferedReader(new InputStreamReader(inputStream)).lines().forEach(consumer);
		}
	}
	
	public void light(String onOff)
	{
		ProcessBuilder builder = new ProcessBuilder();
		builder.command("python", "tplink_smartplug.py", "--target", "10.200.23.53", "--command", onOff);
		builder.directory(new File("/Users/vikatkar/PSL/tplink-smartplug"));
		Process process;
		try {
			lightIs = onOff;
			process = builder.start();

			StreamGobbler streamGobbler = new StreamGobbler(process.getInputStream(), null);
			Executors.newSingleThreadExecutor().submit(streamGobbler);
			int exitCode;
			exitCode = process.waitFor();
			assert exitCode == 0;
		} catch (InterruptedException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	private static final String ON = "on";
	private static final String OFF = "off";
	private static String lightIs = "";
	
	public void run() {
		JSONObject counts = new JSONObject(json.get("counts").toString());
		String zoneName = App.getZoneName(zoneId);
		long currentTime = System.currentTimeMillis();
		int peopleCount = counts.getInt("person");
		long diffTimeLong = currentTime - App.getPeopleUpdateTime(zoneId);
		int diffTime = (int)(diffTimeLong/1000);

		if (zoneName.equals("Checkout1")) {
			// If previous Count was 0 and Current count is greater than 0 then switch on
			// the light
			if (peopleCount > 0 && !lightIs.equals(ON))
			{
				System.out.println("CheckoutLight : current = "+ lightIs + " NEXT="+ON);
				light(ON);
			}
			// if previous count was > 0 and current count is 0 for last 50 seconds, light
			// goes off
			if( peopleCount == 0 && !lightIs.equals(OFF) && App.getPeopleCount(zoneId) == 0 && 
					diffTime > 10 ) {
				System.out.println("CheckoutLight : current = "+ lightIs + " NEXT="+OFF);
				light(OFF);
			}
		}
		
		if( App.getPeopleCount(zoneId) == peopleCount ) {
			//System.out.println("zoneName: "+zoneName +" : Not updating same count "+ peopleCount);
			return;
		}
		
		//If people count reduces than previous one, since it last increased 30 seconds ago then update it else dont
		if( peopleCount < App.getPeopleCount(zoneId) && diffTime < 5 ) {
			//System.out.println("zoneName: "+zoneName +" : Not REDUCING to "+ peopleCount +" will wait for 30 seconds " + diffTime);
			return;
		}

			App.setPeopleCount(zoneId,peopleCount);
			try {
				Class.forName("org.postgresql.Driver");
				connection = DriverManager.getConnection("jdbc:postgresql://localhost:5432/merakidb", "postgres",
						"postgres");
				Date currentDate = new Date();
				Calendar cal = Calendar.getInstance();
				cal.setTime(currentDate);
				int week = cal.get(Calendar.WEEK_OF_YEAR);
				LocalDate localDate = currentDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
				int month = localDate.getMonthValue();

				PreparedStatement preparedStatement = connection.prepareStatement(insertTableSQL);
				preparedStatement.setLong(1, zoneId);
				preparedStatement.setInt(2, peopleCount);
				preparedStatement.setLong(3, currentDate.getTime());
				preparedStatement.setString(4, new SimpleDateFormat("yyyy-MM-dd").format(currentDate));
				preparedStatement.setInt(5, cal.get(Calendar.YEAR));
				preparedStatement.setInt(6, month);
				preparedStatement.setInt(7, week);
				preparedStatement.setInt(8, cal.get(Calendar.DATE));
				preparedStatement.setInt(9, currentDate.getHours());
				preparedStatement.setInt(10, currentDate.getMinutes());
				// execute insert SQL stetement
				preparedStatement.executeUpdate();
				preparedStatement.close();
				System.out.println("Data updated:  " + zoneName + " : " + counts.getInt("person") +" : diffTime"+diffTime);
			} catch (Exception e) {
				// TODO: handle exception
			} finally {
				if (connection != null) {
					try {
						connection.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}

				}
			}

	}
}
