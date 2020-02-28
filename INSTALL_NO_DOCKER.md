sudo pip3 install -r requirements.txt
cd src/bdc/
npm install
./node_modules/webpack/bin/webpack.js --config webpack.config.js --progress --colors
source ../../set_env.sh 
python3 manage.py runserver
firefox http://localhost:8000



