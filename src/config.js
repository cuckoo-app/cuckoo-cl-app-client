const dev = {
  s3: {
    REGION: "us-east-2",
    BUCKET: "cuckoo-cl-app-api-dev-stdoutbucket-rr2n3gotouzy"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://api.cuckoo-cl.com/dev"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_aPXAs9pyz",
    APP_CLIENT_ID: "6r05fcpba2apehoe4cgbifq90q",
    IDENTITY_POOL_ID: "us-east-2:983be965-2081-4cf4-b4d7-a45348cf5d07"
  }
};

const prod = {
  s3: {
    REGION: "us-east-2",
    BUCKET: "cuckoo-cl-app-api-prod-stdoutbucket-535m0jfb4jd"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://api.cuckoo-cl.com/prod"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_csyYyvFlI",
    APP_CLIENT_ID: "6pe74n1oo9gevkllhrq7ec5vb8",
    IDENTITY_POOL_ID: "us-east-2:f1015767-c8e6-4140-82c2-c22febc2814f"
  }
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_STDOUT_SIZE: 5000000,
  ...config
};
