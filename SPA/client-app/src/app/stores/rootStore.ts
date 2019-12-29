import ActivityStore from "./activityStore";
import { configure} from 'mobx';
import UserStore from "./userStore";
import { createContext } from "react";

configure({enforceActions: 'always'});
export class RootStore
{
    activityStore: ActivityStore;
    userStore: UserStore;

    constructor()
    {
        this.activityStore = new ActivityStore();
        this.userStore = new UserStore();
    }
}

export const RootStoreContext = createContext(new RootStore());