terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state — uncomment when ready
  # backend "s3" {
  #   bucket         = "bozarts-terraform-state"
  #   key            = "infra/terraform.tfstate"
  #   region         = "eu-west-3"
  #   dynamodb_table = "bozarts-terraform-locks"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "bozarts"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# ─── Networking ──────────────────────────────────────────────────────
module "networking" {
  source = "./modules/networking"

  project     = var.project
  environment = var.environment
  aws_region  = var.aws_region
}

# ─── ECR (Container Registry) ───────────────────────────────────────
module "ecr" {
  source = "./modules/ecr"

  project     = var.project
  environment = var.environment
}

# ─── RDS (PostgreSQL) ───────────────────────────────────────────────
module "rds" {
  source = "./modules/rds"

  project            = var.project
  environment        = var.environment
  vpc_id             = module.networking.vpc_id
  private_subnet_ids = module.networking.private_subnet_ids
  db_name            = var.db_name
  db_username        = var.db_username
  db_password        = var.db_password
  allowed_security_group_id = module.ecs.ecs_security_group_id
}

# ─── ECS (Fargate) ──────────────────────────────────────────────────
module "ecs" {
  source = "./modules/ecs"

  project            = var.project
  environment        = var.environment
  aws_region         = var.aws_region
  vpc_id             = module.networking.vpc_id
  public_subnet_ids  = module.networking.public_subnet_ids
  private_subnet_ids = module.networking.private_subnet_ids
  ecr_repository_url = module.ecr.repository_url
  database_url       = module.rds.connection_string
  auth_secret        = var.auth_secret
  container_port     = 3000
  desired_count      = var.ecs_desired_count
  cpu                = var.ecs_cpu
  memory             = var.ecs_memory
}
