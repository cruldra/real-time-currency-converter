import { createStore } from "@satha/core";
import { IConversionProfile } from "@/models/IConversionProfile";
import { ref, Ref, watch } from "vue";
export default function () {
  const conversionProfile: Ref<IConversionProfile> = ref<IConversionProfile>({
    src: "CNY",
    amount: 1,
    targets: ["AED"],
  });
  const profileStore = createStore("profile-store", conversionProfile.value);
  conversionProfile.value = profileStore.get();
  watch(conversionProfile, (value) => {
    profileStore.set((entry: IConversionProfile) =>
      Object.assign(entry, value)
    );
  });

  return {
    conversionProfile,
  };
}
