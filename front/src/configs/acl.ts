import { AbilityBuilder, Ability } from "@casl/ability";
import { TGroup } from "@modules/users/types";

export type TSubjects = string;
export type TActions = "manage" | "create" | "read" | "update" | "delete";
export type AppAbility = Ability<[TActions, TSubjects]> | undefined;

export const AppAbility = Ability as any;
export type ACLObj = {
  action: TActions;
  subject: string;
};

export enum Permissions {
  ANY = "any",
  VIP = "VIP",
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (groups: TGroup[], subject: string) => {
  const { can, rules } = new AbilityBuilder(AppAbility);

  can("read", "any");

  groups.map((group) => {
    can("read", group.name);
  });

  return rules;
};

export const buildAbilityFor = (
  groups: TGroup[],
  subject: string
): AppAbility => {
  return new AppAbility(defineRulesFor(groups, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: (object) => object!.type,
  });
};

export const buildGuestAbility = (): AppAbility => {
  const { can, rules } = new AbilityBuilder(AppAbility);

  can("read", Permissions.ANY);

  return new AppAbility(rules, {
    detectSubjectType: (object: any) => object.type,
  });
};

export const defaultACLObj: ACLObj = {
  action: "manage",
  subject: "all",
};

export default defineRulesFor;
