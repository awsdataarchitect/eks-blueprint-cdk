#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EksVpcStack } from '../lib/eks-vpc-stack';
import { EksStack } from '../lib/eks-stack'

const app = new cdk.App();

const env =  {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
}

const EksVpc = new EksVpcStack(app, 'EksVpc-Stack', {
    env: env,
});

const Eks = new EksStack(app, 'EksStack', {
    env: env,
    eksvpc:EksVpc.eksvpc,
});

Eks.addDependency(EksVpc)

