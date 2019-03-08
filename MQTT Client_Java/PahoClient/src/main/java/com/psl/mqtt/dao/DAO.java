package com.psl.mqtt.dao;

import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;

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

	public void run() {
		JSONObject counts = new JSONObject(json.get("counts").toString());
		if (counts.getInt("person") > 0) {
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
				preparedStatement.setInt(2, counts.getInt("person"));
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
				System.out.println("Data dumped for zone_id " + zoneId);
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
}
