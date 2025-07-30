'use client'
import { useUser } from '@clerk/nextjs';
import { clerkClient, EmailAddress } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import Form from 'next/form'


export default function ProfileUpdateForm(){
  const { user } = useUser();
  const handleAddEmail = async (email:string) => {
    if (user) {
      try {
        const newEmailAddress = await user.createEmailAddress({
          email: email,
        });

        console.log('New email address created:', newEmailAddress);
      } catch (error) {
        console.error('Error creating email address:', error);
      }
    }
  };
  function printer(formData:FormData,) {
    const data = {
        userName: formData.get('userName') as string,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        newEmail: formData.get('email') as string,
      };
    user?.update({lastName:data.lastName,firstName:data.firstName,username:data.userName})
    
    if (user && user.primaryEmailAddress?.emailAddress !== data.newEmail) {
      console.log("Creating new email...");
      handleAddEmail(data.newEmail)
      console.log(user.emailAddresses)
      
    }   
      
    
    console.log(data)
  }

  


  return (
    <Form action={printer}>
        <div className="space-y-6">
          
            <label className="block text-sm font-bold text-outer_space-500 dark:text-platinum-500 mb-2">
                Full Name
            </label>
            <div  className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name='firstName'
                  defaultValue={user?.firstName || "Undefined"}
                  className="w-full px-3 py-2 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name='lastName'
                  defaultValue={user?.lastName || "Undefined"}
                  className="w-full px-3 py-2 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-2">
                User Name
              </label>
              <input
                type="text"
                name='userName'
                defaultValue={user?.username || "Undefined"}
                className="w-full px-3 py-2 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name='email'
                defaultValue={user?.primaryEmailAddress?.emailAddress || "Undefined"}
                className="w-full px-3 py-2 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-2">Role</label>
              <select className="w-full px-3 py-2 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500">
                <option>Project Manager</option>
                <option>Developer</option>
                <option>Designer</option>
                <option>QA Engineer</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button className="px-4 py-2 text-payne's_gray-500 dark:text-french_gray-400 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue_munsell-500 text-white rounded-lg hover:bg-blue_munsell-600 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
    

    </Form>
  )
}