resource "aws_ecr_repository" "app_repo" {
  name                 = "deno-app-repo"
  image_tag_mutability = "MUTABLE"
  force_delete = true
  image_scanning_configuration {
    scan_on_push = false
  }

}