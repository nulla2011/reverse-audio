import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./locales/en.json"
import zh from "./locales/zh.json"

const lang = ["zh", "zh-cn", "zh-CN"].includes(navigator.language) ? "zh" : "en"

i18n.use(initReactI18next).init({
  lng: lang,
  resources: {
    en: {
      translation: en
    },
    zh: {
      translation: zh
    }
  }
})

export default i18n
