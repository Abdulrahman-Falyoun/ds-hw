import {Model} from "mongoose";
import {ClientSession} from "mongodb";

export const useTransaction = async (
  model: Model<any>,
  func: (session: ClientSession) => Promise<void> | void,
) => {
  const session = await model.startSession();
  session.startTransaction();
  try {
    await func(session);
    // Closing transaction
    await session.commitTransaction();
  } catch (e) {
    console.log("e [transaction-initializer]: ", (e.message || e));
    await session.abortTransaction();
    throw e;
  } finally {
    session.endSession();
  }
};
