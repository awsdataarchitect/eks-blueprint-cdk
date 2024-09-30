# Open-source code for using AWS-CDK to provision an EKS Cluster using EKS Blueprints with Kubernetes version 1.30 (Application running a Super Mario Bros. game)

This is a CDK project written in TypeScript that provisions an EKS Cluster using EKS Blueprints with Kubernetes V1.30 and the required Kubernetes EKS add-ons (Amazon VPC CNI and AWS Load Balancer Controller) along with the Kubernetes manifests (Deployment, Service, Ingress) to launch the Dockerized version of the popular Super Mario Bros. game.

For more details on how to deploy the infrastructure and the solution details, please refer to the Blog Post:
* [v1.30: Amazon EKS with Kubernetes version 1.30 (Uwubernetes) using AWS-CDK](https://aws.plainenglish.io/amazon-eks-with-kubernetes-version-1-30-using-aws-cdk-99186e58dabb).


# Open-source code for using AWS-CDK to provision an EKS Cluster using EKS Blueprints with Kubernetes version 1.31 (Application running Prince of Persia game)

This is a CDK project written in TypeScript that provisions an EKS Cluster using EKS Blueprints with Kubernetes V1.31 and the required Kubernetes EKS add-ons (Amazon VPC CNI and AWS Load Balancer Controller) along with the Kubernetes manifests (Deployment, Service, Ingress) to launch the Dockerized version of the popular Prince of Persia game.

For more details on how to deploy the infrastructure and the solution details, please refer to the Blog Post:
* [v1.31: Amazon EKS with Kubernetes version 1.31 (Elli) using AWS-CDK](https://vivek-aws.medium.com/amazon-eks-with-kubernetes-version-1-31-elli-using-aws-cdk-a7a237ec709c).


The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

![Alt text](./eks.png?raw=true "EKS Cluster Deployed using EKS Blueprints")