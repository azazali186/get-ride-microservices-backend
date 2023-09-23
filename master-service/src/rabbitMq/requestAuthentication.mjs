import amqp from 'amqplib';

export const requestAuthentication = async (userData) => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchange = 'authExchange';
    const requestRoutingKey = 'requestAuth';
    const responseRoutingKey = 'responseAuth';

    await channel.assertExchange(exchange, 'direct', { durable: false });

    channel.publish(exchange, requestRoutingKey, Buffer.from(JSON.stringify(userData)));

    // Listen for the response
    const q = await channel.assertQueue('', { exclusive: true });

    channel.bindQueue(q.queue, exchange, responseRoutingKey);

    channel.consume(q.queue, (msg) => {
        const response = JSON.parse(msg.content.toString());
        
        if (response.isAuthenticated) {
            console.log(`User ${response.userId} is authenticated.`);
        } else {
            console.log(`User ${response.userId} is not authenticated.`);
        }

        setTimeout(() => {
            connection.close();
        }, 500);
    }, { noAck: true });
}

/* const userData = {
    userId: '12345',
    route: 'validToken',
    token : 'token',
};

requestAuthentication(userData); */
