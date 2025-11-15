import 'react-i18next'

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    // If you want strict key inference, import the JSON and use its type:
    // resources: { common: typeof import("../public/locales/en/common.json") }
  }
}
