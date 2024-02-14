# First Time Setup

## Pre-requisites

- [backend repo](https://github.com/mackentish/budge-it-api) is running

1. Install dependencies (`npm install`)

```bash
npm install
```

2. Add .env variables to `.env.local` file based on `.env.sample`

   **ATTN:** You will need to set your `EXPO_PUBLIC_API_URL` value to the ngrok URL that you will get after setting up ngrok in the next step.

3. Set up and start [ngrok](https://ngrok.com) for local development (skip this step if you aren't planning to test the app on a real device). _This app uses ngrok to expose the local server to the internet so that we are able to test the app on a real device._

   - Install ngrok (see their docs for the command)
   - Authorize ngrok by running `ngrok config add-authtoken <your_auth_token>`
   - Add a static domain to your ngrok account (again, reference their docs)
   - Start ngrok, connecting it to the backend server

   ```bash
    ngrok http --domain=<YOUR_NGROK_DOMAIN> <API_PORT>
   ```

   Ex: `ngrok http --domain=jackal-adapting-jointly.ngrok-free.app 3001`

4. Start the app

Use this command if using ngrok:

```bash
npm run dev
```

Or use this command if not using ngrok:

```bash
npm start
```

5. Once the app is started you can either run the app on an emulator or on a real device by scanning the QR code.
