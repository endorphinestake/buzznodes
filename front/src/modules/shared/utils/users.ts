// ** Types & Interfaces
import { TUser } from '@modules/users/types';

export const getProfileFullName = (user: TUser | null) => {
    return user?.first_name || user?.email || '';
};

export const getProfileInitials = (user: TUser) => {
    const fullName = getProfileFullName(user);
    if (!fullName.trim()) {
        return user.email.slice(0, 1).toUpperCase();
    }
    return fullName.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '').slice(0, 2);
};
