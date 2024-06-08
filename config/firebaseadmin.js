const admin= require('firebase-admin');
require('dotenv').config({path:'.env.local'})
const serviceAccount= JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });

    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Failed to parse the service account key:', error);
  }
} else {
  console.error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
}

module.exports = admin;

