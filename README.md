# Node-ElasticSearch
Simple app using Node js with Elastic Search
it uses Elastic search in Docker image.

##to start Docker container for elastic search
- `sudo docker pull elasticsearch:7.9.3`
##to run elastic in docker
- `sudo docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.9.3`
## stepd to run the app
-   `npm install`
-   `node app.js`
-   `visit localhost:3000`



