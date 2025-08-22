import { verifyWebhook, } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import {headers} from 'next/headers'
import { createUser, deleteUser, updateUser } from '@/actions/user_actions'

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
      const clerkID=evt.data.id;
      const userName= evt.data.username || "unnamed_user";
      const createdAt = new Date(evt.data.created_at);
      const primaryEmailId = evt.data.primary_email_address_id;

      const primaryEmailObj = evt.data.email_addresses.find(
        (email) => email.id===primaryEmailId
      );
      const email = primaryEmailObj?.email_address || "null";

      //TODO Remove when not in Dev
      console.log("=====Creating User=====")
      console.log('userId:', evt.data.id)
      console.log('userName:', evt.data.username)
      console.log('createdAt:', createdAt.toISOString());
      console.log("Primary Email:", email);
      try {
        const response = await createUser(clerkID,userName,email,createdAt)
        console.log("User Create response:", response);
      } catch (error) {
        console.error("Failed to create user:", error);
      }
    }

    if (evt.type=== 'user.updated'){
      const clerkID=evt.data.id;
      const userName= evt.data.username || "unnamed_user";
      const updatedAt = new Date(evt.data.updated_at);
      const primaryEmailId = evt.data.primary_email_address_id;

      const primaryEmailObj = evt.data.email_addresses.find(
        (email) => email.id===primaryEmailId
      );
      const email = primaryEmailObj?.email_address || "null";

      //TODO Remove when not in Dev
      console.log("=====Updating User=====")
      console.log('userId:', evt.data.id)
      console.log('userName:', evt.data.username)
      console.log('updatedAt:', updatedAt.toISOString());
      console.log("Primary Email:", email);
      try {
        const response = await updateUser(clerkID, userName, email, updatedAt);
        console.log("User Update response:", response);
      } catch (error) {
        console.error("Failed to create user:", error);
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