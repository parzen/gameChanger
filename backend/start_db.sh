# With local installation
#sudo systemctl start mongod
#sudo systemctl status mongod

# With docker
sudo docker run -d --name mongo-on-docker \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  mongo
