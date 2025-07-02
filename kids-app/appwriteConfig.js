import { Client, Account, Avatars,Databases } from 'appwrite'; 

export const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') 
  .setProject('685e9ecb00217e7fdbef')

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);

console.log('✅ Appwrite SDK geladen:', typeof account.createEmailPasswordSession);