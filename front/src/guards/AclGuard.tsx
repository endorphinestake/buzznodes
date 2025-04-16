// ** React Imports
import { ReactNode, useState, useEffect } from "react";

// ** Next Imports
import { useRouter } from "next/router";

// ** Types
import type { ACLObj, AppAbility } from "src/configs/acl";

// ** Context Imports
import { AbilityContext } from "@layouts/components/acl/Can";

// ** Config Import
import { buildAbilityFor, buildGuestAbility } from "@configs/acl";

// ** Component Import
import NotAuthorized from "@pages/401";
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Hooks
import { useAuth } from "@hooks/useAuth";

interface AclGuardProps {
  children: ReactNode;
  guestGuard: boolean;
  aclAbilities: ACLObj;
}

const AclGuard = (props: AclGuardProps) => {
  const { aclAbilities, children, guestGuard } = props;

  const [ability, setAbility] = useState<AppAbility>();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setAbility(buildAbilityFor(user.groups, aclAbilities.subject));
    } else {
      setAbility(buildGuestAbility());
    }
  }, [user, aclAbilities.subject]);

  // Пока ability не установлен — не рендерим ничего
  if (!ability) return null;

  if (guestGuard || router.route === "/404" || router.route === "/500") {
    return (
      <AbilityContext.Provider value={ability}>
        {children}
      </AbilityContext.Provider>
    );
  }

  if (ability.can(aclAbilities.action, aclAbilities.subject)) {
    return (
      <AbilityContext.Provider value={ability}>
        {children}
      </AbilityContext.Provider>
    );
  }

  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  );
};

export default AclGuard;
