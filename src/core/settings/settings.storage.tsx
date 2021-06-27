import { ISettings } from "./settings.interface";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsStorageInit = async (initalState:ISettings):Promise<ISettings> => {
    try {
        const jsonValue:string | null = await AsyncStorage.getItem('settings');
        if (jsonValue)  {
            return {
                ...initalState, 
                ...JSON.parse(jsonValue)
            };
        }
      } catch(e) {
        console.error(e)
      }
    return initalState;
}

export const SettingsStorageSave = (settings:ISettings) => {
  try {
    const jsonValue:string = JSON.stringify(settings);
    AsyncStorage.setItem('settings', jsonValue)
      .then(() => {})
      .catch((e) => console.log(e));
  } catch(e) {
    console.error(e)
  }
}