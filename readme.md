### AWS Services usgae from NodeJS

##### Usage Instructions

1. Create an .env file and include the following variables with the respective IAM credentials.


   AWS_REGION ,  AWS_SECRET_ACCESS_KEY , AWS_ACCESS_KEY_ID
    
To use AWS S3:

BUCKET_NAME


To use AWS Cognito:

AWS_COGNITO_CLIENT_ID ,AWS_COGNITO_CLIENT_SECRET ,AWS_COGNITO_USER_POOL_ID

The user IAM must have the proper permission to use AWS Cognito / AWS S3

2. Import the utilities in your main project (eg. Nextjs project, express Rest API)
