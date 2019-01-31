# Task
Start Amazon ECS using a Terraform.
Create and deploy a NodeJS web-application which should return a counter of this page openings.

# Solution consideration
   - Google Analytics - solves the problem “out of the box”, but of course this is not that expected
   - Using “Amazon API Gateway” API for getting this value. 
   - Using of S3 Bucket. But it is obvious that working with files will be very slow.
   - Mount non persistent volume for Docker containers and store value there. The same verdict.
   - Using of the database. This looks like industrial standard for [3-Tier Architecture](https://www.jinfonet.com/resources/bi-defined/3-tier-architecture-complete-overview/), so will use this one. But implementation is still a question. Will try:
     - using a DynamoDB for storing only one value: “counter”. Need to read and update it on every page refresh. You can find the app in [node_one_value](https://github.com/KomissarMaria/nodejs_counterApp/tree/master/node_one_value) folder. Result: very slow (not surprisingly). Takes more than 500ms to read the updated value. 
     - create session records on every page refresh. Will store UUID, IP, DateTime and other fields. This should be very stable and fust. But to get the counter will need to COUNT the records in the table, which will not fast too. This is presented in [node_sessions](https://github.com/KomissarMaria/nodejs_counterApp/tree/master/node_sessions) folder. The result is: all PUT commands was successful (the test was making 1k curl, it tooks 2.5 seconds), but for most of COUNT I have received
          > 'The level of configured provisioned throughput for the table was exceeded. Consider increasing your provisioning level with the UpdateTable API.', code: 'ProvisionedThroughputExceededException'

          But after browser page refresh I have got exactly +1k value. 


# Terraform
[Terraform script](https://github.com/KomissarMaria/nodejs_counterApp/blob/master/terraform/main.tf) creates the infrastructure: 
1) VPC with IPv4 CIDR 10.0.0.0/16
2) 2 private subnet in two AZ
3) 2 public subnet in two AZ
4) 2 NAT with EIP (all traffic from private subnets will go to the internet through NAT)
5) IGW (all traffic from public subnets will go to the internet through IGW)
6) 2 route table (with routes: from private subnets to NAT and from public subnets to IGW)
7) Security groups (for Application Load Balancer, ECS)
8) Application load balancer, Target Groups, Listeners (all traffic to ECS cluster will go through ALB)
9) ECS Fargate (Task definition, Service) 
10) DynamoDb (for session recordings)

# Deployment
Update [init.sh](https://github.com/KomissarMaria/nodejs_counterApp/blob/master/node_sessions/init.sh) with your Repo URL and run it. Be sure that AWS CLI tool is installed and configured on your system.
```
$ ./init.sh
```
Change values “default” for variables “access key”, “secret_key”, “aws_account_id” to your Account ID, Access key, Secret key in [variables.tf](https://github.com/KomissarMaria/nodejs_counterApp/blob/master/terraform-script/variables.tf). 
```variable "access_key" {
  description = "User access key"
  default = "*****"
}

 variable "secret_key" {
  description = "User secret key"
  default = "*****"
}

variable "aws_account_id" {
  description = "AWS account ID"
  default = "*****"
}
```
 
Go to [terraform](https://github.com/KomissarMaria/nodejs_counterApp/tree/master/terraform) foler and run commands: 
``` 
$ terraform init
$ terraform plan
$ terraform apply
```
You will see the DNS name of Application Load Balancer as a result of the script execution. Use this URl in your browser. 

To remove all created items after the testing run command:
```
$ terraform destroy
```

# What could be improved
 - For high load system the combination of "node_one_value" and "node_sessions" could be used: adding a new record (which anyway will be needed for real system, I believe) and storing some COUNT value, which will be updated aside at some period (10 seconds). This will return estimated counter, which, possibly, is not critical. But this is not the exact answer for this task.
 - I have found that [Redis INCR](https://redis.io/commands/INCR) key could be used for this and have to handle high load much better. So, next step is to try this with Amazon ElastiCache.
 - Split main.tf to 3 modules: network, ecs, dynamodb. Call these modules in main.tf
 - Create an ECR and push Docker image for application to this repo from the TF script (not sure is this usefull)
