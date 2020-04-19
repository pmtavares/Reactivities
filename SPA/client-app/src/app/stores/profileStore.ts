import { RootStore } from "./rootStore";
import {observable, action, runInAction, computed} from 'mobx';
import { IProfile, IPhoto } from "../models/profile";
import agent from "../api/agent";
import { toast } from 'react-toastify';


export default class ProfileStore {
    rootStore: RootStore

    constructor(rootStore: RootStore){
        this.rootStore = rootStore
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile = true;
    @observable uploadingPhoto = false;
    @observable loading = false;
    @observable deleteLoading = false;

    @computed get isCurrentUser()
    {
        if(this.rootStore.userStore.user && this.profile)
        {
            return this.rootStore.userStore.user.username === this.profile.username
        }
        else{
            return false;
        }
    }

    @action loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try{
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        }
        catch(error)
        {
            runInAction(() => {
                this.loadingProfile = false;
                toast.error("Problem loading profile");
            })
            console.log(error)
        }
    }

    @action uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try{
            const photo = await agent.Profiles.uploadPhoto(file);
            runInAction(() => {
                if(this.profile)
                {
                    this.profile.photos.push(photo);
                    if(photo.isMain && this.rootStore.userStore.user)
                    {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url
                    }
                }
                this.uploadingPhoto = false
                toast.info("Photo uploaded")
            })
        }
        catch(e)
        {
            console.log(e)
            toast.error("Could not upload photo")
            runInAction(() => {
                this.uploadingPhoto = false
            })
        }
    }

    @action setMainPhoto = async (photo: IPhoto) => {
        this.loading = true;
        try{
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction(() => {
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find(a => a.isMain)!.isMain = false;
                this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                this.loading = false;
            })
           
        }
        catch(error)
        {
            runInAction(() => {

                toast.error("Problem seting the main Photo");
            })
            this.loading = false
            console.log(error)
        }
    }

    @action deletePhoto = async (photo: IPhoto) => {
        this.deleteLoading = true;
        try{
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {

                this.profile!.photos = this.profile!.photos.filter(a => a.id !== photo.id)
                this.deleteLoading = false;
            })
           
        }
        catch(error)
        {
            runInAction(() => {
                toast.error("Problem deleting the Photo");
            })
            this.deleteLoading = false
            console.log(error)
        }
    }

    @action updateProfile = async (profile: Partial<IProfile>) => {
        try{
            await agent.Profiles.updateProfile(profile);
            runInAction(() => {
                if(profile.displayName !== this.rootStore.userStore.user!.displayName)
                {
                    this.rootStore.userStore.user!.displayName = profile.displayName!;
                }
                this.profile = {...this.profile!, ...profile}
            });
        }
        catch(e)
        {
            toast.error("Problem updating profile")
        }
    } 



}