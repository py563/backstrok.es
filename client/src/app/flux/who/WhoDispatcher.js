/* @flow */

import type { WhoAction } from './WhoActions';

import { Dispatcher } from 'flux';

const dispatcher: Dispatcher<WhoAction> = new Dispatcher();

export default dispatcher;
