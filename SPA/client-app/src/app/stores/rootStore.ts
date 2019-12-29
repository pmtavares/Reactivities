import ActivityStore from "./activityStore";
import { configure} from 'mobx';
import UserStore from "./userStore";
import { createContext } from "react";
import CommonStore from "./commonStore";

configure({enforceActions: 'always'});
export class RootStore
{
    activityStore: ActivityStore;
    userStore: UserStore;
    commonStore: CommonStore;

    constructor()
    {
        this.activityStore = new ActivityStore();
        this.userStore = new UserStore(this);
        this.commonStore = new CommonStore(this);
    }
}

export const RootStoreContext = createContext(new RootStore());