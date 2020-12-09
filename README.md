# Node-ElasticSearch
Simple app using Node js with Elastic Search
it uses Elastic search in Docker image.

## install docker if not installed
-   [get docker here](https://docs.docker.com/get-docker/)

## to get Docker image for elastic search
-   `sudo docker pull elasticsearch:7.9.3`
-   if above command does not work try
-   `sudo docker pull docker.elastic.co/elasticsearch/elasticsearch:7.9.3`

## to run elastic search in docker first time
-   `sudo docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.9.3`

## next time if you stop the container or shut down the computer then next time just start container as follows 
-   `sudo docker start --interactive priceless_sinoussi`
*priceless_sinoussi* was the name automatically given to docker container  when it was created


## to run the postgreSQL in docker container
-   `sudo docker run -i -e POSTGRES_PASSWORD=pg --name pg_container postgres`

## if you want to access postgres and create DB & tables
-   `sudo docker exec -it pg_container bash`
-   then when inside the container you can run psql so that you can execute SQL as shown below.
-   `root@35b5d78742b0:/# psql -U postgres`
-   to create database run as follows. My db name is ums which stands for user management system.
-   your db name could be something different as per your need.
-   `postgres=# CREATE DATABASE ums;`
-   connect to new db as follows
-   `postgres=# \c ums`
    after above command your terminal will show *ums=#*  
-   after that run below sql to create users table
-   `CREATE TABLE users(id serial PRIMARY KEY, name VARCHAR (255) NOT NULL, twitter_link VARCHAR (255), linkedin_url VARCHAR (255), blog_URL VARCHAR (255), password VARCHAR(20) NOT NULL, email VARCHAR(50) NOT NULL UNIQUE);`
-   next run insert sql to add 1 user as follows.
-   `insert into users(name,twitter_link,password,email) values('Tom Doe','twitter.com/doe','1234','tom@gmail.com');`
-   use select command to list this user as follows
-   `select * from users;`



## steps to run the app locally
-   `npm install`
-   `node app.js`
-   `visit localhost:3000`



docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.8.13

-------------------------------------------------
build web
sudo docker build -t node_image .

web
for pg_container
sudo docker run --publish 8000:8080 --name=node_container --link=pg_container:database --interactive node_image /bin/bash

with env variables
sudo docker run --publish 8000:8080 --env dbuser=postgres --env dbhost=database --env database=ums --env dbpassword=pg --env dbport=5432 --name=node_container --link=pg_container:database --interactive node_image /bin/bash


-------------------------------------------------------------------------
run web server app.js
sudo docker exec -it node_container node /usr/src/app/app.js

-----------------------------------------------------------------------------


run in dev mode
dbuser=postgres  dbhost=172.17.0.2  database=ums  dbpassword=pg  dbport=5432 node app.js 
if you restart docker containers then dbhost IP will change so find the IP using command 
sudo docker exec -it node_container cat /etc/hosts





//below code is commented for time being later on this feature can be added
//run createDb and users table migration before starting web server 
// createDb.create((status)=>{
// 	if(status==true){
// 		console.log('DB ready');
// 		tablesMigrate.addUsersTable(function(status){
// 			if(status==true){
// 				console.log('users table ready')
// 				app.listen(PORT, () => {
// 				    console.log(`The web server has started on port ${PORT}`);
// 				});
// 			}
// 		})

// 	}else{
// 		console.log('Problem connecting to DB')
// 	}
// })





