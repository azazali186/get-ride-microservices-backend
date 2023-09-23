import Permissions from '../models/permissions.mjs'
import Role from '../models/roles.mjs'

export const getMethodName = (key) => {
    switch (key) {
        case "GET":
            return "View"
            break;
        case "POST":
            return "Create"
            break;
        case "PATCH":
        case "PUT":
            return "Edit-update"
            break;
        case "DELETE":
            return "delete"
            break;

        default:
            break;
    }
}



async function getRoleData() {
    try {
        let adminRole = await Role.findOne({ where: { name: 'admin' } });
        let permissions = await Permissions.findAll();

        if (!adminRole) {
            await Role.create({
                name: 'admin',
                permissions: permissions
            });
        } else {
            await adminRole.setPermissions(permissions);
        }

        let customerRole = await Role.findOne({ where: { name: 'customer' } });
        if (!customerRole) {
            await Role.create({ name: 'customer' });
        }
    } catch (error) {
        console.error('Error in getRoleData:', error);
    }
}

const getPermissionsData = (expressListRoutes, app) => {
    const allRoutes = expressListRoutes(app);
    allRoutes.forEach(async (routeData) => {
        let name = (getMethodName(routeData.method) + routeData.path.split(':')[0].replaceAll('/', '-')).toLowerCase();
        name = name.endsWith('-') ? name.slice(0, -1) : name;
        
        let path = routeData.path.endsWith('\\') ? routeData.path.slice(0, -1) : routeData.path;

        try {
            const [permission, created] = await Permissions.findOrCreate({
                where: { name: name, path: path },
                defaults: { name: name, path: path }
            });

            // If you want to perform any operations when a new permission is created, you can use:
            // if (created) { ... }
        } catch (error) {
            console.error('Error in getPermissionsData:', error);
        }
    });
};




export const inserData = async (expressListRoutes, app) => {
    getPermissionsData(expressListRoutes, app)
    await getRoleData()
}

export default { getMethodName ,inserData }