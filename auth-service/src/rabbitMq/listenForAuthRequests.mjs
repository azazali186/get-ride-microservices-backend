import amqp from "amqplib";
import Role from "../models/roles.mjs";
import User from "../models/user.mjs";
import Permission from "../models/permissions.mjs";

const authenticateUser = async (userData) => {
  let granted = false;

  const user = await User.findOne({
    where: { id: userData.userId },
    include: [
      {
        model: Role,
        include: [
          {
            model: Permission,
          },
        ],
      },
    ],
  });

  console.log("user ", user);
  let role = user?.role;
  let permissions = role?.permissions;

  let name = userData.route

  if (name.endsWith("-")) {
    name = name.slice(0, -1);
  }
  permissions.map((p) => {
    if (name == p.name) {
      granted = true;
    }
  });

  return granted;
};

export const listenForAuthRequests = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "authExchange";
  const queueName = "authQueue";
  const requestRoutingKey = "requestAuth";
  const responseRoutingKey = "responseAuth";

  await channel.assertExchange(exchange, "direct", { durable: false });
  const q = await channel.assertQueue(queueName, { exclusive: false });

  channel.bindQueue(q.queue, exchange, requestRoutingKey);
  console.log(" authExchange ");

  channel.consume(
    q.queue,
    (msg) => {
      const userData = JSON.parse(msg.content.toString());

      const isAuthenticated = authenticateUser(userData);

      channel.publish(
        exchange,
        responseRoutingKey,
        Buffer.from(
          JSON.stringify({
            userId: userData.userId,
            isAuthenticated,
          })
        )
      );
    },
    { noAck: true }
  );
};