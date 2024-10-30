output "app_repo_url" {
  value       = aws_ecr_repository.app_repo.repository_url
  description = "Container repository for both backend and frontend of the app"
}