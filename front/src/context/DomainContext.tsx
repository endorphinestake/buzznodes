import { createContext, useContext, useEffect, useState } from "react";
import CelestiaLogo from "@modules/shared/icons/celestia";

type DomainKey = keyof typeof DOMAINS;

const DEFAULT_DOMAIN: DomainKey = "account.buzznodes.com";

const DOMAINS = {
  /* DEV */
  "celestia.local.com": {
    blockchainId: 2,
    logo: CelestiaLogo,
  },
  "celestia-testnet.local.com": {
    blockchainId: 3,
    logo: CelestiaLogo,
  },

  /* PROD */
  "account.buzznodes.com": {
    blockchainId: 1,
    logo: CelestiaLogo,
  },
  "celestia.buzznodes.com": {
    blockchainId: 1,
    logo: CelestiaLogo,
  },
  "celestia-testnet.buzznodes.com": {
    blockchainId: 2,
    logo: CelestiaLogo,
  },
};

const DomainContext = createContext(DOMAINS[DEFAULT_DOMAIN]);

export const DomainProvider = ({ children }: { children: React.ReactNode }) => {
  const [domainData, setDomainData] = useState(DOMAINS[DEFAULT_DOMAIN]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname as DomainKey;
      console.log("HOSTNAME: ", hostname);
      setDomainData(DOMAINS[hostname] || DOMAINS[DEFAULT_DOMAIN]);
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
