# NGINX Configuration for WebSocket Support

This directory contains NGINX configuration files for the Fingers Challenge application to properly support WebSocket connections in production.

## Files

- `api.fingerschallenge.com.conf` - NGINX server configuration for the API server with WebSocket support

## Setup Instructions

1. **Copy the configuration file to your NGINX sites directory:**
   ```bash
   sudo cp api.fingerschallenge.com.conf /etc/nginx/sites-available/
   sudo ln -s /etc/nginx/sites-available/api.fingerschallenge.com.conf /etc/nginx/sites-enabled/
   ```

2. **Update SSL certificate paths in the configuration file:**
   - Replace `/path/to/your/ssl/certificate.crt` with your actual SSL certificate path
   - Replace `/path/to/your/ssl/private.key` with your actual SSL private key path

3. **Verify the server port matches your application:**
   - The configuration assumes the server runs on `localhost:4000`
   - Update the `proxy_pass` directives if your server runs on a different port

4. **Test the NGINX configuration:**
   ```bash
   sudo nginx -t
   ```

5. **Reload NGINX to apply changes:**
   ```bash
   sudo systemctl reload nginx
   ```

## Key Features

- **WebSocket Support**: Proper WebSocket headers and connection upgrades
- **SSL/TLS Termination**: HTTPS support with modern SSL settings
- **Extended Timeouts**: Longer timeouts for WebSocket connections
- **Buffer Optimization**: Disabled buffering for real-time communication
- **Security Headers**: Basic security headers for production use
- **Gzip Compression**: Compression for better performance
- **HTTP to HTTPS Redirect**: Automatic redirection to secure connections

## Troubleshooting

If WebSocket connections still fail after applying this configuration:

1. Check that your SSL certificates are valid and properly configured
2. Verify that the server is running on the expected port (4000 by default)
3. Ensure your firewall allows traffic on ports 80 and 443
4. Check NGINX error logs: `sudo tail -f /var/log/nginx/error.log`
5. Verify Socket.io client is configured with proper transports (WebSocket and polling)

## Testing WebSocket Connection

You can test the WebSocket connection using browser developer tools:

1. Open the application in a browser
2. Open Developer Tools → Network tab
3. Filter by "WS" (WebSocket) connections
4. Look for successful WebSocket handshake responses (status 101)