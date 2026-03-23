variable "project" {
  description = "Project name"
  type        = string
  default     = "bozarts"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-3" # Paris
}

# ─── Database ────────────────────────────────────────────────────────

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "bozarts"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "bozarts"
  sensitive   = true
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

# ─── Auth ────────────────────────────────────────────────────────────

variable "auth_secret" {
  description = "NextAuth secret"
  type        = string
  sensitive   = true
}

# ─── ECS ─────────────────────────────────────────────────────────────

variable "ecs_desired_count" {
  description = "Number of ECS tasks"
  type        = number
  default     = 1
}

variable "ecs_cpu" {
  description = "CPU units for ECS task (1 vCPU = 1024)"
  type        = number
  default     = 256
}

variable "ecs_memory" {
  description = "Memory in MB for ECS task"
  type        = number
  default     = 512
}
