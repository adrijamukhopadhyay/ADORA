# ADORA — Vercel-ready event management website

Responsive event discovery and registration website built with HTML, CSS and JavaScript.

## Files
- `index.html` — website markup and dialogs
- `styles.css` — responsive design, dark/lavender themes and effects
- `script.js` — event cards, search, filters, event details and registration
- `auth.js` — real Firebase Authentication integration
- `firebase-config.js` — your Firebase Web App configuration

## Important: activate real login before deployment
The login UI is connected to Firebase Authentication. It will not create accounts until you add your own Firebase Web App config.

1. Open https://console.firebase.google.com/ and create a Firebase project.
2. In Project settings → General → Your apps, add a Web app and copy its config.
3. Paste the values into `firebase-config.js`, replacing all `PASTE_...` placeholders.
4. In Firebase Console → Authentication → Get started → Sign-in method, enable:
   - Email/Password
   - Google
5. In Authentication → Settings → Authorized domains, add:
   - `localhost` (for local testing)
   - your deployed Vercel domain, e.g. `your-project.vercel.app`
   - your custom domain, if you connect one
6. Save all files and deploy/redeploy to Vercel.

## Deploy to Vercel
1. Put these files in the root of your project folder.
2. Push the folder to a GitHub repository.
3. In Vercel, choose Add New → Project and import that repository.
4. For this static HTML project, use the Other framework preset; leave Build Command and Output Directory empty/default (the project root).
5. Deploy. After adding Firebase authorized domains, redeploy if needed.

You can also deploy using Vercel CLI from the project folder:
`npx vercel`
then follow the prompts.

## How login works
- Sign Up creates a real Firebase Authentication user using email/password.
- Login authenticates an existing Firebase user.
- Continue with Google uses Google OAuth through Firebase.
- Firebase maintains the signed-in session and the header updates when the auth state changes.
- Clicking the account button while signed in offers logout.

## Security notes
- Firebase Web App config is intended to be included in client-side code. It is not a service-account secret.
- Never put a Firebase service-account private key in this frontend project.
- If you later store profiles, bookings or other private data in Firestore, configure strict Firebase Security Rules.
- Event registration currently remains a browser LocalStorage demo; it is not yet saved to a shared database or sent to an email inbox.


## Firestore event bookings (required for My Bookings)
Event registrations are saved in Cloud Firestore, scoped to the signed-in Firebase user. They now sync across devices when the same account is used.

1. In Firebase Console, open **Build → Firestore Database**.
2. Click **Create database** and choose a region close to your users.
3. Create the database.
4. Open **Firestore Database → Rules** and replace the rules with the following, then click **Publish**:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{bookingId} {
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
      allow read, delete: if request.auth != null
        && resource.data.userId == request.auth.uid;
      allow update: if false;
    }
  }
}
```

5. Redeploy the updated files to Vercel.
6. Sign in to ADORA before registering. Open **My Bookings** to see your saved registrations.

**Important:** Registrations saved by the old version in browser LocalStorage are not automatically migrated to Firestore. They remain in that browser's local storage and won't appear in the new account-based booking list.
