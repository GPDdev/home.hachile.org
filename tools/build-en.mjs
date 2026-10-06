import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';

const translations = {
  '目录': 'Menu', '导航 / CONTENTS': 'NAVIGATION / CONTENTS',
  '自我介绍': 'About me', '关于我': 'Who I am', '兴趣与方向': 'Interests and goals',
  '我的常用网站': 'My websites', '常用站点': 'Frequent sites', '个人站点': 'Personal sites', '社群与工具': 'Communities and tools',
  '我的社群': 'My communities', '校园与兴趣': 'Campus and interests',
  '小五代管': 'Managed by Xiao Wu', '中学时期': 'School years', '我的联系方式': 'Contact me',
  '联系方式': 'Contact', '直接联系': 'Direct contact', '社交媒体': 'Social media', '其他身份': 'Other identities',
  '其他账号': 'Other accounts', '讨论区': 'Discussion', '在这里留言交流': 'Leave a message here', '站内讨论': 'On-site discussion',
  '亮色模式': 'Light mode', '你好，我是': "Hi, I'm", '认识我': 'Meet me', '浏览网站': 'Browse sites',
  '同济大学机器人专业本科生。这里收着我的网站、常用工具、运营的社群，以及一些正在探索的方向。': 'Robotics undergraduate at Tongji University. Here you will find my websites, favorite tools, communities, and ideas I am exploring.',
  '关于我，以及我正在做的事。': 'A little about me and what I am working on.',
  '从小镇做题家和 OIer，': 'From a small-town student and OIer',
  '到机器人与具身智能的探索者。': 'to exploring robotics and embodied AI.',
  '曾经选科物化生、热衷政史地；现在就读于同济大学机器人专业，正在探索具身智能、世界模型等科研方向。Gunpowder 这个头像和网名从 2020 年开始使用。除此之外，我还有十几个不同的网络身份，现在被统一归入 Hachile 网站。': 'I studied physics, chemistry, and biology while enjoying history, politics, and geography. Now I study robotics at Tongji University and explore embodied AI and world models. I have used the Gunpowder name and avatar since 2020. I also have more than a dozen online identities, now brought together under the Hachile network.',
  '学校': 'University', '同济大学': 'Tongji University', '专业': 'Major', '机器人': 'Robotics',
  '关注': 'Focus', '具身智能、世界模型': 'Embodied AI, world models', '社交': 'Social',
  '国豪书院未来技术班（机器人方向）': 'Guohao College Future Technology Class (Robotics)',
  '运营着100+个网络社群，是同济大学重要的传播节点之一。': 'I run more than 100 online communities and am one of Tongji University’s key information-sharing hubs.',
  '运营着100+个网络社群': 'I run more than 100 online communities',
  '喜欢历史、时政、人文地理；': 'I enjoy history, current affairs, and human geography;',
  '偶尔打音游、P 社游戏和 io 小游戏；': 'I sometimes play rhythm games, Paradox games, and io games;',
  '也对军事、城市规划、哲学、轨道交通、板绘与作曲感兴趣。': 'I am also interested in military studies, urban planning, philosophy, rail transit, digital art, and composition.',
  '具身智能': 'Embodied AI', '世界模型': 'World models', '城市规划': 'Urban planning', '哲学': 'Philosophy', '社群运营': 'Community building',
  '我写的、维护的，或经常打开的站点。': 'Sites I build, maintain, or visit often.',
  '文章与笔记': 'Articles and notes', '图像与收藏': 'Images and collections', '开发项目': 'Development projects', '研究与作品': 'Research and work', '常用在线工具': 'Everyday online tools', '站群总览与更新日志': 'Network overview and changelog',
  '个人主题站点': 'Personal themed site', '国豪相关站点': 'Guohao College site', '主题地图': 'Community map', '综合空情识别系统网页版': 'Web app for integrated air-situation recognition',
  '点击群号即可复制。部分社群暂不开放加入。': 'Click a group number to copy it. Some communities are not currently open to new members.',
  '同济大学国豪书院 25 级学生群': 'Tongji Guohao College Class of 2025', '暂不开放加入': 'Not accepting new members',
  '同济国豪联谊会': 'Tongji Guohao Social Club', '同济 AI 与大模型交流群': 'Tongji AI and LLM Community',
  '香港理工大学研学交换互助群': 'PolyU Study Exchange Support', '数学建模竞赛交流与组队群': 'Math Modeling Competition Team-up',
  '同济国豪竞赛信息交流与组队群': 'Tongji Guohao Competition Team-up', '铜陵同济校友会': 'Tongling–Tongji Alumni',
  '主义主义哲学研究中心': 'Ism Philosophy Research Center', 'XCPC 集训营': 'XCPC Training Camp',
  '同济 25 级未来技术班交流群': 'Tongji Future Technology Class of 2025', '同济 25 级安徽同学群': 'Tongji Anhui Students, Class of 2025',
  'Gunpowder Central · 个人主群': 'Gunpowder Central · Main community', '济星公社 J-Star Commune': 'J-Star Commune',
  '同舟共济会': 'Tongzhou Gongji Community', '长三角大学生交流群': 'Yangtze River Delta University Students',
  '钻石投票交流群': 'Diamond Voting Community', 'kiomet.com 中国玩家交流群': 'kiomet.com Chinese Players',
  'Python 交流群': 'Python Community', '铜陵学生交流群': 'Tongling Students', 'HTML 学习交流群': 'HTML Learning Community',
  'mindofnations 交流群': 'Mind of Nations Community', '神人养蛊群': 'Shenren Community',
  '高校学生发疯群': 'University Students Unwind', '高校学生奋斗群': 'University Students Study Together',
  'Minecraft 好望角城镇交流群': 'Minecraft Cape of Good Hope Town', '同济体育锻炼群': 'Tongji Fitness Community',
  '俄乌冲突交流群': 'Russia–Ukraine Conflict Discussion', 'OIer 集训交流群': 'OIer Training Community',
  '西安交通大学少年班备考群': "Xi'an Jiaotong University Youth Class Prep", '中科大少年班备考交流群': 'USTC Youth Class Prep',
  '桂山精神传承中心': 'Guishan Spirit Community', '高中直升班交流群': 'High School Direct-Admission Class',
  '小天才手表俱乐部': 'Xiao Tiancai Watch Club', '高中文化课 / 竞赛膜佬群': 'High School Academics and Competitions',
  '高中学习资料交流群': 'High School Study Resources', '河大附中 QQ 频道管理群': 'HDFZ QQ Channel Admins',
  '附中同盟会': 'Affiliated School Alliance', 'OHYS 世界观交流群': 'OHYS Worldbuilding Community',
  '附中谐联 F.H.U.': 'F.H.U. School Community', '学而思编程社区公会 3 群': 'Xueersi Coding Community Guild 3',
  '铜陵 generals.io 交流群': 'Tongling generals.io Community',
  '查看更多社群请访问': 'For more communities, visit', '查看所有社群请访问': 'To see all communities, visit',
  '欢迎联系我，也欢迎交换友链。': 'Feel free to reach out or exchange site links.',
  '欢迎交换友链谢谢喵QAQ': 'Feel free to exchange site links, meow QAQ',
  '点击复制号码': 'Click to copy', '微信': 'WeChat', '发送邮件': 'Send email',
  '知乎': 'Zhihu', '洛谷': 'Luogu', '博客园': 'CNBlogs',
  '小红书号：42283614369': 'Xiaohongshu ID: 42283614369', '抖音号：79492713231': 'Douyin ID: 79492713231',
  '百度贴吧': 'Baidu Tieba', '贴吧号：5331523714': 'Tieba ID: 5331523714', '网易云音乐': 'NetEase Cloud Music', '复制': 'Copy',
  '在不同社群和项目里使用的其他账号。': 'Other accounts I use in different communities and projects.',
  '我在 Brony 社群的身份': 'My identity in the Brony community',
  '？？？': '???', '还有更多尚未解锁……': 'More identities yet to be unlocked…',
  '让信息流动！': 'Let information flow!',
  '同济 AI 大模型交流群管理员': 'Tongji AI and LLM Community admin', 'QQ 官方 Bot': 'Official QQ Bot',
  '小五': 'Xiao Wu', '社群管理 Bot': 'Community management bot',
  '查看机器人账号请访问': 'To see bot accounts, visit',
  '展开查看完整更新日志': 'Expand full changelog', '首页布局调整': 'Homepage layout update',
  '新增 wplace 交流群': 'wplace discussion group added',
  '在 groups.hachile.org 的新增收录目录加入 wplace 交流群 1025330162。': 'Added the wplace discussion group 1025330162 to the newly added directory on groups.hachile.org.',
  '其他身份卡片字号调整': 'Other-identity card typography update',
  '个人站点加入 Site 并统一中文字体': 'Site added to personal sites and Chinese typography unified',
  '恢复原有中文字体设置': 'Original Chinese typography restored',
  '撤销 Home 全站中文字体统一改动，恢复此前的字体搭配；保留个人站点中的 Site 入口。': 'Reverted the unified Chinese font across Home and restored the previous typography while keeping Site in personal sites.',
  '在 Home 的个人站点加入 site.hachile.org，并将全站中文统一为首页介绍段落所用字体。': 'Added site.hachile.org to Home’s personal sites and unified Chinese text with the font used in the hero introduction.',
  '将 Home 其他身份卡片的说明和 QQ 号码文字缩小至原大小的 60%，身份名称保持不变。': 'Reduced the description and QQ number text in Home identity cards to 60% of their previous size while keeping account names unchanged.',
  '新增香港小马交流群': 'Hong Kong pony discussion group added',
  '在 groups.hachile.org 的小马社群目录加入香港小马交流群 1126362557。': 'Added the Hong Kong pony discussion group 1126362557 to the pony community directory on groups.hachile.org.',
  '社群目录新增四个交流群': 'Four discussion groups added to the community directory',
  '在 groups.hachile.org 收录小马与furry文化研究群、pony hypnosis交流群、小马tulpa交流群和清醒梦交流群。': 'Added the pony and furry culture, pony hypnosis, pony tulpa, and lucid dreaming discussion groups to groups.hachile.org.',
  '网页版桌宠动作与尺寸修正': 'Web pony movement and sizing corrected',
  '修正 pony.hachile.org 桌宠静止动作漂移，行走保持高度、拖拽使用飞行动作；全部动作支持左右朝向并保留最后朝向，按 GIF 原始像素尺寸显示，取消动作切换和手机端缩放。': 'Fixed stationary-action drift on pony.hachile.org: walking stays level and dragging uses flight. All actions support both directions and retain the last facing; GIFs render at native pixel size without action-dependent or mobile scaling.',
  '社群档案加入朋友评价': 'A friend’s comment added to the community archive',
  '在 groups.hachile.org 首页加入一段 2025 年的群聊评价，并注明当时的建群与活跃群数量。': 'Added a 2025 group-chat comment to the groups.hachile.org homepage, noting the numbers of groups created and active at the time.',
  'Sky 英文字体恢复常规字重': 'Sky display font returned to regular weight',
  '英文模式的 Equestria 字体取消浏览器模拟加粗，桌面和手机端统一使用常规字重。': 'Removed synthetic bold from Equestria lettering in English mode on desktop and mobile.',
  '小马国地图更新背景与海浪': 'Equestria map background and waves updated',
  '采用新背景和提供的小船图片，从原地图提取三种海浪，让浪纹在海面随机从左向右漂移。': 'Used the new background and supplied boat image, and extracted three original wave patterns to drift randomly across the sea from left to right.',
  'Pony 加入站点目录': 'Pony added to the site directory',
  '将 pony.hachile.org 收录到 The Hachile Project 的站点目录，并约定今后新站上线时同步收录。': 'Added pony.hachile.org to The Hachile Project directory and established that future sites should be listed there when launched.',
  '天蓝晨风的小马个人主页上线': 'Skyblue Mornbreeze pony homepage launched',
  '新建 pony.hachile.org，以纵向滚动页面展示个马简介与作品入口，加入逐层渐显动效、可拖动的桌面小马及五首音乐的 Bandcamp 官方播放器。': 'Launched pony.hachile.org with a scrolling pony profile, links to creative work, layered reveal effects, a draggable desktop pony, and five official Bandcamp players.',
  '小马国地图恢复原画': 'Original Equestria map restored',
  '改用 newnewmap 原图，不再处理海浪；恢复原版火山烟和帆船，统一中文字体，并按地图上的铁路重新校准列车路线。': 'Switched to the untouched newnewmap artwork, leaving its waves static; restored the original smoke and sailboats, unified Chinese typography, and retraced train routes along visible rails.',
  '小马国地图动效细节优化': 'Equestria map animation refinements',
  '清理地图中的静态海浪和火山残烟，调整帆船位置，并让火车头及车厢分别贴合铁路曲线行驶。': 'Cleaned up static sea waves and leftover volcano smoke, moved both sailboats, and made each train car follow the railway curves independently.',
  '社群目录补充国豪26级学生群': 'Guohao Class of 2026 group added',
  '在 groups.hachile.org 加入同济大学国豪书院26级学生群，并标注暂不开放加入。': 'Added the Tongji Guohao College Class of 2026 group to groups.hachile.org and marked it as not accepting new members.',
  'Sky 地图动画贴合原画': 'Sky map animations refined',
  '缩小帆船，将原图海浪改为漂移效果，替换火山烟雾和火车，并让列车沿铁路在各站间行驶。': 'Shrank the sailboats, animated the original map waves and volcano smoke, and replaced the train with a multi-car sprite traveling between railway stations.',
  'Hachile 宗旨补充连续性': 'Continuity added to Hachile purpose',
  '在 The Hachile Project 的宗旨中加入维系旧友联系、让社群关系延续的理念。': 'Added the idea of staying in touch with old friends and keeping community relationships alive to The Hachile Project purpose.',
  '社群目录新增交流群': 'More discussion groups added',
  '在 groups.hachile.org 补充五个 QQ 交流群，并更新 /mlpol/ 备用群名称。': 'Added five QQ discussion groups to groups.hachile.org and updated the /mlpol/ backup group name.',
  'Hachile Bot 交流群入口': 'Hachile Bot community link added',
  '在 bot.hachile.org 的 Hachile 卡片中加入 QQ 交流群 822082293，并支持点击复制群号。': 'Added QQ group 822082293 to the Hachile card on bot.hachile.org with click-to-copy support.',
  'Ponylonia 项目交流群上线': 'Ponylonia project group added',
  '在 ponylonia.hachile.org 增加 The Ponylonia Project 交流群 291927355。': 'Added The Ponylonia Project QQ group 291927355 to ponylonia.hachile.org.',
  'Sky 左下角加入单曲播放器': 'Single-track player added to Sky',
  '使用 Bandcamp 官方嵌入播放器在 Sky 地图左下角播放《Equestria\'s Finest》，手机版同步加入，并更新隐私说明。': 'Added the official Bandcamp embed for Equestria\'s Finest to the lower-left corner of the Sky map, including mobile, and updated the privacy notice.',
  'Sky 增加官方音乐入口': 'Official music links added to Sky',
  '在 Sky 地图右下角和手机版加入五首歌曲的 Bandcamp 官方播放入口，不在本站托管音频。': 'Added official Bandcamp links for five songs to the lower-right corner of the Sky map and mobile page without hosting audio on the site.',
  'Hachile 宗旨展示': 'Hachile purpose added',
  '在 The Hachile Project 首页加入网络身份、社群与连接理念的宗旨说明。': 'Added a purpose statement about online identities, communities, and connections to The Hachile Project homepage.',
  'Sky 地图场景动画扩展': 'More animated details on the Sky map',
  '为海面加入漂移浪纹，让火山烟雾与尼亚加拉瀑布流动，并让火车定时沿铁路驶向巴尔的马。': 'Added drifting sea waves, moving volcano smoke and Neighagra Falls, plus a train that periodically follows the railway to Baltimare.',
  'Sky 地图新增三处站点入口': 'Three new destinations on the Sky map',
  '在水晶城、狮鹫岩与苹果鲁萨加入站点链接，并从底图移除旧罗盘、帆船、红箭头和红龙。': 'Added site links at Crystal Empire, Griffonstone, and Appleloosa, and removed the old compass, sailboats, red arrow, and dragon from the background map.',
  'The Hachile Project 展示页上线': 'The Hachile Project showcase launched',
  '新建 site.hachile.org，汇总 Hachile 站群的站点介绍、访问入口和 Home 更新日志。': 'Launched site.hachile.org with a directory of Hachile sites, direct links, and a copy of the Home changelog.',
  'Project Ponylonia 展示站上线': 'Project Ponylonia showcase launched',
  '新建 ponylonia.hachile.org，展示机器马 Bot、个人穿越系统愿景及 Hachile Project。': 'Launched ponylonia.hachile.org to showcase the robot pony Bot, the personal crossover system vision, and Hachile Project.',
  '门户入口说明补充': 'Portal entry descriptions expanded',
  '扩展 Hachile Portal 简历与个人主页入口的说明文字，并适配卡片高度。': 'Expanded the CV and personal homepage entry descriptions on Hachile Portal and adjusted card height.',
  'Sky 地图动态效果': 'Animated Sky map',
  '为小马国地图加入漂移云朵与摇摆帆船图层，并遵循系统减少动态效果设置。': 'Added drifting clouds and gently bobbing sailboats to the Equestria map, respecting reduced-motion preferences.',
  'Home 卡片排版与身份补充': 'Home card layout and identity update',
  '统一常用站点卡片字号与文字间距，加入 Pegasus Bluie 身份，并将五张身份卡在桌面端排成一行。': 'Unified site-card title sizes and text spacing, added the Pegasus Bluie identity, and arranged all five identity cards in one desktop row.',
  'Bot 站点增加部署配置项目': 'Bot deployment config project added',
  '在 bot.hachile.org 的机器人展示下方加入 config-for-qq-bot 项目入口。': 'Added the config-for-qq-bot project link below the bot showcase on bot.hachile.org.',
  '门户新增快速了解入口': 'Quick introduction added to the portal',
  '在 Hachile Portal 中英文桌面版与手机版增加通往 hachile.org/gunpowder 的入口，并恢复此前误改的入口说明。': 'Added a link to hachile.org/gunpowder on the Chinese and English desktop and mobile portal pages, and restored the previous entry descriptions.',
  'Sky 小马谷增加社群与 Bot 入口': 'Community and Bot links added to Sky Ponyville',
  '在 Sky 的小马谷名册最前面加入 groups.hachile.org 和 bot.hachile.org 链接，并同步手机版。': 'Added groups.hachile.org and bot.hachile.org links at the top of the Sky Ponyville directory, including the mobile page.',
  'Sky 地图新增工具箱入口': 'Toolbox link added to Sky map',
  '在 Sky 地图的巴尔的马新增 tools.hachile.org 工具箱入口，并同步桌面与手机页面。': 'Added the tools.hachile.org toolbox link at Baltimare on the Sky map and updated both desktop and mobile pages.',
  '画廊方形网格与搜索': 'Square gallery grid and search',
  '将画廊全部 64 张图片合并为方形缩略图网格，桌面端每行五张，并新增图片搜索与待补充说明。': 'Combined all 64 gallery images into a square-thumbnail grid with five columns on desktop, plus image search and placeholder captions.',
  '画廊返回入口调整': 'Gallery return links updated',
  '将 gallery.hachile.org 的两个返回入口改为 home.hachile.org，并移除页脚的 ALPHA 标识。': 'Changed both gallery.hachile.org return links to home.hachile.org and removed the ALPHA footer label.',
  '画廊图片扩充': 'Gallery image expansion',
  '将 pic 中的 55 张图片加入 gallery.hachile.org，保留原有作品并支持点击放大。': 'Added 55 images from pic to gallery.hachile.org, keeping the existing works and click-to-enlarge view.',
  '独立手机版上线': 'Standalone mobile pages launched',
  '新增无侧边栏的中英文手机版页面，并在左上角站点名称下方显示 home.hachile.org。': 'Added Chinese and English mobile pages without a sidebar, and displayed home.hachile.org below the site name at the top left.',
  'CV 英文版上线': 'English CV page launched',
  '移除 cv.hachile.org 顶部的旧返回入口，改为中英文切换，并新增完整英文简历页面。': 'Replaced the old top return link on cv.hachile.org with a language switcher and added a complete English CV page.',
  '社群档案补充': 'Community archive update',
  '更新 groups.hachile.org 的社群目录，补充 QQ 群及跨平台社群入口。': 'Updated the groups.hachile.org directory with more QQ groups and cross-platform community links.',
  '社群与机器人账号入口补充': 'Community and bot links added',
  '在社群列表下新增 groups.hachile.org 入口，并在其他身份下新增 bot.hachile.org 入口。': 'Added a groups.hachile.org link below the community list and a bot.hachile.org link below other identities.',
  '网络社群档案上线': 'Community archive launch',
  '新建 groups.hachile.org，汇总旧站公开的 QQ 群、微信公众号名称，并为三个重点社群制作展览页。': 'Launched groups.hachile.org with the QQ groups listed on the old site, the WeChat account name, and a dedicated exhibit for three featured communities.',
  '门户页标题与入口卡片调整': 'Portal heading and entry card update',
  '为 Hachile Portal 添加中英文欢迎标题，缩小简介文字，并降低三个入口卡片的高度。': 'Added Chinese and English welcome headings to Hachile Portal, reduced the introduction text size, and shortened the three entry cards.',
  '主页头像与自我介绍调整': 'Hero avatar and introduction update',
  '缩小并重新定位主页头像，移除头像渐变和角标；将 Sky 归入个人站点，并更新自我介绍与兴趣文字。': 'Resized and repositioned the hero avatar, removed its gradient and corner label, moved Sky into personal sites, and updated the introduction and interests.',
  '入口页名称更新': 'Entry page name update',
  '将 Hachile 入口页的中英文桌面版与手机版浏览器标签名称统一改为 Hachile Portal。': 'Renamed the browser tab to Hachile Portal on the Chinese and English desktop and mobile entry pages.',
  'Sky 地图入口调整': 'Sky map navigation update',
  '将 Sky 地图的坎特洛特入口改为按语言跳转至 home.hachile.org 对应页面。': 'Canterlot on the Sky map now opens the matching Chinese or English home.hachile.org page.',
  '头像环带渐变调整': 'Avatar ring gradient update',
  '保留头像图片完整呈现，仅在左侧扇环形成从深色到白色的渐变；移动端独立展示完整头像。': 'Kept the avatar image intact, added a dark-to-white gradient only to the left crescent, and displayed the full avatar separately on mobile.',
  'CV 页面主页入口调整': 'CV homepage link update',
  '将 cv.hachile.org 页脚的个人主页链接更新为 home.hachile.org。': 'Updated the personal homepage link in the cv.hachile.org footer to home.hachile.org.',
  '入口页文字调整': 'Entry page text update',
  '移除 Hachile 中文入口页桌面版和手机版的顶部标识文字。': 'Removed the top label from the Chinese Hachile entry page on desktop and mobile.',
  '图标与头像细节调整': 'Icon and avatar refinements',
  '头像沿圆周渐隐，更新联系方式和社交平台图标，并补充社群入口。': 'Faded the avatar around its circular edge, refreshed contact and social icons, and added a community link.',
  '站点与社群展示更新': 'Site and community display update',
  '新增 Tools 与社交平台入口，更新首页头像和社群卡片布局。': 'Added Tools and social links, and updated the hero avatar and community cards.',
  '精简导航与常用站点展示，放大首页头像，并把更新日志移至讨论区下方。': 'Simplified navigation and site cards, enlarged the hero avatar, and moved the changelog below discussions.',
  '最早的版本已转移至': 'The earliest version has moved to',
  '第一个正式版': 'First formal release',
  '双语界面与站内讨论区': 'Bilingual interface and on-site discussions',
  '更名为 Gunpowder Central，增加亮/暗模式、英文页面、图标与站内讨论区。': 'Renamed to Gunpowder Central, with light and dark modes, an English page, icons, and an on-site discussion board.',
  'Hachile.org 个人站群的第一个正式版。Home 采用深色文档式布局，汇总个人介绍、站点导航、常用资源、社群资料、联系方式和讨论入口。': 'The first formal release of the Hachile.org network. Home adopts a documentation-style layout and brings together my introduction, sites, resources, communities, contact details, and discussion board.',
  '来聊聊？': 'Join the conversation',
  '网站建议、项目交流、友链申请，或只是打个招呼，都可以直接在这里发帖，无需账号。昵称和内容会公开；删除密钥只留在当前浏览器。': 'Share site feedback, discuss projects, request a link exchange, or just say hello. No account is needed. Your name and message are public; your deletion key stays in this browser.',
  '发布新主题': 'Start a new topic', '昵称': 'Name', '标题': 'Title', '内容': 'Message',
  '发布': 'Post', '取消回复': 'Cancel reply', '最近的讨论': 'Recent discussions', '刷新': 'Refresh',
  '正在加载讨论…': 'Loading discussions…', '返回顶部': 'Back to top'
};

