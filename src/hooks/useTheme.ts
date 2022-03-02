import { darkTheme, GlobalTheme } from "naive-ui";
import { ref, Ref } from "vue";

interface Theme {
  name: string;
  value: GlobalTheme | null;
}
const availableThemes: Theme[] = [
  {
    name: "深色",
    value: darkTheme,
  },
  {
    name: "浅色",
    value: null,
  },
];
export default function () {
  const currentTheme: Ref<Theme> = ref(availableThemes[0]);
  const nextThemeName: Ref<string> = ref(availableThemes[1].name);
  return {
    currentTheme,
    nextThemeName,
    toggleTheme() {
      console.log("toggle theme");
      const indexOfCurrent = availableThemes.findIndex((theme) => {
        return theme.name == currentTheme.value.name;
      });
      if (indexOfCurrent == 0) {
        currentTheme.value = availableThemes[1];
        nextThemeName.value = availableThemes[0].name;
      } else if (indexOfCurrent == 1) {
        currentTheme.value = availableThemes[0];
        nextThemeName.value = availableThemes[1].name;
      }
      console.log(`current theme name:${currentTheme.value.name}`);
    },
  };
}
