import PRISMA from "../../../utils/prisma.mjs";
import { getCategories } from "../../../utils/axiosRequests.mjs";

const seedQuizCategories = async (req, res) => {
  const currentCategories = await PRISMA.category.count();
  if (currentCategories > 0) {
    console.info(
      `[SEED] Category Table Populated With #${currentCategories} Records.`,
    );
    return;
  }

  const CATEGORYDATA = await getCategories();
  Promise.all(
    CATEGORYDATA.map((catData) => {
      const createusers = PRISMA.category.create({
        data: {
          id: catData.id,
          name: catData.name,
        },
      });
      return createusers;
    }),
  )
    .then((data) => {
      const count = Object.keys(data).length;
      console.info(`[SEED] ${count} user records successfully created`);
      res
        .status(201)
        .json({ msg: `[SEED] ${count} user records successfully created` });
    })
    .catch((e) => {
      console.error("[SEED] Failed to create user records", e);
      res.status(401).json({ msg: "[SEED] Failed to create user records" });
    });
};

// eslint-disable-next-line import/prefer-default-export
export { seedQuizCategories };
