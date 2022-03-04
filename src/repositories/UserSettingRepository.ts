import { IUserSetting } from "@/models/IUserSetting";

interface UserSettingRepository {
  get(): Promise<IUserSetting>;

  save(userSetting: IUserSetting, callback?: () => void): Promise<void>;
}

class DefaultUserSettingRepository implements UserSettingRepository {
  private key = "userSettings";

  async get(): Promise<IUserSetting> {
    let userSetting: IUserSetting | undefined;
    await chrome.storage.sync.get(this.key, (items) => {
      userSetting = items as IUserSetting;
    });
    return (
      userSetting ?? {
        apiKeys: [
          "15e0a8fb77f44c73baeb1614e548c284",
          "0ca0c602c38049cb90cbe09a1a70eb75",
        ],
        enableHistoricalReporting: true,
        preferredApi: "OpenExchange",
        updateFrequency: 60,
        wordMarkingRules: [],
      }
    );
  }

  async save(userSetting: IUserSetting, callback?: () => void): Promise<void> {
    await chrome.storage.sync.set(
      {
        key: this.key,
        value: userSetting,
      },
      callback
    );
  }
}

const userSettingRepository = new DefaultUserSettingRepository();
export default userSettingRepository;
