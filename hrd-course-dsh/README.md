# HRD-AI 课程答疑 · DSH 本地样板

用 DSH 要求的 Node.js 和 pnpm，在仓库根目录运行 `pnpm install` 和 `pnpm run build:artifacts`。样板需要本机的 HRD-AI 源码。默认读取与本仓库同级的 `hrd-ai---`，也可以通过 `HRD_AI_ROOT` 指定该源码目录的绝对路径。

在仓库根目录执行一次 `node hrd-course-dsh/run-local.mjs install`，再用 `node hrd-course-dsh/run-local.mjs` 启动。复制终端打印的本机登录链接到浏览器。会话和配置默认保存在 `hrd-course-dsh/.local/`，可以用 `DSH_HOME` 指定其他目录。

样板在 127.0.0.1:3081 运行，通过 DSH 本地登录进入。五个课程助理由一个业务插件提供，DSH 预设声明在 `cordis.patch.yml`，各模块的名称、简介和引导题在 `client.js`。

启动器从 HRD-AI 的 `.env.local` 读取 DeepSeek 与得到大脑配置。一至五模块分别使用 `GETNOTE_KNOWLEDGE_ID_MODULE_ONE` 到 `GETNOTE_KNOWLEDGE_ID_MODULE_FIVE`。多个模块可填写同一个库 ID。需要独立库的模块填写自己的 ID 并重启样板。缺少模块的库 ID 时，该模块会提示课程资料暂不可用，不会改查其他模块。
