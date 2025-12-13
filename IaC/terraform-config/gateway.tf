resource "aws_internet_gateway" "app_internet_gw" {
  vpc_id = aws_vpc.app_vpc.id

  tags = {
    Name = "app-INTERNET-GW"
  }
}
