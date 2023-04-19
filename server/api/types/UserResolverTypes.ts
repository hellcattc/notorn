import { TokenResponse } from "./../schema/UserTypes";
enum UserRoles {
  Admin = "ADMIN",
}

type UserRolesValues = `${UserRoles}`;

export { UserRolesValues };
