// index.js

import '@shopify/shopify-api/adapters/node';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import express from 'express';
import dotenv from 'dotenv';
import ngrok from '@ngrok/ngrok'; // Import ngrok

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Default port

// Initialize Shopify API
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ['read_products'],
  hostName: '8d47-106-51-87-194.ngrok-free.app', // Update this if you want to use the dynamic ngrok URL
  apiVersion: LATEST_API_VERSION,
});

// Step 1: Start the OAuth process
app.get('/auth', async (req, res) => {
  const shop = req.query.shop;

  if (!shop) {
    return res.status(400).send('Missing shop parameter.');
  }

  const authRoute = await shopify.auth.beginAuth(req, res, shop, '/auth/callback', false);
  return res.redirect(authRoute);
});

// Step 2: Handle the callback after authentication
app.get('/auth/callback', async (req, res) => {
  try {
    const session = await shopify.auth.validateAuthCallback(req, res, req.query);
    console.log('Access token:', session.accessToken);

    // Redirect to your app's main functionality or dashboard
    res.redirect(`https://${session.shop}/admin/apps`);
  } catch (error) {
    console.error('Failed to complete OAuth process:', error);
    res.status(500).send('OAuth process failed.');
  }
});

// Start the server and connect ngrok
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Connect ngrok and log the URL
  const ngrokUrl = await ngrok.connect(PORT);
  console.log(`Ngrok tunnel established at: ${ngrokUrl}`);
});
