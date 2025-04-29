
# Welcome to your Lovable project - Smart Desk Control Center

## Project info

**URL**: https://lovable.dev/projects/245ea7dc-4786-4197-baf4-9be547cfa169

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/245ea7dc-4786-4197-baf4-9be547cfa169) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Mobile App Development with Capacitor

This project is configured to be built as a mobile app using Capacitor. To create an Android APK or iOS app:

1. **Export to GitHub**: Click the GitHub button in Lovable interface
2. **Clone your repository**: `git clone <YOUR_REPO_URL>`
3. **Install dependencies**: `npm install`
4. **Build the web app**: `npm run build`
5. **Add mobile platforms**:
   - Android: `npx cap add android`
   - iOS: `npx cap add ios` (requires macOS)
6. **Sync web code to mobile**: `npx cap sync`
7. **Open in mobile IDE**:
   - Android: `npx cap open android`
   - iOS: `npx cap open ios`
8. **Build the app using Android Studio or Xcode**

**For Android APK**:
- In Android Studio, select `Build > Build Bundle(s) / APK(s) > Build APK(s)`
- The APK will be saved in `android/app/build/outputs/apk/debug/`

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Capacitor (for mobile)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/245ea7dc-4786-4197-baf4-9be547cfa169) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

