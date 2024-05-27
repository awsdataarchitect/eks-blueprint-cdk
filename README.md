# Open-source code for Deploying Super Mario Bros. game on an EKS Cluster using EKS Blueprints for AWS CDK

This is a CDK project written in TypeScript that provisions an EKS Cluster using EKS Blueprints with Kubernetes V1.30 and the required Kubernetes EKS add-ons (Amazon VPC CNI and AWS Load Balancer Controller) along with the Kubernetes manifests (Deployment, Service, Ingress) to launch the Dockerized version of the popular Super Mario Bros. game.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

![Alt text](./eks.png?raw=true "EKS Cluster Deployed using EKS Blueprints")