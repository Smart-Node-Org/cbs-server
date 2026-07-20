for i in $*
do
rm -rf ~/atc/Keys/${i}.*
rm -rf /var/www/atc-edu.com/html/video/${i}/hls
done
