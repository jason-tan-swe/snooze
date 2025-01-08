export const authConfig = {
    providers: [
        {
            id: 'oura',
            name: 'Oura',
            type: 'oauth',
            clientId: process.env.OAUTH_CLIENT_ID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            wellKnown: null,
            authorization: {
                url: 'https://cloud.ouraring.com/oauth/authorize',
                params: {
                    scope: 'email personal daily session',
                    response_type: 'code',
                }
            },
            token: {
                url: 'https://api.ouraring.com/oauth/token',
                params: { grant_type: 'authorization_code' }
            },
            userinfo: {
                url: 'https://api.ouraring.com/v2/usercollection/personal_info',
                async request({ tokens, provider }) {
                    const response = await fetch(provider.userinfo.url, {
                        headers: { 
                            Authorization: `Bearer ${tokens.access_token}`,
                            'Content-Type': 'application/json'
                        },
                    })
                    return await response.json()
                }
            },
            profile(profile) {
                return {
                    id: profile.id ?? profile.sub ?? 'unknown',
                    name: profile.name ?? 'Unknown User',
                    email: profile.email
                }
            },
        }
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                }
            }
            return token
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken
            return session
        }
    },
}
