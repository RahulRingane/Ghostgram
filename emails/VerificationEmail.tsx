import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
} from '@react-email/components'

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({username, otp}: VerificationEmailProps) {
    return (
        <Html lang='en' dir="ltr0">
            <Head>
                <title>
                    VerificationCode
                </title>
                <Font
                fontFamily='Roboto'
                fallbackFontFamily="Verdana"
                webFont={{
                    url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                    format: 'woff2',
                }}
                fontWeight={400}
                fontStyle="normal"
                />
            </Head>
            <Preview>Here&apos;s your verificstion code: {otp}</Preview>
            <Section>
                <Row>
                    <Heading as="h2">
                        Hello {username},
                    </Heading>
                </Row>
                <Row>
                    <Text>
                        Thank you for registering. Please use the following verificationAdd commentMore actions
            code to complete your registration:
                    </Text>
                </Row>
                <Row>Add commentMore actions
          <Text>{otp}</Text> 
        </Row>
        <Row>
          <Text>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
            </Section>
        </Html>
    );
}