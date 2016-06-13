"use babel";

import { combineReducers } from "redux";
import stores from ".";
const reducer = combineReducers(stores);
export default () => reducer(undefined, { type: "@@redux/INIT" });
