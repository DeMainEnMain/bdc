cd src/bdc/
#sudo pip3 install -r requirements.txt # To be done only once on a given system...
npm install
./node_modules/webpack/bin/webpack.js --config webpack.config.js --progress --colors
source ../../set_env.sh 
python3 manage.py runserver
firefox http://localhost:8000



