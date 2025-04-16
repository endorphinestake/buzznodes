// ** React Imports
import { ReactNode } from "react";

// ** Next Imports
import Head from "next/head";
import { Router } from "next/router";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

// ** Store Imports
import { store } from "src/store";
import { Provider } from "react-redux";

// ** Loader Import
import NProgress from "nprogress";

// ** Emotion Imports
import { CacheProvider } from "@emotion/react";
import type { EmotionCache } from "@emotion/cache";

// ** Config Imports
import "@configs/i18n";
import { defaultACLObj } from "@configs/acl";
import themeConfig from "@configs/themeConfig";

// ** Third Party Import
import { Toaster } from "react-hot-toast";

// ** Component Imports
import UserLayout from "@layouts/UserLayout";
import ThemeComponent from "src/@core/theme/ThemeComponent";
import AclGuard from "@guards/AclGuard";
import AuthGuard from "@guards/AuthGuard";
import GuestGuard from "@guards/GuestGuard";
import WindowWrapper from "src/@core/components/window-wrapper";

// ** Spinner Import
import Spinner from "src/@core/components/spinner";

// ** Contexts
import { AuthProvider } from "@context/AuthContext";
import { DomainProvider } from "@context/DomainContext";
import {
  SettingsConsumer,
  SettingsProvider,
} from "src/@core/context/settingsContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

// ** Styled Components
import ReactHotToast from "src/@core/styles/libs/react-hot-toast";

// ** Hooks Imports
import { useTranslation } from "react-i18next";

// ** Utils Imports
import { createEmotionCache } from "src/@core/utils/create-emotion-cache";

// ** Prismjs Styles
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

// ** React Perfect Scrollbar Style
import "react-perfect-scrollbar/dist/css/styles.css";

// ** Global css styles
import "@styles/globals.css";

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
};

type GuardProps = {
  authGuard: boolean;
  guestGuard: boolean;
  children: ReactNode;
};

const clientSideEmotionCache = createEmotionCache();

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });
  Router.events.on("routeChangeError", () => {
    NProgress.done();
  });
  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>;
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>;
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>;
  }
};

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  // ** Proops
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // ** Hooks
  const { i18n } = useTranslation();

  // Variables
  const getLayout =
    Component.getLayout ?? ((page) => <UserLayout>{page}</UserLayout>);

  const setConfig = Component.setConfig ?? undefined;

  const authGuard = Component.authGuard ?? false;

  const guestGuard = Component.guestGuard ?? false;

  const aclAbilities = Component.acl ?? defaultACLObj;

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{themeConfig.templateName}</title>
          <meta
            name="description"
            content={`${themeConfig.templateName} - Blockchain Monitoring`}
          />
          <meta name="keywords" content="blockchain, monitoring, nodes" />
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>

        <DomainProvider>
          <AuthProvider>
            <GoogleOAuthProvider
              clientId={process.env.SOCIAL_AUTH_GOOGLE_CLIENT_ID || ""}
            >
              <SettingsProvider
                {...(setConfig ? { pageSettings: setConfig() } : {})}
              >
                <SettingsConsumer>
                  {({ settings }) => {
                    return (
                      <ThemeComponent settings={settings}>
                        <Guard authGuard={authGuard} guestGuard={guestGuard}>
                          <AclGuard
                            aclAbilities={aclAbilities}
                            authGuard={authGuard}
                            guestGuard={guestGuard}
                          >
                            {getLayout(<Component {...pageProps} />)}
                          </AclGuard>
                        </Guard>
                        <ReactHotToast>
                          <Toaster
                            position={settings.toastPosition}
                            toastOptions={{ className: "react-hot-toast" }}
                          />
                        </ReactHotToast>
                      </ThemeComponent>
                    );
                  }}
                </SettingsConsumer>
              </SettingsProvider>
            </GoogleOAuthProvider>
          </AuthProvider>
        </DomainProvider>
      </CacheProvider>
    </Provider>
  );
};

export default App;
