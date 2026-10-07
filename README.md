# MOTION+SWAGG STORE — v2

This is a real-store starter: product catalog + sizes + cart + customer/delivery form + server-side Flutterwave transaction initialization.

## Important
Do not put a Flutterwave secret key in the browser. The secret key belongs only on the server. Flutterwave's current docs say transaction initialization should happen from your backend and secret keys must be stored securely.

For a real launch, have a parent/guardian or other authorized adult/business owner handle the payment account, business details, bank account, domain ownership, and live payment keys.

## Run locally
1. Install Node.js 18+.
2. Copy `.env.example` to `.env`.
3. Put a Flutterwave TEST secret key in `.env`.
4. Run `npm start`.
5. Open http://localhost:3000
6. Use Flutterwave test mode while developing.

## Go live
- Replace the test key with the live secret key on a secure hosting platform's environment variables.
- Never commit `.env`.
- Add a production database instead of `orders.json`.
- Add Flutterwave webhook handling and verify every successful payment before marking an order as paid.
- Add stock management, shipping rates, returns/refunds, privacy policy and terms.
- Add the real Motion+Swagg product photos and exact prices.

## Payment
The checkout redirects customers to Flutterwave. Flutterwave supports Nigerian payment channels including cards, bank and transfer options depending on account configuration.

Official docs:
https://paystack.com/docs/payments/accept-payments/
https://paystack.com/docs/developer-tools/inlinejs/


## Flutterwave setup
1. Copy `.env.example` to `.env`.
2. Enter your Flutterwave credentials in `.env`.
3. Use TEST credentials while developing.
4. Keep `FLW_SECRET_KEY` on the server only.
5. After testing, use your LIVE credentials when the account is approved.
