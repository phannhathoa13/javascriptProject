class RoleUserAdmin {
    constructor(codeName) {
        this.role = "USERADMIN",
            this.codeName = codeName
    }
}
class RoleOwner {
    constructor(codeName) {
        this.role = "OWNER",
            this.codeName = codeName

    }
}
export { RoleUserAdmin, RoleOwner }