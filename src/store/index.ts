import { init, RematchDispatch, RematchRootState } from "@rematch/core";
import immerPlugin from "@rematch/immer";
import selectPlugin from "@rematch/select";
import loadingPlugin, { ExtraModelsFromLoading } from "@rematch/loading";
import { models, RootModel } from "./models";

type FullModel = ExtraModelsFromLoading<RootModel>;

export const store = init<RootModel, FullModel>({
  models,
  plugins: [immerPlugin(), selectPlugin(), loadingPlugin()],
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel, FullModel>;
