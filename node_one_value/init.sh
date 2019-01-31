APP="node-one-value"
REPO="your-account-id-here.dkr.ecr.us-west-2.amazonaws.com"

echo -e "\n \e[01;36m Step 1:\e[01;37m Prepare nodeJS env \e[0m"
npm init -y
npm install expres aws-sdk 

echo -e "\n \e[01;37m Step 2:\e[01;37m Docker build \e[0m"
docker build -t $APP .

echo -e "\n \e[01;37m Step 3:\e[01;37m Docker login \e[0m"
$(aws ecr get-login --no-include-email --region us-west-2)

echo -e "\n \e[01;37m Step 4:\e[01;37m Docker push \e[0m"
docker tag ${APP}:latest ${REPO}/${APP}:latest
docker push ${REPO}/${APP}:latest