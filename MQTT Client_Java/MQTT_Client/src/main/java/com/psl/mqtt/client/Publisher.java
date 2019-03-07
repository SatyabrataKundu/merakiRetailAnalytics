package com.psl.mqtt.client;

import javax.jms.*;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;

public class Publisher {
	private static String url = "tcp://0.tcp.ngrok.io:10997";//ActiveMQConnection.DEFAULT_BROKER_URL;

	public static void main(String[] args) throws JMSException {

		ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(url);
		Connection connection = connectionFactory.createConnection();
		connection.start();

		// JMS messages are sent and received using a Session. We will
		// create here a non-transactional session object. If you want
		// to use transactions you should set the first parameter to 'true'
		Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);

		Topic topic = session.createTopic("testt");

		MessageProducer producer = session.createProducer(topic);

		// We will send a small text message saying 'Hello'

		TextMessage message = session.createTextMessage();

		message.setText(
				"{\"ts\":1551316231360,\"objects\":[{\"frame\":120119,\"oid\":4799,\"x0\":0.6,\"x1\":0.464,\"y0\":0.705,\"y1\":0.314},{\"frame\":120119,\"oid\":4800,\"x0\":0.679,\"x1\":0.597,\"y0\":0.623,\"y1\":0.251}]}\r\n"
						+ "");
		// Here we are sending the message!
		producer.send(message);
		System.out.println("Sent message '" + message.getText() + "'");

		connection.close();
	}
}
