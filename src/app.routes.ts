const tutorialRoot = "tutorial";
const userRoot = "user";

export const routesV1 = {
  version: "v1",
  user: {
    login: `/${userRoot}/login`,
    signup: `/${userRoot}/signup`,
  },
  tutorial: {
    create: `/${tutorialRoot}`,
    update: `/${tutorialRoot}/:id`,
    delete: `/${tutorialRoot}/:id`,
    all: `/${tutorialRoot}`,
  }
};
