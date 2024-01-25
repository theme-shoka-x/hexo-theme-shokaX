# Override Default Translations

If you would like to customize the default translation, you do not need to modify the translation files in the `languages` directory. You can override all translations using [Data Files](https://hexo.io/docs/data-files).

1. Creat a `languages.yml` in `source/_data`.
2. Insert following codes: (be careful about the two-space indent)

    ```yml
    # language
    zh-CN:
      # items
      post:
        copyright:
          # the translation you perfer
          author: 本文博主
    en:
      menu:
        schedule: Calendar
    ```

# Current language packs

- ### English (en)
- ### 日本語 (ja)
- ### 中文-简体 (zh-CN)
- ### 中文-繁体 (zh-HK)
- ### 中文-台湾 (zh-TW)
- ### Español (es)
- ### Deutsch (de)
- ### Français (fr)
- ### Italiano (it)
- ### Português (pt)
- ### Русский (ru)
- ### العربية (ar)
- ### हिंदी (hi)
- ### 한국어 (ko)