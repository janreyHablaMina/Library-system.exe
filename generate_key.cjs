// generate_key.js
// Run this script using Node.js to generate valid offline license keys
// Usage: node generate_key.js

function generateKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let payload = '';
    
    // Generate 10 random characters
    for(let i = 0; i < 10; i++) {
        payload += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Calculate checksum
    let sum = 0;
    for(let i = 0; i < payload.length; i++) {
        // Base 36 parsing converts letters to numbers
        let val = parseInt(payload[i], 36);
        // Multiply by position (1-indexed) to avoid anagram collisions
        sum += val * (i + 1);
    }
    
    // Format checksum as 2-character hex
    let checksum = (sum % 256).toString(16).toUpperCase().padStart(2, '0');
    
    // Combine to raw 15-character string
    let raw = "LIB" + payload + checksum;
    
    // Format into friendly chunks with hyphens
    let formattedKey = raw.substring(0, 3) + '-' + 
                       raw.substring(3, 7) + '-' + 
                       raw.substring(7, 11) + '-' + 
                       raw.substring(11, 15);
                       
    return formattedKey;
}

console.log("========================================");
console.log("   LIBRARY SYSTEM LICENSE GENERATOR     ");
console.log("========================================");
console.log("Here is a freshly generated license key:");
console.log();
console.log("   " + generateKey());
console.log();
console.log("Give this key to the client to unlock");
console.log("their application permanently.");
console.log("========================================");
