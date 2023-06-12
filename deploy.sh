echo "Switching to branch master"
git checkout master

echo "Getting last update"
git pull origin master

echo "Building application"
npm run build

echo "Deploying to server"
scp -rpO -P 9011 dist/* farzad@45.156.184.209:/var/www/wil1i.ir