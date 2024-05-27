import * as eks from 'aws-cdk-lib/aws-eks';
import * as blueprints from '@aws-quickstart/eks-blueprints';

export class marioManifests implements blueprints.ClusterAddOn {
  deploy(clusterInfo: blueprints.ClusterInfo): void {

    const cluster = clusterInfo.cluster;

    // Inline YAML manifest for Deployment
    const deploymentManifest = `---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: mario-deployment
    spec:
      replicas: 2
      selector:
        matchLabels:
          app: mario-app
      template:
        metadata:
          labels:
            app: mario-app
        spec:
          containers:
          - name: mario-container
            image: kaminskypavel/mario
   
    `;
    let manifest = deploymentManifest.split("---").map(e => blueprints.utils.loadYaml(e));

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
      name: mario-service
    spec:
      selector:
        app: mario-app
      ports:
        - protocol: TCP
          port: 80
          targetPort: 8080
      type: NodePort
    `;

    manifest = serviceManifest.split("---").map(e => blueprints.utils.loadYaml(e));

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
    name: mario-ingress
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
                  name: mario-service
                  port:
                    number: 80
  `;

  manifest = ingressManifest.split("---").map(e => blueprints.utils.loadYaml(e));

  new eks.KubernetesManifest(cluster.stack, "ingress-manifest", {
    cluster,
    manifest,
    overwrite: true
  });

}

}