let html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
html = html.replace('<html lang="zh-CN">', '<html lang="en">')
  .replace('content="Gunpowder 的个人主页：介绍、常用站点、社群、联系方式与讨论区。"', 'content="Gunpowder Central: personal sites, communities, contact information, and discussions."')
  .replace('href="./assets/', 'href="../assets/')
  .replaceAll('src="./assets/', 'src="../assets/')
  .replace('href="/en/" lang="en">English', 'href="/" lang="zh-CN">中文')
  .replace('aria-label="切换亮色或暗色模式"', 'aria-label="Toggle light or dark mode"')
  .replace('placeholder="怎么称呼你？"', 'placeholder="What should we call you?"')
  .replace('placeholder="想聊些什么？"', 'placeholder="What is on your mind?"')
  .replace('placeholder="写下你的想法…"', 'placeholder="Share your thoughts…"');
html = html.replace(/>([^<>]+)</g, (full, inner) => {
  const text = inner.trim();
  const translated = translations[text] ?? text.replace(/点击复制$/, 'click to copy');
  return translated === text ? full : `>${inner.replace(text, translated)}<`;
});
const left = [...html.matchAll(/>([^<>]+)</g)].map(match => match[1].trim()).filter(text => /[\u3400-\u9fff]/.test(text) && text !== '中文');
if (left.length) throw new Error(`Untranslated visible text: ${[...new Set(left)].join(', ')}`);
mkdirSync(new URL('../en/', import.meta.url), { recursive: true });
writeFileSync(new URL('../en/index.html', import.meta.url), html);

