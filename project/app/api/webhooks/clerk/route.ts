import { verifyWebhook, } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import {headers} from 'next/headers'
import { createUser, deleteUser, updateUser } from '@/actions/user_actions'
import { UserCreator } from '@/types'

export async function POST(req: NextRequest) {
  const webhk_scrt=process.env.CLERK_WEBHOOK_SIGNING_SECRET
  if(!webhk_scrt)
    throw new Error('webhk_scrt not found')


  try {
 
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt)

    if (evt.type === 'user.created') {
      const primaryEmailId=evt.data.primary_email_address_id

      const primaryEmailObj = evt.data.email_addresses.find(
        (email) => email.id === primaryEmailId
      );

      const newUser: UserCreator = {
        clerkId: evt.data.id,              // Clerk ID
        email: primaryEmailObj?.email_address || "null", // get actual email
        userName: evt.data.username || "unnamed_user",
        first_name: evt.data.first_name || null,
        last_name: evt.data.last_name || null,
        avatar_url: evt.data.image_url || null,
      };

      //TODO Remove when not in Dev
      console.log("=====Creating User=====")
      console.log(newUser)

      try {
        const response = await createUser(newUser)
        console.log("User Create response:", response);
      } catch (error) {
        console.error("Failed to create user:", error);
      }
    }

    else if (evt.type=== 'user.updated'){

      const primaryEmailId=evt.data.primary_email_address_id

      const primaryEmailObj = evt.data.email_addresses.find(
        (email) => email.id === primaryEmailId
      );

      const updatedUserData: UserCreator = {
        clerkId: evt.data.id,              
        email: primaryEmailObj?.email_address || "null", 
        userName: evt.data.username || "unnamed_user",
        first_name: evt.data.first_name || null,
        last_name: evt.data.last_name || null,
        avatar_url: evt.data.image_url || null,
      };
      //TODO Remove when not in Dev
      console.log("=====Updating User=====")
      console.log(updatedUserData)
      try {
        const response = await updateUser(updatedUserData);
        console.log("User Update response:", response);
      } catch (error) {
        console.error("Failed to update user:", error);
      }

    }

    if (evt.type=== 'user.deleted'){
      const clerkID=evt.data.id;
       if (!clerkID) {
          console.error("Missing Clerk user ID in event.");
          return;
        }
      //TODO Remove when not in Dev
      console.log("=====Deleting User=====")
      console.log('userId:', evt.data.id)

      try {
        const response = await deleteUser(clerkID);
        console.log("User delete response:", response);
      } catch (error) {
        console.error("Failed to create user:", error);
      }
      
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}