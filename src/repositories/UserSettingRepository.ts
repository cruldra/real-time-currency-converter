import { IUserSetting } from "@/models/IUserSetting";

interface UserSettingRepository {
  get(): Promise<IUserSetting>;

  save(userSetting: IUserSetting): Promise<void>;
}

class DefaultUserSettingRepository implements UserSettingRepository {
  async get(): Promise<IUserSetting> {
    return (
      await chrome.storage.sync.get({
        userSettings: {
          apiKeys: [
            "15e0a8fb77f44c73baeb1614e548c284",
            "0ca0c602c38049cb90cbe09a1a70eb75",
          ],
          enableHistoricalReporting: true,
          preferredApi: "OpenExchange",
          updateFrequency: 60,
          wordMarkingRules: [],
        },
      })
    )["userSettings"] as IUserSetting;
  }

  async save(userSetting: IUserSetting): Promise<void> {
    return await chrome.storage.sync.set({
      userSettings: userSetting,
    });
  }
}

const userSettingRepository = new DefaultUserSettingRepository();
export default userSettingRepository;
