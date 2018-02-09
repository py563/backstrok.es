/* @flow */

import type { Action } from '../who/WhoActions';

import LoadObject from '../load_object/LoadObject';
import LoadObjectMap from '../load_object/LoadObjectMap';
import { ReduceStore } from 'flux/utils';
import WhoDataManager from './WhoDataManager';
import WhoDispatcher from './WhoDispatcher';

type State = LoadObjectMap<string, string>;

class WhoStore extends ReduceStore<Action, State> {
  constructor() {
    super(WhoDispatcher);
  }

  getInitialState(): State {
    console.log('Get initial state');
    return new LoadObject(keys =>
      WhoDispatcher.dispatch({
        type: 'who/start-load',
      }),
    );
  }

  async reduce(state: State, action: Action): State {
    console.log('Running ' + action.type);
    switch (action.type) {
      // WHO
      case 'who/start-load':
        await WhoDataManager.genLoad();
        return state.merge(
          action.who.map(who => [who.id, LoadObject.loading()]),
        );

      case 'who/loaded':
        return state.merge(
          action.who.map(who => [who.id, LoadObject.withValue(who)]),
        );

      case 'who/load-error':
        return state.merge(
          action.who.map(who => [who.id, LoadObject.withError(action.error)]),
        );

      default:
        return state;
    }
  }
}

export default new WhoStore();
