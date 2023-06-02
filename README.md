# Instance setup
sudo apt -y update
sudo apt -y install nano
sudo apt -y install git

# Set up git pull refresh
git clone https://github.com/arestrepo99/mario.js.git

crontab -e
# add to this file to run every 5 minutes
*/5 * * * * cd ~/mario.js && git pull



// Nginx Server Setup
To set up a production-ready single-page HTTP server on the cloud using Nginx, you can follow these steps:

1. **Install Nginx:** Start by installing Nginx on your Ubuntu instance. Run the following commands:

```

sudo apt -y install nginx

```

2. **Configure Nginx:** Next, you'll need to configure Nginx to serve your single-page app. Open the default Nginx configuration file:

```
sudo nano /etc/nginx/sites-available/default
```

# DELETE THE FILE FOR EASIER WRITING
```
echo "" > /etc/nginx/sites-available/default
```

Inside the file, remove the existing content and replace it with the following configuration:

```


server {
    listen 80 default_server;
    listen [::]:80 default_server;

	 server_name mario.arec.me;

    root /home/ubuntu/mario.js;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

sudo nginx -s reload

Replace `/path/to/your/app` with the actual path to your app's source code directory.

3. **Test the Configuration:** Save the changes and exit the editor. Then, test the Nginx configuration to ensure it doesn't have any syntax errors:

```
sudo nginx -t
```

If the test is successful, you should see a message indicating that the configuration file syntax is okay.

4. **Start Nginx:** Once the configuration is valid, start Nginx:

```
sudo systemctl start nginx
```

5. **Enable Auto-Start:** If you want Nginx to automatically start at boot, run the following command:

```
sudo systemctl enable nginx

```

6. **Enable Auto-Start:** 

# Modify iptables
```
iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
```

