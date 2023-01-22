import PRISMA from "../../../utils/prisma.js";
import { getCategories } from "../../../utils/axiosRequests.js";

const seedQuizCategories = async (req, res) => {
  const currentCategories = await PRISMA.category.count();
  if (currentCategories > 0) {
    console.info(
      `[SEED] Category Table Already Populated With #${currentCategories} Records.\nNo New Records Added.`,
    );
    res.status(304).json({
      msg: `[SEED] Category Table Already Populated With #${currentCategories} Records. No New Records Added.`,
    });
  } else {
    const CATEGORYDATA = await getCategories();
    const data = Array.from(CATEGORYDATA).map((category) => ({
      id: category.id,
      name: category.name,
    }));
    await PRISMA.category
      .createMany({
        data,
      })
      .then((dataRes) => {
        console.info(
          `[SEED] ${dataRes.count} category records successfully created`,
        );
        res.status(201).json({
          msg: `[SEED] ${dataRes.count} category records successfully created`,
        });
      })
      .catch((e) => {
        console.error("[SEED] Failed to create category records", e);
        res
          .status(401)
          .json({ msg: "[SEED] Failed to create category records", error: e });
      });
  }
};

// eslint-disable-next-line import/prefer-default-export
export { seedQuizCategories };
