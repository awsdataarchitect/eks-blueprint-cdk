#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MarioVpcStack } from '../lib/mario-vpc-stack';
import { MarioStack } from '../lib/mario-eks-stack'


const app = new cdk.App();

const env =  {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
}

const MarioVpc = new MarioVpcStack(app, 'MarioVpcStack', {
    env: env,
});

const MarioEks = new MarioStack(app, 'MarioStack', {
    env: env,
    eksvpc:MarioVpc.eksvpc,
});

MarioEks.addDependency(MarioVpc)

