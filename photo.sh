#!/bin/bash
ssh pi@172.30.0.3$1 'raspistill -o /tmpvid/cam/photo.jpg'
scp pi@172.30.0.3$1:/tmpvid/cam/photo.jpg ../sens-serv-web/static/photos/infDev$1.jpg
exit 0
