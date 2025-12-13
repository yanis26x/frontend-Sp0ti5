resource "aws_vpc" "app_vpc" {
  cidr_block = var.vpc_cidr

  tags = {
    Name = "app-VPC"
  }
}

variable "vpc_cidr" {
  type        = string
  description = "VPC Address Group"
  default     = "10.0.0.0/16"
}
