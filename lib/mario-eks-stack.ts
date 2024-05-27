import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { marioManifests } from './mario-manifests';


interface ClusterProps extends cdk.StackProps {
  eksvpc: ec2.IVpc,
}

export class MarioStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props: ClusterProps) {
    super(scope, id, props);

    const mastersRoleArn = process.env.MASTERS_ROLE_ARN || 'arn:aws:iam::1234567890:role/mastersRoleArn';
    const userRoleArn = process.env.USER_ROLE_ARN || 'arn:aws:iam::1234567890:role/userRoleArn';

    const workerSpotInstanceType = 't4g.medium'

    const addOns: Array<blueprints.ClusterAddOn> = [
      new blueprints.addons.AwsLoadBalancerControllerAddOn(),
      new blueprints.addons.VpcCniAddOn(),
      new marioManifests
    ];

    const clusterProvider = new blueprints.GenericClusterProvider({
      version: eks.KubernetesVersion.of('1.30'),
      tags: {
        'Name': 'mario-cluster',
      },
      mastersRole: blueprints.getResource(context => {
        return iam.Role.fromRoleArn(context.scope, 'MastersRole', mastersRoleArn, {
          mutable: true, // Set to true if you need to update the role
        })

      }),
      managedNodeGroups: [{
        id: 'mng1-launchtemplate',
        instanceTypes: [new ec2.InstanceType(workerSpotInstanceType)],
        amiType: eks.NodegroupAmiType.AL2_ARM_64,
        nodeGroupCapacityType: eks.CapacityType.SPOT,
        desiredSize: 1,
        minSize: 0,
        maxSize: 1,
        nodeGroupSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      }
      ],
      privateCluster: false,
      vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
      role: blueprints.getResource(context => {
        return new iam.Role(context.scope, 'AdminRole',
          {
            assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
            managedPolicies: [
              iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy'),
              iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'),
            ],
          });
      }),
    });

    const platformTeam = new blueprints.PlatformTeam({
      name: 'platform-admin',
      userRoleArn: userRoleArn
    });

    blueprints.EksBlueprint.builder()
      .region(process.env.CDK_DEFAULT_REGION)
      .addOns(...addOns)
      .clusterProvider(clusterProvider)
      .teams(platformTeam)
      .resourceProvider(blueprints.GlobalResources.Vpc,
        new blueprints.DirectVpcProvider(props.eksvpc))
      .build(this, 'mario-cluster')
  }
}
