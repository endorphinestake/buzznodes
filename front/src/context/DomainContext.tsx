import { ComponentType } from "react";

import { createContext, useContext, useEffect, useState } from "react";
import CelestiaLogo from "@modules/shared/icons/celestia";
import OGLogo from "@modules/shared/icons/0g";
import XRPLLogo from "@modules/shared/icons/xrpl";
import StoryLogo from "@modules/shared/icons/story";

// https://react-svgr.com/playground/

type DomainValue = {
  blockchainId: number;
  logo: ComponentType<any>;
  domain: string;
  name: string;
  symbol: string;
  isDaEnabled: boolean;
};

const DEV_DOMAINS = {
  "celestia.local.com": {
    blockchainId: 1,
    logo: StoryLogo,
    domain: "celestia.local.com",
    name: "Celestia Mainnet",
    symbol: "TIA",
    isDaEnabled: true,
  },
  "celestia-testnet.local.com": {
    blockchainId: 2,
    logo: StoryLogo,
    domain: "celestia-testnet.local.com",
    name: "Celestia Testnet",
    symbol: "TIA",
    isDaEnabled: true,
  },
} as const as Record<string, DomainValue>;

const PROD_DOMAINS = {
  "celestia.buzznodes.com": {
    blockchainId: 1,
    logo: CelestiaLogo,
    domain: "celestia.buzznodes.com",
    name: "Celestia Mainnet",
    symbol: "TIA",
    isDaEnabled: true,
  },
  "celestia-testnet.buzznodes.com": {
    blockchainId: 2,
    logo: CelestiaLogo,
    domain: "celestia-testnet.buzznodes.com",
    name: "Celestia Testnet",
    symbol: "TIA",
    isDaEnabled: true,
  },
  "0g.buzznodes.com": {
    blockchainId: 3,
    logo: OGLogo,
    domain: "0g.buzznodes.com",
    name: "0G Testnet",
    symbol: "A0GI",
    isDaEnabled: false,
  },
  "xrpl-testnet.buzznodes.com": {
    blockchainId: 4,
    logo: XRPLLogo,
    domain: "xrpl-testnet.buzznodes.com",
    name: "XRPL Testnet",
    symbol: "XRP",
    isDaEnabled: false,
  },
  "xrpl.buzznodes.com": {
    blockchainId: 5,
    logo: XRPLLogo,
    domain: "xrpl.buzznodes.com",
    name: "XRPL Mainnet",
    symbol: "XRP",
    isDaEnabled: false,
  },
  "story-testnet.buzznodes.com": {
    blockchainId: 6,
    logo: StoryLogo,
    domain: "story-testnet.buzznodes.com",
    name: "Story Testnet",
    symbol: "IP",
    isDaEnabled: false,
  },
} as const as Record<string, DomainValue>;

type DomainConfig = typeof DEV_DOMAINS | typeof PROD_DOMAINS;
const DOMAINS: DomainConfig =
  process.env.DEBUG === "true" ? DEV_DOMAINS : PROD_DOMAINS;

type DomainKey = keyof typeof PROD_DOMAINS;
const DEFAULT_DOMAIN: DomainKey = "celestia.buzznodes.com";

const DomainContext = createContext({
  ...DOMAINS[DEFAULT_DOMAIN],
  domains: DOMAINS,
});

export const DomainProvider = ({ children }: { children: React.ReactNode }) => {
  const [domainData, setDomainData] = useState({
    ...DOMAINS[DEFAULT_DOMAIN],
    domains: DOMAINS,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      // console.log("HOSTNAME: ", hostname);

      if (hostname in DOMAINS) {
        setDomainData({
          ...DOMAINS[hostname as DomainKey],
          domains: DOMAINS,
        });
      }
    }
  }, []);

  return (
    <DomainContext.Provider value={domainData}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomain = () => {
  return useContext(DomainContext);
};
