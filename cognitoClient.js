const AWS_COGNITO = require("@aws-sdk/client-cognito-identity-provider");
require('dotenv').config({ path: '../.env' });
const crypto = require('crypto');

const client = new AWS_COGNITO.CognitoIdentityProviderClient(
    { region: process.env.AWS_REGION ,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID
    }
);


//function to response the challenge new password required and set the password entered by the user
const changeInitialPassword = async (user_name,session, new_password) => {
    try{
        const hash_sha256 = crypto.createHmac('sha256',
        process.env.AWS_COGNITO_CLIENT_SECRET).update(user_name + process.env.AWS_COGNITO_CLIENT_ID).digest('base64');
        const input= { // RespondToAuthChallengeRequest
            ChallengeName: 'NEW_PASSWORD_REQUIRED', // required
            ClientId: process.env.AWS_COGNITO_CLIENT_ID,

            ChallengeResponses: {
              NEW_PASSWORD: new_password,
              USERNAME: user_name,
              SECRET_HASH: hash_sha256,
            },
            Session: session,
          };
    
          const command = new AWS_COGNITO.RespondToAuthChallengeCommand(input);
          const response = await client.send(command);
           return {token: response['AuthenticationResult']['AccessToken'],'success': true,
           "change_password": false
        };

    } catch (error) {
        return {error: error.message,'success': false};

    }

}

//function to authenticate a user
const authenticateUser = async (user_name, password) => {
    try{
        const hash_sha256 = crypto.createHmac('sha256',
        process.env.AWS_COGNITO_CLIENT_SECRET).update(user_name + process.env.AWS_COGNITO_CLIENT_ID).digest('base64');
        const input= { // AdminInitiateAuthRequest
            AuthFlow: 'ADMIN_NO_SRP_AUTH', // required
            ClientId: process.env.AWS_COGNITO_CLIENT_ID,
            UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
            AuthParameters: {
              USERNAME: user_name,
              PASSWORD: password,
              SECRET_HASH: hash_sha256,
            },
          };
    
          const command = new AWS_COGNITO.AdminInitiateAuthCommand(input);
          const response = await client.send(command);
          if ('ChallengeName' in response && response['ChallengeName'] === 'NEW_PASSWORD_REQUIRED')
          {
            return {session: response['Session'],'success': true,'change_password': true};
            }else{
                return {token: response['AuthenticationResult']['AccessToken'],'success': true,'change_password': false};
         }     

    } catch (error) {
        return {error: error.message,'success': false};

    }

}


const createUser = async (user_name,initial_password,given_name) => {
    try{
        const input= { // AdminCreateUserRequest
            UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
            Username: user_name,
            UserAttributes: [ 
              { 
                Name: "given_name", // required
                Value: given_name,
              },
               ],
            TemporaryPassword: initial_password,
            ForceAliasCreation: false,
            DesiredDeliveryMediums: [ "EMAIL",]
          };
    
          const command = new AWS_COGNITO.AdminCreateUserCommand(input);
          const response = await client.send(command);
           return {response: response,'success': true};

    } catch (error) {
        return {error: error.message,'success': false};


    }
   
}


const cognitoManagement=()=>{
    //TODO: Recovery forgot password
    return {
        createUser: createUser,
        authenticateUser: authenticateUser,
        changeInitialPassword: changeInitialPassword
    }
}

module.exports = cognitoManagement();