function mobilePage(page, english) {
  const menuStart = page.indexOf('  <button class="menu-button"');
  const shellStart = page.indexOf('  <div class="site-shell"', menuStart);
  if (menuStart < 0 || shellStart < 0) throw new Error('Mobile layout: sidebar markers not found');
  page = page.slice(0, menuStart) + page.slice(shellStart);
  const scriptStart = page.indexOf("    const menu = document.getElementById('menu-button');");
  const themeStart = page.indexOf('    const themeButton =', scriptStart);
  if (scriptStart < 0 || themeStart < 0) throw new Error('Mobile layout: menu script markers not found');
  page = page.slice(0, scriptStart) + page.slice(themeStart);
  return page.replace('<body>', '<body class="mobile-page">')
    .replace('<header class="topbar"><div class="topbar-actions">', '<header class="topbar"><a class="brand" href="#top"><img class="brand-icon" src="/icon.png" alt=""><span><strong>Gunpowder Central</strong><small>home.hachile.org</small></span></a><div class="topbar-actions">')
    .replaceAll('="./assets/', '="/assets/')
    .replaceAll('="../assets/', '="/assets/')
    .replace(english ? 'href="/" lang="zh-CN">中文' : 'href="/en/" lang="en">English', english ? 'href="/m/" lang="zh-CN">中文' : 'href="/m/en/" lang="en">English');
}

mkdirSync(new URL('../m/en/', import.meta.url), { recursive: true });
writeFileSync(new URL('../m/index.html', import.meta.url), mobilePage(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), false));
writeFileSync(new URL('../m/en/index.html', import.meta.url), mobilePage(html, true));
