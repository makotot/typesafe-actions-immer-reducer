import { produce, Draft, Produced } from "immer";
import { createAction, ActionType, getType } from "typesafe-actions";

const fooBarInitialState = {
  foo: 0,
  bar: 0
};

type FooBarStateType = typeof fooBarInitialState;

const INCREMENT_FOO = "INCREMENT_FOO";
const UPDATE_FOO_TO_X = "UPDATE_FOO_TO_X";
const UPDATE_BAR_TO_Y = "UPDATE_BAR_TO_Y";
const incrementFoo = createAction(INCREMENT_FOO)();
const updateFooToX = createAction(UPDATE_FOO_TO_X, ({ x }: { x: number }) => ({
  x
}))();
const updateBarToY = createAction(UPDATE_BAR_TO_Y, ({ y }: { y: number }) => ({
  y
}))();

type Actions =
  | ActionType<typeof incrementFoo>
  | ActionType<typeof updateFooToX>
  | ActionType<typeof updateBarToY>;

const reduceWithImmer = <S>(
  state: S,
  reduce: (draft: Draft<S>) => void | S
): S | Produced<S, S> => {
  return produce(state, draft => {
    return reduce(draft);
  });
};

const reduce = (state: FooBarStateType, action: Actions) =>
  reduceWithImmer(state, draft => {
    switch (action.type) {
      case getType(updateFooToX):
        draft.foo = action.payload.x;
        break;
      case getType(incrementFoo):
        ++draft.foo;
        break;
      case getType(updateBarToY):
        draft.bar = action.payload.y;
        break;
      default:
        return state;
    }
    return draft;
  });

const res1 = reduce(fooBarInitialState, incrementFoo());
const res2 = reduce(
  { ...fooBarInitialState, bar: -50000 },
  updateFooToX({ x: 300 })
);
const res3 = reduce(fooBarInitialState, updateBarToY({ y: 222 }));
console.log(res1);
console.log(res2);
console.log(res3);
