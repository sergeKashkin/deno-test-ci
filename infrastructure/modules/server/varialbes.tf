variable "instance_name" {
  description = "Name Tag of the EC2 instace"
  type        = string
  default     = "DenoNextExample"
}

variable "key_name" {
  description = "Name tag of the EC2 instance key"
  type        = string
  default     = "deno-test"
}