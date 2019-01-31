variable "aws_region" {
  description = "The AWS region to create things in."
  default     = "us-west-2"
}

variable "access_key" {
  description = "User access key"
  default = "*********"
}

 variable "secret_key" {
  description = "User secret key"
  default ="*********"
}

variable "aws_account_id" {
  description = "AWS account ID"
  default = "********"
}

variable "az_count" {
  description = "Number of AZs to cover in a given AWS region"
  default     = "2"
}

variable "app_image" {
  description = "Docker image to run in the ECS cluster"
  default     = "masherrr/node-sessions"
}

variable "app_port" {
  description = "Port exposed by the docker image to redirect traffic to"
  default     = 3000
}

variable "app_count" {
  description = "Number of docker containers to run"
  default     = 2
}

variable "fargate_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = "256"
}

variable "fargate_memory" {
  description = "Fargate instance memory to provision (in MiB)"
  default     = "512"
}
