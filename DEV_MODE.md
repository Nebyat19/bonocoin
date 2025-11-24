# Development Mode

This app includes a development mode that allows you to test the application in a regular browser without needing Telegram.

## How to Enable

Development mode is automatically enabled when:
- Running in development (`npm run dev`)
- OR setting `NEXT_PUBLIC_DEV_MODE=true` in your `.env.local` file

## How It Works

1. **Mock Telegram WebApp**: When dev mode is enabled, a mock Telegram WebApp object is created that simulates the Telegram Mini App environment.

2. **Dev Auth Endpoint**: A special `/api/dev-auth` endpoint allows authentication without Telegram's `initData` verification.

3. **Automatic Login**: The app will automatically attempt to authenticate with a test user when you open it in a browser.

## Test User

The default test user is:
- **Telegram ID**: 123456789
- **Name**: Test User
- **Username**: testuser

## Usage

1. Make sure you're running in development mode:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. The app should automatically log you in as the test user

4. You can now test all functionality:
   - Buy coins
   - Send coins to creators
   - Create a creator profile
   - View transactions
   - etc.

## Notes

- Dev mode only works in development environment
- The mock Telegram WebApp is automatically initialized
- All database operations work normally (using Supabase)
- You can create real creator accounts and test the full flow

## Disabling Dev Mode

To disable dev mode, simply:
- Don't set `NEXT_PUBLIC_DEV_MODE` in your `.env.local`
- Or set it to `false`: `NEXT_PUBLIC_DEV_MODE=false`

