package com.psl.mqtt.client;

import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;

import javax.jms.*;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.json.JSONArray;
import org.json.JSONObject;

public class Consumer {
	private static String url = ActiveMQConnection.DEFAULT_BROKER_URL;

	// Name of the topic from which we will receive messages from = " testt"

	public static void main(String[] args) throws JMSException {
		// Getting JMS connection from the server

		ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(url);
		Connection connection = connectionFactory.createConnection();

		// need to setClientID value, any string value you wish
		connection.setClientID("12345");

		try {
			connection.start();
		} catch (Exception e) {
			System.err.println("NOT CONNECTED!!!");
		}
		Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);

		Topic topic = session.createTopic("testt");

		// need to use createDurableSubscriber() method instead of createConsumer() for
		// topic
		// MessageConsumer consumer = session.createConsumer(topic);
		MessageConsumer consumer = session.createDurableSubscriber(topic, "SUB1234");

		MessageListener listner = new MessageListener() {
			public void onMessage(Message message) {
				try {
					if (message instanceof TextMessage) {
						TextMessage textMessage = (TextMessage) message;
						String messageString = textMessage.getText();
						System.out.println("Received message" + messageString + "'");
						JSONObject object = new JSONObject(messageString);
						Runnable runnable = new DAO(object);
						Thread thread = new Thread(runnable);
						thread.start();
					}
				} catch (JMSException e) {
					System.out.println("Caught:" + e);
					e.printStackTrace();
				}
			}
		};

		consumer.setMessageListener(listner);
		// connection.close();

	}

}

class DAO implements Runnable {
	private JSONObject json;

	public DAO(JSONObject json) {
		this.json = json;
	}

	public void run() {
		java.sql.Connection connection = null;
		try {
			Class.forName("org.postgresql.Driver");
			connection = DriverManager.getConnection("jdbc:postgresql://localhost:5432/merakidb", "postgres",
					"postgres");
			System.out.println("Connected to PostgreSQL database!");
			String insertTableSQL = "INSERT INTO meraki.camera_detections " + "(person_oid," + "zoneId," + "datetime, "
					+ "dateformat_date," + "dateformat_year, " + "dateformat_month," + "dateformat_week, "
					+ "dateformat_day, " + "dateformat_hour, " + "dateformat_minute)" + " VALUES (?,?,?,?,?,?,?,?,?,?)";
			JSONArray array = json.getJSONArray("objects");
			Date currentDate = new Date();
			Calendar cal = Calendar.getInstance();
			cal.setTime(currentDate);
			int week = cal.get(Calendar.WEEK_OF_YEAR);
			LocalDate localDate = currentDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
			int month = localDate.getMonthValue();
			for (Object data : array) {
				JSONObject obj = new JSONObject(data.toString());
				PreparedStatement preparedStatement = connection.prepareStatement(insertTableSQL);
				preparedStatement.setInt(1, obj.getInt("oid"));
				preparedStatement.setInt(2, obj.getInt("frame"));
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
			}
		} catch (Exception e) {
			e.printStackTrace();
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