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
  '喜欢历史、时政、人文地理；': 'I enjoy history, current affairs, and human geography;',
  '偶尔打音游、P 社游戏和 io 小游戏；': 'I sometimes play rhythm games, Paradox games, and io games;',
  '也对军事、城市规划、哲学、轨道交通、板绘与作曲感兴趣。': 'I am also interested in military studies, urban planning, philosophy, rail transit, digital art, and composition.',
  '具身智能': 'Embodied AI', '世界模型': 'World models', '城市规划': 'Urban planning', '哲学': 'Philosophy', '社群运营': 'Community building',
  '我写的、维护的，或经常打开的站点。': 'Sites I build, maintain, or visit often.',
  '文章与笔记': 'Articles and notes', '图像与收藏': 'Images and collections', '开发项目': 'Development projects', '研究与作品': 'Research and work', '常用在线工具': 'Everyday online tools',
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
  '查看更多社群请访问': 'For more communities, visit',
  '欢迎联系我，也欢迎交换友链。': 'Feel free to reach out or exchange site links.',
  '点击复制号码': 'Click to copy', '微信': 'WeChat', '发送邮件': 'Send email',
  '知乎': 'Zhihu', '洛谷': 'Luogu', '博客园': 'CNBlogs',
  '小红书 · 42283614369': 'Xiaohongshu · 42283614369', '抖音 · 79492713231': 'Douyin · 79492713231',
  '百度贴吧': 'Baidu Tieba', 'SkybluePon · 贴吧号 5331523714': 'SkybluePon · Tieba ID 5331523714', '网易云音乐': 'NetEase Cloud Music', '复制': 'Copy',
  '在不同社群和项目里使用的其他账号。': 'Other accounts I use in different communities and projects.',
  '开发号 · 让信息流动': 'Development account · Let information flow',
  '同济 AI 大模型交流群管理员': 'Tongji AI and LLM Community admin', 'QQ 官方 Bot': 'Official QQ Bot',
  '小五': 'Xiao Wu', '社群管理 Bot': 'Community management bot',
  '展开查看完整更新日志': 'Expand full changelog', '首页布局调整': 'Homepage layout update',
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
  const translated = translations[text] ?? text.replace(/· 点击复制$/, '· click to copy');
  return translated === text ? full : `>${inner.replace(text, translated)}<`;
});
const left = [...html.matchAll(/>([^<>]+)</g)].map(match => match[1].trim()).filter(text => /[\u3400-\u9fff]/.test(text) && text !== '中文');
if (left.length) throw new Error(`Untranslated visible text: ${[...new Set(left)].join(', ')}`);
mkdirSync(new URL('../en/', import.meta.url), { recursive: true });
writeFileSync(new URL('../en/index.html', import.meta.url), html);
