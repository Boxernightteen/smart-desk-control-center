
/**
 * Helper script to update Capacitor configuration
 */
const fs = require('fs');
const path = require('path');

// Make sure the Android and iOS directories exist
try {
  if (!fs.existsSync('android') || !fs.existsSync('ios')) {
    console.log('\x1b[33m%s\x1b[0m', 'Please run the following commands to add platforms:');
    console.log('\x1b[36m%s\x1b[0m', '  npm run build');
    console.log('\x1b[36m%s\x1b[0m', '  npx cap add android');
    console.log('\x1b[36m%s\x1b[0m', '  npx cap add ios');
  } else {
    console.log('\x1b[32m%s\x1b[0m', 'All platforms are installed! Run the following to sync your web code:');
    console.log('\x1b[36m%s\x1b[0m', '  npm run build');
    console.log('\x1b[36m%s\x1b[0m', '  npx cap sync');
  }
} catch (err) {
  console.error('An error occurred while checking platforms:', err);
}

// Android splash screen resource directory
const androidResourceDir = path.join('android', 'app', 'src', 'main', 'res');

console.log('\x1b[32m%s\x1b[0m', '\nCapacitor setup complete!');
console.log('\x1b[33m%s\x1b[0m', 'To create an APK, you will need to:');
console.log('\x1b[36m%s\x1b[0m', '1. Export project to GitHub');
console.log('\x1b[36m%s\x1b[0m', '2. Clone it to your local machine');
console.log('\x1b[36m%s\x1b[0m', '3. Run: npm install');
console.log('\x1b[36m%s\x1b[0m', '4. Run: npm run build');
console.log('\x1b[36m%s\x1b[0m', '5. Run: npx cap add android');
console.log('\x1b[36m%s\x1b[0m', '6. Run: npx cap sync');
console.log('\x1b[36m%s\x1b[0m', '7. Run: npx cap open android');
console.log('\x1b[36m%s\x1b[0m', '8. Use Android Studio to build the APK');
