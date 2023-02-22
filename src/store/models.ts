import {Models} from '@rematch/core';
import {auth} from '@app/auth/models';

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
}
export const models: RootModel = {auth};
