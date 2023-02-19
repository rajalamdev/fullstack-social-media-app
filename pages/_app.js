import App from 'next/app'
import Layout from '@/components/Layout'
import '@/styles/globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { AppProvider } from '@/context/AppContext'
config.autoAddCss = false

export default function MyApp({ Component, pageProps, currentUser, token }) {
  return (
    <AppProvider>
      <Layout currentUser={currentUser} token={token}>
        <Component {...pageProps} currentUser={currentUser} />
      </Layout>
    </AppProvider>
  )
}

MyApp.getInitialProps = async (ctx) => {
  const token = ctx?.ctx?.req?.cookies?.token

  
  const appProps = await App.getInitialProps(ctx);
  if(!token) return {...appProps}
  
  const reqMyProfile = await fetch(`${process.env.PUBLIC_API_URL}/api/users/me?populate=image`, {
    headers: {
        "Authorization": "Bearer " + token
    }
  })

  const resMyProfile = await reqMyProfile.json()

  return { ...appProps, currentUser: {id: resMyProfile.id, username: resMyProfile.username, image: resMyProfile.image}, token: token}
}