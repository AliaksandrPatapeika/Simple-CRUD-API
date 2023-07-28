import { v4 as uuidV4 } from 'uuid';
import { User, UserWithoutId } from '../types';

class DataBase {
  data: Map<User['id'], User>;

  constructor() {
    this.data = new Map<User['id'], User>();
  }

  get users(): User[] {
    return [...this.data.values()];
  }

  getUser(userId: User['id']): User | null {
    return this.data.get(userId) || null;
  }

  createUser(user: UserWithoutId): User {
    const newUser: User = {
      id: uuidV4(),
      ...user,
    };

    this.data.set(newUser.id, newUser);

    return newUser;
  }

  updateUser(user: User): User | null {
    const userInDB = this.getUser(user.id);

    if (!userInDB) {
      return null;
    }

    const updatedUser: User = {
      ...userInDB,
      ...user,
    };

    this.data.set(updatedUser.id, updatedUser);

    return updatedUser;
  }

  deleteUser(userId: User['id']): boolean {
    return this.data.delete(userId);
  }
}

export { DataBase };
