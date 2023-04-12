import { getUserByIdPersistance } from "../../persistance/users";
import { deleteUserPersistance } from "../../persistance/users/";

export const deleteUserInteractor = async (userId: string, id: string) => {
  const user = await getUserByIdPersistance(userId);

  if (!user) {
    return { ERROR: "Cannot Delete" };
  }

  if (user.id !== userId) {
    return { ERROR: "Only the creator can delete a Post" };
  }

  return await deleteUserPersistance(id);
};
