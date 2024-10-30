output "ec2_instance_id" {
  value = module.ec2_instance.instance_id
}

output "ec2_public_ip" {
  value = module.ec2_instance.instance_public_ip
}

output "ecr_repo_url" {
  value = module.ecr_repo.app_repo_url
}