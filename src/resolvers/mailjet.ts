import { SendEmailV3_1, LibraryResponse } from 'node-mailjet';
import Mailjet from 'node-mailjet';
import dotenv from "dotenv";
dotenv.config()

const mailJetApiKey: string | undefined = process.env.MJ_APIKEY_PUBLIC;
const mailJetSecretKey: string | undefined = process.env.MJ_APIKEY_PRIVATE;

const construct = ({
    apiKey: mailJetApiKey,
    apiSecret: mailJetSecretKey,
});

const mailjet = new Mailjet(construct);

const sendResetPassword = async (email: string, firstname: string, lastname: string, token: string) => {
    const data: SendEmailV3_1.Body = {
        Messages: [
        {
            From: {
                Email: 'wwildrent@gmail.com',
                Name: 'WildBooking'
            },
            To: [
            {
                Email: email,
            },
            ],
            TemplateID: 4627735,
            Subject: 'Réinitialisation du mot de passe WildBooking',
            Variables: {
                "name": `${firstname} ${lastname}`,
                "token": `${token}`
            },
            TemplateLanguage: true,
        },
    ],};
  
    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
        .post('send', { version: 'v3.1' })
        .request({...data});

    const { Status } = result.body.Messages[0];
    if (Status === 'success') console.log('✅')
    else console.log('❌');
    console.log('====================================');
    console.log('le status du mail de reset du mot de passe dans MAILJET.TS ', Status);
    console.log('====================================');

};

const fromContactForm = async (name: string, mail: string, subject: string, message: string) => {
    const data: SendEmailV3_1.Body = {
        Messages: [
        {
            From: {
            Email: 'wwildrent@gmail.com',
            Name: 'WildBooking'
            },
            To: [
            {
                Email: 'wwildrent@gmail.com',
                Name: mail
            },
            ],
            Subject: `Message de ${name} ${subject}`,
            HTMLPart: message,
        },
    ],};
  
    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
        .post('send', { version: 'v3.1' })
        .request({...data});

    const { Status } = result.body.Messages[0];
    if (Status === 'success') console.log('✅')
    else console.log('❌');
    console.log('====================================');
    console.log('le status dans MAILJET.TS ', Status);
    console.log('====================================');

};

export default {
    fromContactForm,
    sendResetPassword
};