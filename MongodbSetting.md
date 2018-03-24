
Run the following commands to install MongoDB 3.6
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```
check the successful installation use
`mongo --version`

Then type `cd ~` to the root directory to create a `data` directory used for storing the data

If you wanna statr your MongoDB database, use `./mongod` command in the root directory 
and start a new terminal to run your js file to connect to the running database
