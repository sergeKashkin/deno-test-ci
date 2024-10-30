resource "aws_ecr_lifecycle_policy" "ecr_policy" {
  repository = aws_ecr_repository.app_repo.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description   = "Let's keep up to 10 latest images"
        selection = {
          countType   = "imageCountMoreThan"
          countNumber = 10
          tagStatus   = "tagged"
          "tagPrefixList": ["backend-latest", "frontend-latest"],
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}