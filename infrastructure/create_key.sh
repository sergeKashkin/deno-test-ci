aws ec2 create-key-pair --key-name deno-test --query 'KeyMaterial' --region us-east-2 --output text > deno-test.pem
chmod 400 deno-test.pem
