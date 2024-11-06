resource "aws_instance" "app_server" {
  ami           = "ami-010e55fe08af05fa7"
  instance_type = "t2.micro"

  vpc_security_group_ids = [aws_security_group.deno-test-sg.id]
  key_name               = var.key_name

  iam_instance_profile = aws_iam_instance_profile.ec2_instance_profile.name

  user_data = <<-EOF
    #!/bin/bash
    sudo apt update
    sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu  $(lsb_release -cs)  stable"
    sudo apt update
    sudo apt-get install docker-ce -y
    sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo groupadd docker
    sudo usermod -aG docker ubuntu

    sudo apt install awscli -y
  EOF
  user_data_replace_on_change = true

  tags = {
    Name = var.instance_name
  }
}