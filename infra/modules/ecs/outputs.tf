output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "ecs_security_group_id" {
  value = aws_security_group.ecs.id
}

output "cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "service_name" {
  value = aws_ecs_service.app.name
}
