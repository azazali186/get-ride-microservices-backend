import Permissions from "../models/permissions.mjs";
import { sendPermissionsToAuthServer } from "../rabbitMq/sendPermissionsToAuthServer.mjs";

export const getMethodName = (key) => {
  switch (key) {
    case "GET":
      return "View";
      break;
    case "POST":
      return "Create";
      break;
    case "PATCH":
    case "PUT":
      return "Edit-update";
      break;
    case "DELETE":
      return "delete";
      break;

    default:
      break;
  }
};

async function findOrCreatePermission(name, path) {
  let permission = await Permissions.findOne({ name: name, path: path });

  if (!permission) {
    permission = await Permissions.create({ name: name, path: path });
    return [false, permission];
  }

  return [permission, false];
}

const getPermissionsData = async (expressListRoutes, app) => {
  const allRoutes = expressListRoutes(app);
  allRoutes.forEach(async (routeData) => {
    let name = (
      getMethodName(routeData.method) +
      routeData.path.split(":")[0].replaceAll("/", "-")
    ).toLowerCase();
    name = name.endsWith("-") ? name.slice(0, -1) : name;

    let path = routeData.path.endsWith("/")
      ? routeData.path.slice(0, -1)
      : routeData.path;

    try {
      const [permission, created] = await findOrCreatePermission(name, path);
    } catch (error) {
      console.error("Error in getPermissionsData:", error);
    }
  });
};

export const inserData = async (expressListRoutes, app) => {
  await getPermissionsData(expressListRoutes, app);
  await sendPermissionsToAuthServer();
};

export default { getMethodName, inserData };
