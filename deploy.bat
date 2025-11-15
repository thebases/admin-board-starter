ssh base_40  "rm -rf  /var/www/html/qr.thebase.vn"  
scp -r .\dist base_40:/var/www/html/
ssh base_40 "cd /var/www/html && mv ./dist qr.thebase.vn"

