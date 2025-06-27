#!/usr/bin/env node

/**
 * Manual verification script for WebSocket configuration
 * This script checks that the socket configuration includes the necessary transports
 */

const fs = require('fs');
const path = require('path');

const socketFile = path.join(__dirname, '../client/src/services/socket.ts');
const socketContent = fs.readFileSync(socketFile, 'utf8');

console.log('🔍 Verifying WebSocket configuration...\n');

// Check if transports are properly configured
const hasTransports = socketContent.includes('transports: ["websocket", "polling"]');
const noCommentedTransports = !socketContent.includes('// transports:');

if (hasTransports && noCommentedTransports) {
    console.log('✅ Socket configuration is correct:');
    console.log('   - Both WebSocket and polling transports are enabled');
    console.log('   - No commented transport configuration found');
    console.log('   - This allows graceful fallback when WebSocket connections fail\n');
} else {
    console.log('❌ Socket configuration issues found:');
    if (!hasTransports) {
        console.log('   - Missing transports configuration');
    }
    if (!noCommentedTransports) {
        console.log('   - Found commented transports line');
    }
    console.log('');
    process.exit(1);
}

// Check NGINX configuration exists
const nginxConfigPath = path.join(__dirname, '../nginx/api.fingerschallenge.com.conf');
const nginxReadmePath = path.join(__dirname, '../nginx/README.md');

if (fs.existsSync(nginxConfigPath) && fs.existsSync(nginxReadmePath)) {
    console.log('✅ NGINX configuration files are present:');
    console.log(`   - Configuration: ${nginxConfigPath}`);
    console.log(`   - Documentation: ${nginxReadmePath}\n`);

    const nginxContent = fs.readFileSync(nginxConfigPath, 'utf8');
    
    // Check for required WebSocket headers
    const hasUpgradeHeader = nginxContent.includes('proxy_set_header Upgrade $http_upgrade');
    const hasConnectionHeader = nginxContent.includes('proxy_set_header Connection "upgrade"');
    const hasExtendedTimeouts = nginxContent.includes('proxy_connect_timeout') && nginxContent.includes('proxy_read_timeout');
    
    if (hasUpgradeHeader && hasConnectionHeader && hasExtendedTimeouts) {
        console.log('✅ NGINX configuration includes required WebSocket features:');
        console.log('   - WebSocket upgrade headers');
        console.log('   - Connection upgrade handling');
        console.log('   - Extended timeouts for WebSocket connections\n');
    } else {
        console.log('❌ NGINX configuration missing required features:');
        if (!hasUpgradeHeader) console.log('   - Missing Upgrade header');
        if (!hasConnectionHeader) console.log('   - Missing Connection header');
        if (!hasExtendedTimeouts) console.log('   - Missing extended timeouts');
        process.exit(1);
    }
} else {
    console.log('❌ NGINX configuration files not found');
    process.exit(1);
}

console.log('🎉 All WebSocket configuration checks passed!');
console.log('\nNext steps for deployment:');
console.log('1. Deploy the updated client code with enabled transports');
console.log('2. Apply the NGINX configuration to your production server');
console.log('3. Test WebSocket connections in production environment');