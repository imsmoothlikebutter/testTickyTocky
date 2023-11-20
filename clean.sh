docker stop $(docker container ls -aq)
docker rm $(docker container ls -aq)
docker rmi $(docker images -q)