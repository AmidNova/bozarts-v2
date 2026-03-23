output "endpoint" {
  value     = aws_db_instance.main.endpoint
  sensitive = true
}

output "connection_string" {
  value     = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.main.endpoint}/${var.db_name}?schema=public"
  sensitive = true
}
