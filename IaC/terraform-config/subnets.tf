variable "public_subnet_cidrs" {
  type        = string
  description = "Public Subnet Address"
  default     = "10.0.0.0/24"
}

variable "private_subnet_cidrs" {
  type        = string
  description = "Private Subnet Address"
  default     = "10.0.1.0/24"
}

variable "azs" {
  type        = string
  description = "Availability Zone"
  default     = "us-east-1a"
}

resource "aws_subnet" "app_public_subnet" {
  vpc_id            = aws_vpc.app_vpc.id
  cidr_block        = var.public_subnet_cidrs
  availability_zone = var.azs

  tags = {
    Name = "app-PUBLIC-1"
  }
}

resource "aws_subnet" "app_private_subnets" {
  vpc_id            = aws_vpc.app_vpc.id
  cidr_block        = var.private_subnet_cidrs
  availability_zone = var.azs

  tags = {
    Name = "app-PRIVATE-1"
  }
}
