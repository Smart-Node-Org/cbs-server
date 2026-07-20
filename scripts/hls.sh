
openssl rand 16 > /root/atc/Keys/${1}.bin

echo "https://atc-edu.com/atc/get_hls" >  /root/atc/Keys/${1}.info
echo "/root/atc/Keys/${1}.bin" >>  /root/atc/Keys/${1}.info
openssl rand -hex 16 >>  /root/atc/Keys/${1}.info

mkdir /var/www/atc-edu.com/html/video/${1}/hls

~/bin/ffmpeg -hide_banner -y -i /var/www/atc-edu.com/html/video/${1}/video.mp4 \
  -vf scale=w=352:h=240:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_key_info_file ~/atc/Keys/${1}.info -hls_playlist_type vod  -b:v 500k -maxrate 800k -bufsize 700k -b:a 96k -hls_segment_filename /var/www/atc-edu.com/html/video/${1}/hls/240p_%03d.ts /var/www/atc-edu.com/html/video/${1}/hls/240p.m3u8 \
  -vf scale=w=640:h=360:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_key_info_file ~/atc/Keys/${1}.info -hls_playlist_type vod  -b:v 800k -maxrate 856k -bufsize 1200k -b:a 96k -hls_segment_filename /var/www/atc-edu.com/html/video/${1}/hls/360p_%03d.ts /var/www/atc-edu.com/html/video/${1}/hls/360p.m3u8 \
  -vf scale=w=842:h=480:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_key_info_file ~/atc/Keys/${1}.info -hls_playlist_type vod -b:v 1400k -maxrate 1498k -bufsize 2100k -b:a 128k -hls_segment_filename /var/www/atc-edu.com/html/video/${1}/hls/480p_%03d.ts /var/www/atc-edu.com/html/video/${1}/hls/480p.m3u8 \
  -vf scale=w=1280:h=720:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_key_info_file ~/atc/Keys/${1}.info -hls_playlist_type vod -b:v 2800k -maxrate 2996k -bufsize 4200k -b:a 128k -hls_segment_filename /var/www/atc-edu.com/html/video/${1}/hls/720p_%03d.ts /var/www/atc-edu.com/html/video/${1}/hls/720p.m3u8 \
  -vf scale=w=1920:h=1080:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_key_info_file ~/atc/Keys/${1}.info -hls_playlist_type vod -b:v 5000k -maxrate 5350k -bufsize 7500k -b:a 192k -hls_segment_filename /var/www/atc-edu.com/html/video/${1}/hls/1080p_%03d.ts /var/www/atc-edu.com/html/video/${1}/hls/1080p.m3u8 > ~/atc/server/scripts/test.txt

echo "#EXTM3U" >> /var/www/atc-edu.com/html/video/${1}/hls/playlist.m3u8
echo "#EXT-X-VERSION:3" >> /var/www/atc-edu.com/html/video/${1}/hls/playlist.m3u8
echo "#EXT-X-STREAM-INF:BANDWIDTH=500000,RESOLUTION=352x240" >> /var/www/atc-edu.com/html/video/${1}/hls/playlist.m3u8
echo "240p.m3u8" >> /var/www/atc-edu.com/html/video/${1}/hls/playlist.m3u8
echo "#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360" >> /var/www/atc-edu.com/html/video/${1}/hls/playlist.m3u8
echo "360p.m3u8" >> /var/www/atc-edu.com/html/video/${1}/hls/playlist.m3u8
echo "#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=842x480" >> /var/www/atc-edu.com/html/video/${1}/hls/playlist.m3u8
echo "480p.m3u8" >> /var/www/atc-edu.com/html/video/${1}/hls/playlist.m3u8
echo "#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720" >> /var/www/atc-edu.com/html/video/${1}/hls/playlist.m3u8
echo "720p.m3u8" >> /var/www/atc-edu.com/html/video/${1}/hls/playlist.m3u8
echo "#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080" >> /var/www/atc-edu.com/html/video/${1}/hls/playlist.m3u8
echo "1080p.m3u8" >> /var/www/atc-edu.com/html/video/${1}/hls/playlist.m3u8

ffmpeg -i /var/www/atc-edu.com/html/video/${1}/video.mp4 -filter:v scale="240:-1" -ss 00:00:33.000 -vframes 1 /var/www/atc-edu.com/html/video/${1}/thumbnail.png

rm /var/www/atc-edu.com/html/video/${1}/video.mp4 
