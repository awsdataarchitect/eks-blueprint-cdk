import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';


export class MarioVpcStack extends cdk.Stack {

  eksvpc: ec2.IVpc;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.eksvpc =  new ec2.Vpc(this, 'MyVpc', {
    vpcName: 'MarioVpc',
    cidr: '10.7.0.0/16',
    maxAzs: 3, // Use 3 availability zones
    subnetConfiguration: [
      {
        cidrMask: 24,
        name: 'MarioPublicSubnet',
        subnetType: ec2.SubnetType.PUBLIC,
      },
    ],
  });

  // Get the public subnets
  const publicSubnets = this.eksvpc.publicSubnets;

  // Apply tags to the public subnets
  publicSubnets.forEach((subnet, index) => {
    cdk.Tags.of(subnet).add('kubernetes.io/role/elb', '1');
    // Add other tags as needed
  });

  // Export VPC ID
  new cdk.CfnOutput(this, 'VpcId', {
    value: this.eksvpc.vpcId,
    exportName: 'MarioVpcId', // Choose a unique export name
  });
   
  }
}
