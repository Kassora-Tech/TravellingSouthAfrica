# Cloud Functions for Email Notifications

This directory contains the Cloud Functions for sending email notifications when a new listing is submitted.

## Prerequisites

1.  **Firebase CLI**: Make sure you have the Firebase CLI installed (`npm install -g firebase-tools`).
2.  **SendGrid Account**: You need a SendGrid account and an API key.
3.  **Verified Sender**: You must have a verified sender email or domain in SendGrid. This function uses `notifications@travellingsouthafrica.co.za` as the `from` address.

## Configuration

These functions use a secret for the SendGrid API key. You must set this secret in your Firebase project before deploying.

1.  Enable the Secret Manager API for your Firebase project in the Google Cloud Console.
2.  Create the secret:
    ```bash
    echo "YOUR_SENDGRID_API_KEY" | gcloud secrets create SENDGRID_API_KEY --data-file=-
    ```
    Replace `YOUR_SENDGRID_API_KEY` with your actual key.
3.  Grant your project's Cloud Functions service account access to the secret. You can do this in the Google Cloud Console by navigating to the Secret Manager, selecting the `SENDGRID_API_KEY` secret, and adding the appropriate service account as a `Secret Manager Secret Accessor`. The service account will typically look like `service-PROJECT_NUMBER@gcp-sa-firebasemods.iam.gserviceaccount.com`.

## Deployment

1.  Navigate to the `functions` directory: `cd functions`
2.  Install dependencies: `npm install`
3.  Deploy the functions to Firebase:
    ```bash
    firebase deploy --only functions
    ```

After deployment, the functions will automatically trigger on new document creations in the `accommodations`, `restaurants`, `service_providers`, and `attractions` collections and send an email notification to the configured admin emails.
