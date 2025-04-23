export const getUserRoles = (): string[] => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return [];
    try {
        const user = JSON.parse(userStr);
        return user.roles || [];
    } catch {
        return [];
    }
};
export const isAdmin = (): boolean => {
    const roles = getUserRoles();
    if (roles.includes("ROLE_ADMIN")) {
        return true;
    }
    return false;
};