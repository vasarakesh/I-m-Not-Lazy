import { deleteAllUserData } from './firestore';
import { deleteAuthUser } from './auth';

export async function deleteAccount(uid) {
  await deleteAllUserData(uid);
  await deleteAuthUser();
}
