import Profile from "../models/profile.mjs";
import { connect } from 'amqplib';

const getProfile = async (userData) => {
    try {
      let userProfile = await Profile.findOne({ userId: userData.userId });
  
      if (userProfile) {
        Object.assign(userProfile, userData);
        await userProfile.save();
      } else {
        userProfile = new Profile(userData);
        await userProfile.save();
      }
      
      return userProfile;
    } catch (error) {
      console.error("Error fetching/updating user profile:", error);
      throw error;  // or handle the error as needed
    }
  };

export const listenForAuthRequests = async () => {
  const connection = await connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue("get_ride_profile_create_user");

  channel.consume("get_ride_user_profile", async (msg) => {
    const userData = JSON.parse(msg.content.toString());

    const userProfile = await getProfile(userData);

    channel.sendToQueue(
      msg.properties.replyTo,
      Buffer.from(
        JSON.stringify({
          userId: userData.userId,
          userProfile: userProfile,
        })
      ),
      {
        correlationId: msg.properties.correlationId,
      }
    );

    channel.ack(msg);
  });
};
