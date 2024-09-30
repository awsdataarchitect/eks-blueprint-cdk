import * as eks from 'aws-cdk-lib/aws-eks';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { Construct } from 'constructs';

export class EksManifests extends Construct implements blueprints.ClusterAddOn {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }

  deploy(clusterInfo: blueprints.ClusterInfo): void {
    const cluster = clusterInfo.cluster;

    // Build and push Docker image to ECR using the scope of the cluster's stack
    const appImageAsset = new DockerImageAsset(cluster.stack, 'MyAppImage', {
      directory: './lib/docker', // Ensure the correct directory path
    });

    // Inline YAML manifest for Deployment with Docker image from ECR
    const deploymentManifest = `---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: eks-deployment
    spec:
      replicas: 2
      selector:
        matchLabels:
          app: eks-app
      template:
        metadata:
          labels:
            app: eks-app
        spec:
          containers:
          - name: eks-container
            image: ${appImageAsset.imageUri}
            ports:
            - containerPort: 8080
    `;

    let manifest = deploymentManifest.split("---").map(e => blueprints.utils.loadYaml(e));

    // Apply the Deployment manifest to the EKS cluster
    new eks.KubernetesManifest(cluster.stack, "deployment-manifest", {
      cluster,
      manifest,
      overwrite: true
    });

    // Inline YAML manifest for Service
    const serviceManifest = `---
    apiVersion: v1
    kind: Service
    metadata:
      name: eks-service
    spec:
      selector:
        app: eks-app
      ports:
        - protocol: TCP
          port: 80
          targetPort: 8080
      type: NodePort
    `;

    manifest = serviceManifest.split("---").map(e => blueprints.utils.loadYaml(e));

    // Apply the Service manifest to the EKS cluster
    new eks.KubernetesManifest(cluster.stack, "service-manifest", {
      cluster,
      manifest,
      overwrite: true
    });

    // Inline YAML manifest for Ingress
    const ingressManifest = `---
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: eks-ingress
      namespace: default
      annotations:
        alb.ingress.kubernetes.io/scheme: internet-facing
    spec:
      ingressClassName: alb
      rules:
        - http:
            paths:
              - path: /
                pathType: Prefix
                backend:
                  service:
                    name: eks-service
                    port:
                      number: 80
    `;

    manifest = ingressManifest.split("---").map(e => blueprints.utils.loadYaml(e));

    // Apply the Ingress manifest to the EKS cluster
    new eks.KubernetesManifest(cluster.stack, "ingress-manifest", {
      cluster,
      manifest,
      overwrite: true
    });
  }
}
