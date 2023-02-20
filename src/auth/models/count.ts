import { createModel, RematchDispatch, RematchRootState } from "@rematch/core";
import type { RootModel } from "@app/store/models";

type CountState = {
  count: number;
};

const increment = (draftState: CountState, payload: number) => {
  draftState.count += payload;
};

const incrementAsync = async (
  payload: number,
  dispatch: RematchDispatch<RootModel>,
  _rootState: RematchRootState<RootModel>
): Promise<void> => {
  await new Promise((r) => setTimeout(r, 2000));
  dispatch.count.increment(payload);
};

const count = createModel<RootModel>()({
  state: {
    count: 2,
  } as CountState,
  reducers: {
    increment,
  },
  effects: (dispatch) => ({
    async incrementAsync(payload, rootState) {
      return incrementAsync(payload, dispatch, rootState);
    },
  }),
});

export default count;
