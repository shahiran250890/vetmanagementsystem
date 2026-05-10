export type StaffPermissionProps = {
    canViewUser: boolean;
    canCreateUser: boolean;
    canUpdateUser: boolean;
    canDeleteUser: boolean;
};

/** Backend still emits `can*User` props via `HasResourcePermission` + resource name `user`. */
export function useStaffPermissions(props: StaffPermissionProps): StaffPermissionProps {
    return props;
}
