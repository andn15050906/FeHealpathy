import data from '@/api/data.json';

const GlobalState = {
    getUserProfile: () => { },
    isAuth: () => { },
    getLang: () => { }
}

GlobalState.getUserProfile = () => data.UserProfile.UserInfo;
GlobalState.isAuth = () => true;
GlobalState.getLang = () => "en";

export default GlobalState;