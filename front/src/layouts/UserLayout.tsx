// ** React Imports
import { ReactNode } from 'react';

// ** MUI Imports
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout';

// ** Navigation Imports
import VerticalNavItems from '@navigation/vertical';
import HorizontalNavItems from '@navigation/horizontal';

import VerticalAppBarContent from './components/VerticalAppBar';
import HorizontalAppBarContent from './components/HorizontalAppBar';

import FooterContent from './components/footer/FooterContent';

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings';

interface Props {
  children: ReactNode;
}

const UserLayout = ({ children }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings();

  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/material-ui/react-use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      footerContent={FooterContent}
      {...(settings.layout === 'horizontal'
        ? {
            // ** Navigation Items
            horizontalNavItems: HorizontalNavItems(),

            // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
            // horizontalNavItems: ServerSideHorizontalNavItems(),

            // ** AppBar Content
            horizontalAppBarContent: () => (
              <HorizontalAppBarContent
                hidden={hidden}
                settings={settings}
                saveSettings={saveSettings}
              />
            ),
          }
        : {
            // ** Navigation Items
            verticalNavItems: VerticalNavItems(),

            // Uncomment the below line when using server-side menu in vertical layout and comment the above line
            // verticalNavItems: ServerSideVerticalNavItems(),

            // ** AppBar Content
            verticalAppBarContent: (props) => (
              <VerticalAppBarContent
                hidden={hidden}
                settings={settings}
                saveSettings={saveSettings}
                toggleNavVisibility={props.toggleNavVisibility}
              />
            ),
          })}
    >
      {children}
    </Layout>
  );
};

export default UserLayout;
