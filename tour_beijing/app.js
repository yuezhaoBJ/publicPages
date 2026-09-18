
// 故宫寻宝：神兽大作战 - 主应用脚本
// 题库数据
const quizzesAll = [
  { "id": 1, "question": "故宫是什么时候建造的？", "options": ["1406年", "1500年", "1600年", "1700年"], "correctAnswer": 0, "explanation": "故宫是1406年开始建造的，已经有600多岁了。它是明朝永乐皇帝下令修建的，用了14年才完成。", "hint": "故宫已经600多岁了", "story": "明成祖朱棣迁都北京后，下令修建紫禁城，动用了全国无数能工巧匠和珍贵材料，是中国古代最宏大的宫殿建筑工程之一。"},
  { "id": 2, "question": "故宫有多少间房间？", "options": ["5000间", "8700多间", "10000间", "15000间"], "correctAnswer": 1, "explanation": "故宫实际上有8700多间房间。传说中故宫有9999间半的房子，是因为皇帝不能和天上的玉皇大帝一样'满一万'。", "hint": "传说是9999间半", "story": "古代传说‘天一万，地九千’，人间帝王居所不能与天宫齐数，因此建成9999间半以示尊天敬地。"},
  { "id": 3, "question": "故宫的屋顶为什么是金黄色的？", "options": ["因为很便宜", "因为黄色是皇帝专用的颜色", "因为容易清洁", "因为防水效果好"], "correctAnswer": 1, "explanation": "故宫的屋顶用金黄色琉璃瓦铺盖，因为黄色是皇帝专用的颜色。这样可以显示皇帝的尊贵身份。", "hint": "和皇帝的身份有关", "story": "黄色在五行中属土，位居中央，象征皇权至高无上。古代百姓若私自使用黄色，属于僭越之罪。"},
  { "id": 4, "question": "太和殿屋顶上的脊兽最多有几个？", "options": ["5个", "8个", "10个", "12个"], "correctAnswer": 2, "explanation": "太和殿是故宫最重要的宫殿，屋顶上有10个脊兽。脊兽越多，说明这个宫殿越尊贵。", "hint": "太和殿是最重要的宫殿", "story": "脊兽是古代宫殿屋脊上的小神兽，寓意驱邪镇宅。太和殿的10个脊兽是全国之最，象征至尊无上。"},
  { "id": 5, "question": "九龙御路上有几条龙？", "options": ["3条", "5条", "7条", "9条"], "correctAnswer": 3, "explanation": "九龙御路上有9条龙。只有皇帝才能走九龙御路，这是皇帝专用的通道。龙代表皇帝的权力和尊贵。", "hint": "从名字就能看出来", "story": "九龙御路雕刻于巨石之上，龙盘云起，象征“九五之尊”。数字‘九’在古代代表皇帝，是阳数之极。"},
  { "id": 6, "question": "故宫现在最高的古树是什么树？", "options": ["槐树", "松树", "白皮松", "柏树"], "correctAnswer": 2, "explanation": "故宫现在最高的古树是白皮松。这棵树的树根露了出来，树干是乳白色的，像一条守护的卧龙。", "hint": "树干是乳白色", "story": "白皮松象征长寿与坚韧，是皇家园林常见树种。故宫的古松已有数百年树龄，被视为宫廷的守护者。"},
  { "id": 7, "question": "日晷是用来做什么的？", "options": ["装饰用的", "看时间的", "浇水用的", "防火用的"], "correctAnswer": 1, "explanation": "日晷是古人用来看时间的钟表。", "hint": "和太阳有关", "story": "日晷是利用太阳影子测定时间的装置，象征‘以天为则’，显示出古人敬天顺时的思想。"},
  { "id": 8, "question": "故宫的护城河有多深？", "options": ["2米深", "3米深", "5米深", "8米深"], "correctAnswer": 2, "explanation": "故宫外面有宽52米、深5米的护城河。", "hint": "比游泳池还深", "story": "护城河既为防御设施，也有调节气候作用。冬天会结冰，成为御前卫士练武的地方。"},
  { "id": 9, "question": "故宫的建造材料中，石头是怎么运来的？", "options": ["用船运", "用冰路运", "用车拉", "用人抬"], "correctAnswer": 1, "explanation": "建造故宫用的石头特别大，古人利用冬天的冰路运来这些巨石。", "hint": "利用了冬天的特点", "story": "史书记载，北京修城时工匠利用冬季冰冻地面，用水结冰润滑石道，使数十吨巨石能顺利运输。"},
  { "id": 10, "question": "故宫现在是什么地方？", "options": ["皇帝的住所", "博物馆", "皇帝的办公室", "军事基地"], "correctAnswer": 1, "explanation": "1925年起，故宫变成了博物馆，现在叫'故宫博物院'。", "hint": "现在很多人去参观", "story": "故宫博物院成立于1925年，是中国第一座国家级博物馆，也是世界上最受欢迎的文化遗产地之一。"},
  { "id": 11, "question": "故宫有多少座宫殿？", "options": ["30多座", "50多座", "70多座", "100多座"], "correctAnswer": 2, "explanation": "故宫有七十多座宫殿。", "hint": "数字在70左右", "story": "故宫的建筑布局遵循严格的礼制，内廷外朝分明，形成“前朝后寝”的帝王居住制度。"},
  { "id": 12, "question": "故宫的南北长度是多少米？", "options": ["800米", "900米", "961米", "1000米"], "correctAnswer": 2, "explanation": "故宫南北长961米，东西宽753米。", "hint": "接近1000米", "story": "故宫位于北京中轴线上，是整个北京城的核心，象征国家的‘正中与平衡’。"},
  { "id": 13, "question": "故宫的城墙有多高？", "options": ["5米", "8米", "10米", "15米"], "correctAnswer": 2, "explanation": "故宫外面有高10米的城墙。", "hint": "10米相当于3层楼高", "story": "城墙采用夯土加砖结构，厚实稳固，象征皇权的威严与不可侵犯。"},
  { "id": 14, "question": "故宫准备建造材料花了多长时间？", "options": ["5年", "8年", "11年", "14年"], "correctAnswer": 2, "explanation": "光准备材料就花了11年。", "hint": "超过10年", "story": "为了修建故宫，南方的木材、苏州的金砖、云南的石材都被运送至北京，耗时极久。"},
  { "id": 15, "question": "故宫的木头主要来自哪些地方？", "options": ["北京和河北", "四川和云南", "浙江和江苏", "山东和山西"], "correctAnswer": 1, "explanation": "木头来自四川和云南，要用船和人力运到北京。", "hint": "在中国的南方", "story": "用于故宫的木材多为金丝楠木，产自四川、云南，是古代帝王专用木材，极为珍贵。"},
  { "id": 16, "question": "苏州专门为故宫烧制的砖叫什么？", "options": ["金砖", "银砖", "玉砖", "瓷砖"], "correctAnswer": 0, "explanation": "苏州专门烧制'金砖'，比普通砖坚硬光滑。", "hint": "名字里有'金'字", "story": "‘苏州金砖’制作工艺极其复杂，一块砖需历时数月，打磨后可如镜照人。"},
  { "id": 17, "question": "故宫建成后发生过火灾吗？", "options": ["没有", "只有1次", "有多次", "不清楚"], "correctAnswer": 2, "explanation": "建成后曾发生过多次大火，比如1421年和1597年的火灾。", "hint": "古代建筑容易着火", "story": "故宫多次被雷击起火，明清两代都曾重修太和殿。每次修缮都凝聚了时代的建筑艺术。"},
  { "id": 18, "question": "故宫的中间有什么特殊的线？", "options": ["红色线", "中轴线", "金色线", "蓝色线"], "correctAnswer": 1, "explanation": "故宫的中间有一条直直的'中轴线'。", "hint": "像龙脉一样", "story": "北京城的中轴线南起永定门，北至钟鼓楼，全长7.8公里，象征天地人合一的宇宙秩序。"},
  { "id": 19, "question": "故宫里最有名的宫殿是什么？", "options": ["乾清宫", "太和殿", "坤宁宫", "养心殿"], "correctAnswer": 1, "explanation": "最有名的是太和殿，皇帝举行大典的地方。", "hint": "皇帝举行大典的地方", "story": "太和殿俗称金銮殿，皇帝登基、册封、元旦朝贺等重大典礼都在此举行。"},
  { "id": 20, "question": "故宫里的石狮子有什么特点？", "options": ["都是一样的", "公狮子踩球，母狮子带小狮子", "都是母狮子", "都是公狮子"], "correctAnswer": 1, "explanation": "石狮子：公狮子踩球，母狮子带小狮子。", "hint": "有公有母", "story": "狮子象征守护与威严，公狮护国权，母狮护家业，体现阴阳平衡的皇家哲学。"},
  { "id": 21, "question": "故宫里的铜鹤和铜龟代表什么？", "options": ["皇帝的权力", "长寿和平安", "财富和繁荣", "智慧和勇气"], "correctAnswer": 1, "explanation": "铜鹤和铜龟象征长寿和平安。", "hint": "和寿命有关", "story": "鹤为仙禽、龟为灵兽，寓意‘龟鹤延年’，祈愿国家与皇帝万寿无疆。"},
  { "id": 22, "question": "故宫现在有多少件文物？", "options": ["50万件", "100万件", "150万件", "200万件"], "correctAnswer": 1, "explanation": "故宫博物馆里有一百多万件文物，全国六分之一的文物都在这里！", "hint": "超过100万件", "story": "故宫文物藏品极其丰富，包括书画、瓷器、玉器、青铜器等，是中华文明的宝库。"},
  { "id": 23, "question": "脊兽是什么？", "options": ["屋顶上的装饰动物", "门口的雕塑", "地上的图案", "墙上的壁画"], "correctAnswer": 0, "explanation": "屋脊上的动物叫脊兽。", "hint": "在屋顶上", "story": "脊兽多取自神话，如龙、凤、狮、海马等，用以镇邪避火，象征吉祥平安。"},
  { "id": 24, "question": "栏板下的龙头有什么作用？", "options": ["装饰", "排水", "防火", "防盗"], "correctAnswer": 1, "explanation": "栏板下有很多龙头，实际上是排水口。", "hint": "和水有关", "story": "故宫有‘千龙吐水’的奇景，大雨时水从龙口喷出，既美观又实用。"},
  { "id": 25, "question": "故宫里有哪些动物雕塑？", "options": ["只有狮子", "狮子、龙、凤、小马等", "只有龙", "只有鹤"], "correctAnswer": 1, "explanation": "屋顶小兽：像龙、凤、狮子、小马，排成队保护房子。", "hint": "有很多种动物", "story": "这些动物大多源于神话传说，象征驱邪避灾与祥瑞护佑，是古代工匠的智慧结晶。"},
  { "id": 26, "question": "永乐皇帝为什么要建造故宫？", "options": ["为了好玩", "为了显示权力", "想要一个安全又气派的地方办公和生活", "为了吸引游客"], "correctAnswer": 2, "explanation": "明朝永乐皇帝想要一个安全又气派的地方办公和生活。", "hint": "和皇帝的需求有关", "story": "永乐皇帝迁都北京后，为巩固政权、展示国威而建紫禁城，体现‘天子居中、统御天下’的理念。"},
  { "id": 27, "question": "故宫建造用了多少年？", "options": ["5年", "10年", "14年", "20年"], "correctAnswer": 2, "explanation": "从头到尾差不多花了14年。", "hint": "超过10年", "story": "故宫从1406年开工到1420年竣工，历经14年，耗费巨大人力物力，是当时世界上最浩大的工程之一。"},
  { "id": 28, "question": "明清皇帝在故宫住了多长时间？", "options": ["100年", "300年", "500年", "700年"], "correctAnswer": 2, "explanation": "明清皇帝在这里住了500年。", "hint": "是5个百年", "story": "自明成祖起至清宣统退位，故宫见证了24位皇帝的兴衰更替与中国封建王朝的终结。"},
  { "id": 29, "question": "故宫博物院是世界上怎样的博物馆？", "options": ["最大的", "参观人数最多的之一", "最古老的", "最贵的"], "correctAnswer": 1, "explanation": "1925年起，故宫变成博物馆，是世界上参观人数最多的博物馆之一。", "hint": "很多人去参观", "story": "故宫每年接待上千万游客，与卢浮宫、大英博物馆并称‘世界三大宫殿博物馆’。"},
  { "id": 30, "question": "故宫是什么结构的建筑？", "options": ["石头结构", "木结构", "钢铁结构", "混凝土结构"], "correctAnswer": 1, "explanation": "故宫是世界上最大的木结构建筑。", "hint": "用木头建造的", "story": "故宫采用传统榫卯结构，不用一根钉子，体现了中国古代木工技艺的巅峰。"}
];

const quizzesById = Object.fromEntries(quizzesAll.map(q => [q.id, q]));
const PLACEHOLDER_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
    <rect width="100%" height="100%" fill="#eee"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
          fill="#999" font-size="20">No Image</text>
  </svg>
`)}`
// 地标数据（从JSON文件加载）
let landmarks30 = null;

// 加载地标数据
async function loadLandmarks() {
  if (landmarks30) return landmarks30;
  
  try {
    const response = await fetch('landmarks.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    landmarks30 = await response.json();
    return landmarks30;
  } catch (error) {
    console.error('Error loading landmarks.json:', error);
    // 如果加载失败，使用默认空数组
    landmarks30 = [];
    return landmarks30;
  }
}

// 基于题库生成一一对应的打卡点（使用更贴近题干的真实命名与近似坐标）
async function buildCheckpointsFromQuizzes(quizzes) {
  // 确保地标数据已加载
  if (!landmarks30) {
    await loadLandmarks();
  }
  
  if (!landmarks30 || landmarks30.length === 0) {
    console.error('Landmarks data not loaded');
    return [];
  }
  
  function getBadgeForQuiz(q) {
    const text = (q.question + ' ' + (q.explanation || '')).toLowerCase();

    // Keyword-based overrides (keep these first so they take precedence)
    if (text.includes('太和殿') || text.includes('脊兽') || text.includes('龙')) {
      return { name: '龙', img: 'img/badge_dragon.png' };
    }
    if (text.includes('凤')) {
      return { name: '凤', img: 'img/badge_phoenix.png' };
    }
    if (text.includes('狮') || text.includes('石狮')) {
      return { name: '狮', img: 'img/badge_lion.png' };
    }
    if (text.includes('河') || text.includes('水')) {
      return { name: '海马', img: 'img/badge_seahorse.png' };
    }
    if (text.includes('角楼') || text.includes('火') || text.includes('安全')) {
      return { name: '斗牛', img: 'img/badge_bull.png' };
    }

    // 默认按题目 id 分配，保证稳定
    const names = ["龙", "凤", "狮", "海马", "斗牛"];
    const imgs = [
      "img/badge_dragon.png",
      "img/badge_phoenix.png",
      "img/badge_lion.png",
      "img/badge_seahorse.png",
      "img/badge_bull.png"
    ];
    const i = (q.id - 1) % names.length;
    return { name: names[i], img: imgs[i] };
  }
  return quizzes.map((q, idx) => {
    const lm = landmarks30[idx % landmarks30.length];
    const badge = getBadgeForQuiz(q);
    return {
      id: q.id,
      name: lm.name,
      badgeName: lm.animal,
      badgeImg: badge.img,
      knowledge: lm.details,
      pose: lm.pose,
      image: lm.image,
      lat: lm.lat, lng: lm.lng,
      completed: false
    };
  });
}

// 地标数据和打卡点（异步加载）
let checkpoints = [];
let landmarksLoaded = false;

// 初始化应用（加载地标数据并生成打卡点）
async function initApp() {
  if (landmarksLoaded) return;
  
  try {
    await loadLandmarks();
    checkpoints = await buildCheckpointsFromQuizzes(quizzesAll);
    landmarksLoaded = true;
    
    // 如果在地图页面，重新渲染
    if (document.getElementById('list-page')?.classList.contains('active')) {
      renderCheckpointMap();
      renderListBadges();
    }
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// 获取landmarks30数组（用于编辑页面）
function getLandmarks30() {
  // 从buildCheckpointsFromQuizzes函数中提取landmarks30
  // 由于landmarks30在函数内部，我们需要通过checkpoints反向获取
  // 或者直接访问函数内部的landmarks30
  // 为了简化，我们创建一个全局的landmarks30引用
  return landmarks30ForEdit || [];
}

// 编辑页面相关变量
let editMapInstance = null;
let editMarkers = [];
let selectedLandmarkIndex = null;
let landmarks30ForEdit = null;

// 初始化landmarks30ForEdit（从JSON文件或checkpoints中提取）
async function initLandmarksForEdit() {
  if (!landmarks30ForEdit) {
    // 优先从JSON文件加载
    if (!landmarks30) {
      await loadLandmarks();
    }
    
    if (landmarks30 && landmarks30.length > 0) {
      // 直接从JSON文件复制
      landmarks30ForEdit = JSON.parse(JSON.stringify(landmarks30));
    } else if (checkpoints && checkpoints.length > 0) {
      // 从checkpoints中提取地标信息，创建可编辑的副本
      landmarks30ForEdit = checkpoints.map((cp) => {
        return {
          name: cp.name,
          lat: cp.lat,
          lng: cp.lng,
          image: cp.image,
          details: cp.knowledge || '',
          pose: cp.pose || ''
        };
      });
    } else {
      landmarks30ForEdit = [];
    }
  }
}

// 当前答题/拍照状态
let hasPhoto = false;
let quizAnsweredCorrectly = false;
let hasShownHint = false; // 是否已显示过提示

let currentCheckpointId = null;
let lastEarnedBadgeId = null; // 最新获得的徽章ID

// 错误反馈文字数组
const wrongAnswerFeedbacks = ['再仔细想想', '不太对哦', '就差一点点'];

// 地图实例（懒加载）
let mapInstance = null;
let markerLayer = null;
let userLocationLayer = null;
let pendingIcon = null;
let completedIcon = null;
const markerShadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png';
const iconDefaults = {
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
};

// WGS84 转 GCJ-02 坐标转换函数（高德地图使用 GCJ-02 坐标系）
function wgs84ToGcj02(lng, lat) {
  const a = 6378245.0; // 长半轴
  const ee = 0.00669342162296594323; // 偏心率平方
  
  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLng = transformLng(lng - 105.0, lat - 35.0);
  const radLat = lat / 180.0 * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
  
  return [lng + dLng, lat + dLat];
}

function transformLat(lng, lat) {
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * Math.PI) + 40.0 * Math.sin(lat / 3.0 * Math.PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lat / 12.0 * Math.PI) + 320 * Math.sin(lat * Math.PI / 30.0)) * 2.0 / 3.0;
  return ret;
}

function transformLng(lng, lat) {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lng * Math.PI) + 40.0 * Math.sin(lng / 3.0 * Math.PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lng / 12.0 * Math.PI) + 300.0 * Math.sin(lng / 30.0 * Math.PI)) * 2.0 / 3.0;
  return ret;
}

// 页面切换函数
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');

  if (pageId === 'list-page') {
    // 确保数据已加载
    if (!landmarksLoaded) {
      initApp().then(() => {
        renderCheckpointMap();
        renderListBadges();
      });
    } else {
      renderCheckpointMap();
      renderListBadges();
    }
  } else if (pageId === 'edit-page') {
    initEditPage();
  }
  // 首页不再显示徽章
}

// 更新进度条
function updateProgress() {
  const completedCount = checkpoints.filter(cp => cp.completed).length;
  const percentage = (completedCount / checkpoints.length) * 100;
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');

  progressFill.style.width = percentage + '%';
  progressText.textContent = completedCount + '/' + checkpoints.length;
}

// 渲染打卡点地图
function renderCheckpointMap() {
  // 更新进度条与奖励提示
  let completedCount = checkpoints.filter(cp => cp.completed).length;
  updateProgress();
  const rewardPrompt = document.getElementById('reward-prompt');
  rewardPrompt.style.display = completedCount === checkpoints.length ? 'block' : 'none';

  // 首次创建地图
  if (!mapInstance) {
    // 将默认中心点从 WGS84 转换为 GCJ-02（高德地图使用 GCJ-02）
    const defaultCenterWgs84 = [39.9173, 116.3972]; // 故宫中轴近似（WGS84）
    const [gcjLng, gcjLat] = wgs84ToGcj02(defaultCenterWgs84[1], defaultCenterWgs84[0]);
    mapInstance = L.map('map', {
      center: [gcjLat, gcjLng],
      zoom: 16,
      scrollWheelZoom: false
    });
    // 高德地图瓦片服务（稳定可靠，无需 API key）
    // 如果必须使用腾讯地图，需要使用腾讯地图官方 JavaScript SDK 并申请 API key
    L.tileLayer('https://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
      subdomains: ['01', '02', '03', '04'],
      attribution: '&copy; <a href="https://www.amap.com/">高德地图</a>',
      maxZoom: 18,
      tileSize: 256
    }).addTo(mapInstance);
    // 使用聚合
    markerLayer = L.markerClusterGroup({ 
      showCoverageOnHover: false, 
      maxClusterRadius: 50,
      zoomToBoundsOnClick: true,  // 点击聚合图标时放大并展开
      spiderfyOnMaxZoom: true,   // 在最大缩放级别时展开为蜘蛛网
      removeOutsideVisibleBounds: true
    });
    mapInstance.addLayer(markerLayer);
    
    // 处理聚合图标的点击事件，确保正确放大
    markerLayer.on('clusterclick', function(a) {
      const cluster = a.layer;
      const markers = cluster.getAllChildMarkers();
      
      if (markers.length > 0) {
        // 计算所有标记的边界
        const group = new L.featureGroup(markers);
        const bounds = group.getBounds();
        
        // 放大到包含所有标记的视图
        mapInstance.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 18
        });
      }
    });

    // 定义两种状态的 3D 立体图标（带阴影）
    // 优化图标尺寸，使其更明显
    pendingIcon = L.icon({
      iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: markerShadowUrl,
      iconSize: [30, 46],
      iconAnchor: [15, 46],
      popupAnchor: [1, -40],
      shadowSize: [46, 46]
    });
    completedIcon = L.icon({
      iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      shadowUrl: markerShadowUrl,
      iconSize: [30, 46],
      iconAnchor: [15, 46],
      popupAnchor: [1, -40],
      shadowSize: [46, 46]
    });
  }

  // 清空并重新绘制标记
  markerLayer.clearLayers();
  const bounds = [];
  checkpoints.forEach(cp => {
    if (typeof cp.lat !== 'number' || typeof cp.lng !== 'number') return;
    // 将 WGS84 坐标转换为 GCJ-02 坐标（高德地图使用 GCJ-02）
    const [gcjLng, gcjLat] = wgs84ToGcj02(cp.lng, cp.lat);
    const marker = L.marker([gcjLat, gcjLng], {
      title: cp.name,
      icon: cp.completed ? completedIcon : pendingIcon
    });
    const statusText = cp.completed ? `✓ 已获得 ${cp.badgeName} 徽章` : '▶ 去打卡';
    // 使用缩略图（如果存在）或原图，添加懒加载
    const thumbImage = cp.image.replace('img/', 'img/thumb/');
    const popupHtml = `
                <div style="min-width:200px;max-width:280px;padding:12px;box-sizing:border-box;">
                    <img src="${thumbImage}" alt="缩略图" 
                         style="width:100%;height:auto;max-height:180px;object-fit:cover;border-radius:8px;margin-bottom:8px;display:block;" 
                         loading="lazy"
                         onerror="this.onerror=null;this.src='${cp.image}';this.onerror=function(){this.src='${PLACEHOLDER_IMG}';};" />
                    <div style="font-weight:bold;color:#8B0000;margin-bottom:6px;font-size:16px;">${cp.id}. ${cp.name}</div>
                    <div style="color:#666;margin-bottom:10px;font-size:14px;line-height:1.5;">${cp.knowledge.substring(0, 28)}...</div>
                    <button style="background:#FFD700;color:#8B0000;border:none;border-radius:16px;padding:8px 12px;font-weight:bold;cursor:pointer;width:100%;font-size:14px;box-sizing:border-box;" onclick="showDetail(${cp.id})">${statusText}</button>
                </div>
            `;
    marker.bindPopup(popupHtml, {
      maxWidth: 280,
      maxHeight: 350,
      autoPan: false,  // 禁用自动平移
      keepInView: true,
      closeButton: true,
      className: 'custom-popup',
      offset: [0, -10],
      autoClose: false
    });
    
    // 确保弹窗打开时完整显示（仅在popup超出边界时进行最小幅度平移）
    marker.on('popupopen', function() {
      const popup = this.getPopup();
      if (popup && mapInstance) {
        // 延迟执行，确保弹窗已完全渲染
        setTimeout(() => {
          if (popup.isOpen()) {
            const popupElement = popup.getElement();
            if (popupElement) {
              const mapContainer = mapInstance.getContainer();
              const popupBounds = popupElement.getBoundingClientRect();
              const mapRect = mapContainer.getBoundingClientRect();
              
              // 计算需要的平移量（像素）
              let panX = 0;
              let panY = 0;
              const padding = 20; // 减小padding，只在真正需要时平移
              
              // 检查右边界
              if (popupBounds.right > mapRect.right - padding) {
                panX = (popupBounds.right - mapRect.right) + padding;
              }
              // 检查左边界
              else if (popupBounds.left < mapRect.left + padding) {
                panX = (popupBounds.left - mapRect.left) - padding;
              }
              
              // 检查下边界
              if (popupBounds.bottom > mapRect.bottom - padding) {
                panY = (popupBounds.bottom - mapRect.bottom) + padding;
              }
              // 检查上边界
              else if (popupBounds.top < mapRect.top + padding) {
                panY = (popupBounds.top - mapRect.top) - padding;
              }
              
              // 如果有需要平移，执行最小幅度的平移（使用panBy而不是panTo）
              if (panX !== 0 || panY !== 0) {
                mapInstance.panBy([panX, panY], {
                  animate: true,
                  duration: 0.2
                });
              }
            }
          }
        }, 50);
      }
    });
    markerLayer.addLayer(marker);
    bounds.push([gcjLat, gcjLng]);
  });
  if (bounds.length > 0) {
    mapInstance.fitBounds(bounds, { padding: [20, 20] });
  }

  // 触发地图尺寸重算（页面切换后）
  setTimeout(() => { mapInstance.invalidateSize(); }, 50);
}

// 地理定位到用户当前位置
function locateMe() {
  if (!mapInstance) return;
  if (!navigator.geolocation) {
    alert('当前设备不支持定位');
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    // 将 WGS84 坐标转换为 GCJ-02 坐标（高德地图使用 GCJ-02）
    const [gcjLng, gcjLat] = wgs84ToGcj02(lng, lat);
    const acc = pos.coords.accuracy || 50;
    if (!userLocationLayer) {
      userLocationLayer = L.layerGroup().addTo(mapInstance);
    }
    userLocationLayer.clearLayers();
    const me = L.marker([gcjLat, gcjLng], { title: '我的位置' });
    const circle = L.circle([gcjLat, gcjLng], { radius: acc, color: '#2E8B57', fillColor: '#3CB371', fillOpacity: 0.2, weight: 1 });
    userLocationLayer.addLayer(circle);
    userLocationLayer.addLayer(me);
    mapInstance.fitBounds(L.latLngBounds([[gcjLat, gcjLng], [gcjLat, gcjLng]]).pad(0.02));
  }, err => {
    alert('定位失败，请检查定位权限');
  }, { enableHighAccuracy: true, timeout: 8000 });
}

// 回到打卡区域（包含所有打卡点的范围）
function resetToCheckpoints() {
  if (!mapInstance) return;
  const points = checkpoints
    .filter(cp => typeof cp.lat === 'number' && typeof cp.lng === 'number')
    .map(cp => {
      // 将 WGS84 坐标转换为 GCJ-02 坐标
      const [gcjLng, gcjLat] = wgs84ToGcj02(cp.lng, cp.lat);
      return [gcjLat, gcjLng];
    });
  if (points.length === 0) return;
  const bounds = L.latLngBounds(points);
  mapInstance.fitBounds(bounds, { padding: [20, 20] });
}

// 显示打卡详情
function showDetail(id) {
  const cp = checkpoints.find(c => c.id === id);
  if (!cp) return;

  currentCheckpointId = id;

  document.getElementById('detail-title').textContent = cp.name;
  const detailImg = document.getElementById('detail-image');
  detailImg.onerror = () => { detailImg.onerror = null; detailImg.src = PLACEHOLDER_IMG; };
  // 添加懒加载和错误处理
  detailImg.loading = 'lazy';
  detailImg.src = cp.image;
  document.getElementById('detail-knowledge').textContent = cp.knowledge;
  const poseTextEl = document.getElementById('detail-pose');
  if (poseTextEl) {
    poseTextEl.textContent = cp.pose;
  }
  // 初始化拍照与答题区
  const checkInBtn = document.getElementById('check-in-btn');
  hasPhoto = false;
  quizAnsweredCorrectly = false;
  hasShownHint = false; // 重置提示显示状态
  const photoPreview = document.getElementById('photo-preview');
  const photoInput = document.getElementById('photo-input');
  if (photoPreview) {
    photoPreview.src = '';
    photoPreview.classList.remove('has-image');
  }
  const photoHint = document.getElementById('photo-upload-hint');
  if (photoHint) photoHint.classList.remove('hidden');
  if (photoInput) photoInput.value = '';

  // 渲染题目
  const quiz = quizzesById[id];
  const quizImg = document.getElementById('quiz-image');
  const quizQ = document.getElementById('quiz-question');
  const quizList = document.getElementById('quiz-options');
  const quizHint = document.getElementById('quiz-hint');
  const quizFeedback = document.getElementById('quiz-feedback');
  quizQ.textContent = quiz ? quiz.question : '';
  // 默认隐藏提示
  if (quizHint) {
    quizHint.textContent = quiz && quiz.hint ? `提示：${quiz.hint}` : '';
    quizHint.style.display = 'none';
  }
  if (quizFeedback) {
    quizFeedback.textContent = '';
    quizFeedback.style.display = 'none';
  }
  // 清除之前选项的样式
  const previousLabels = document.querySelectorAll('.quiz-options label');
  previousLabels.forEach(label => {
    label.style.borderColor = '';
    label.style.background = '';
  });
  if (quiz && quiz.image) {
    quizImg.style.display = 'block';
    quizImg.onerror = () => { quizImg.onerror = null; quizImg.src = PLACEHOLDER_IMG; };
    quizImg.src = quiz.image;
  } else {
    quizImg.style.display = 'none';
    quizImg.src = '';
  }
  quizList.innerHTML = '';
  if (quiz) {
    quiz.options.forEach((opt, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `<label><input type="radio" name="quizOpt" value="${idx}"><span>${opt}</span></label>`;
      quizList.appendChild(li);
    });
  }

  // 设置按钮状态
  if (cp.completed) {
    checkInBtn.textContent = `✓ 已完成！你已获得 ${cp.badgeName} 徽章`;
    checkInBtn.disabled = true;
  } else {
    checkInBtn.textContent = '完成拍照并答题正确后可完成打卡';
    checkInBtn.disabled = true;
  }

  // 事件绑定
  if (photoInput) {
    photoInput.onchange = async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      
      let displayFile = file;
      let saveFile = file;
      
      try {
        // 在照片上添加水印（日期和地标名称）
        const watermarkedFile = await addWatermarkToPhoto(file, cp);
        displayFile = watermarkedFile;
        saveFile = watermarkedFile;
      } catch (error) {
        console.error('添加水印失败，使用原图:', error);
        // 如果添加水印失败，使用原图
      }
      
      const url = URL.createObjectURL(displayFile);
      photoPreview.src = url;
      photoPreview.classList.add('has-image');
      const photoHint = document.getElementById('photo-upload-hint');
      if (photoHint) photoHint.classList.add('hidden');
      hasPhoto = true;
      updateCheckInEnable();
      
      // 自动保存带水印的照片到本地
      savePhotoToLocal(saveFile, cp);
    };
  }
  if (quizList) {
    quizList.onchange = (e) => {
      const selected = document.querySelector('input[name="quizOpt"]:checked');
      if (!selected) return;
      const idx = Number(selected.value);
      quizAnsweredCorrectly = quiz && idx === quiz.correctAnswer;
      
      // 更新反馈信息
      if (quizAnsweredCorrectly) {
        // 答对了
        if (quizFeedback) {
          quizFeedback.textContent = '';
          quizFeedback.style.display = 'none';
        }
        if (quizHint) {
          quizHint.style.display = 'none';
        }
        // 添加成功提示样式
        const label = selected.closest('label');
        if (label) {
          label.style.borderColor = '#3CB371';
          label.style.background = 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)';
        }
      } else {
        // 答错了
        if (!hasShownHint) {
          // 第一次答错，显示提示
          hasShownHint = true;
          if (quizHint && quiz && quiz.hint) {
            quizHint.style.display = 'block';
          }
          if (quizFeedback) {
            quizFeedback.textContent = '';
            quizFeedback.style.display = 'none';
          }
        } else {
          // 之后答错，显示随机反馈语
          if (quizHint) {
            quizHint.style.display = 'none';
          }
          if (quizFeedback) {
            const randomFeedback = wrongAnswerFeedbacks[Math.floor(Math.random() * wrongAnswerFeedbacks.length)];
            quizFeedback.textContent = randomFeedback;
            quizFeedback.style.display = 'flex';
          }
        }
        // 添加错误提示样式
        const label = selected.closest('label');
        if (label) {
          label.style.borderColor = '#DC143C';
          label.style.background = 'rgba(220, 20, 60, 0.1)';
          // 1秒后恢复
          setTimeout(() => {
            label.style.borderColor = '';
            label.style.background = '';
          }, 1000);
        }
      }
      updateCheckInEnable();
    };
  }

  showPage('detail-page');
}

function updateCheckInEnable() {
  const checkInBtn = document.getElementById('check-in-btn');
  if (!checkInBtn) return;
  if (hasPhoto && quizAnsweredCorrectly) {
    checkInBtn.disabled = false;
    checkInBtn.textContent = '✅ 条件达成，完成打卡！';
  } else {
    checkInBtn.disabled = true;
    checkInBtn.textContent = '完成拍照并答题正确后可完成打卡';
  }
}

// 模拟完成打卡
function completeCheckpoint() {
  if (currentCheckpointId === null) return;

  const cp = checkpoints.find(c => c.id === currentCheckpointId);
  if (cp && !cp.completed) {
    cp.completed = true;
    lastEarnedBadgeId = cp.id; // 记录最新获得的徽章ID
    const hint = getHint(cp.id);
    const quiz = quizzesById[cp.id];
    const story = quiz && quiz.story ? quiz.story : '';
    showBadgeEarned(cp, hint, story);
    // 不再自动返回列表页，等待用户点击后返回
  }
}

// 在照片上添加水印（日期和地标名称）
function addWatermarkToPhoto(file, checkpoint) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.onload = () => {
        // 创建 Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置 Canvas 尺寸为图片尺寸
        canvas.width = img.width;
        canvas.height = img.height;
        
        // 绘制原图片
        ctx.drawImage(img, 0, 0);
        
        // 设置文字样式
        const fontSize = Math.max(canvas.width * 0.03, 20); // 根据图片大小调整字体
        ctx.font = `bold ${fontSize}px Arial, "Microsoft YaHei", sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = Math.max(fontSize * 0.1, 2);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        
        // 获取当前日期
        const now = new Date();
        const dateStr = `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日`;
        const locationStr = checkpoint.name;
        
        // 计算文字位置（右下角，留出边距）
        const padding = fontSize * 1.5;
        const x = canvas.width - padding;
        const y = canvas.height - padding;
        const lineHeight = fontSize * 1.3;
        
        // 绘制地标名称（带描边）
        ctx.strokeText(locationStr, x, y);
        ctx.fillText(locationStr, x, y);
        
        // 绘制日期（带描边）
        ctx.strokeText(dateStr, x, y - lineHeight);
        ctx.fillText(dateStr, x, y - lineHeight);
        
        // 将 Canvas 转换为 Blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('无法生成水印图片'));
          }
        }, 'image/jpeg', 0.95);
      };
      
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = e.target.result;
    };
    
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}

// 保存照片到本地
function savePhotoToLocal(file, checkpoint) {
  try {
    // 生成文件名：打卡点名称_时间戳.jpg
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `故宫打卡_${checkpoint.name}_${timestamp}.jpg`;
    
    // 创建下载链接
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    
    // 触发下载
    a.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('保存照片失败:', error);
    // 如果自动下载失败，可以提示用户手动保存
  }
}

// 获取线索提示
function getHint(id) {
  const q = quizzesById[id];
  return q && q.hint ? q.hint.replace(/^提示：?/, '') : '';
}

// 重新开始游戏
function resetGame() {
  checkpoints.forEach(cp => cp.completed = false);
  lastEarnedBadgeId = null; // 清除最新徽章标记
  showPage('home-page');
}

// 初始化图片错误处理
function setupImageErrorHandlers() {
  const hero = document.querySelector('.home-hero');
  if (hero) {
    hero.onerror = () => { hero.onerror = null; hero.src = PLACEHOLDER_IMG; };
  }
  const seal = document.getElementById('seal-image');
  if (seal) {
    seal.onerror = () => { seal.onerror = null; seal.src = PLACEHOLDER_IMG; };
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  showPage('home-page');
  setupImageErrorHandlers();
});


// 获得徽章动画
function showBadgeEarned(cp, hint, story) {
  let overlay = document.getElementById('badge-earned-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'badge-earned-overlay';
    overlay.className = 'badge-earned-overlay';
    overlay.innerHTML = '<div class="badge-earned-card"><img id="badge-earned-img" src="" alt="徽章"><h4 id="badge-earned-text"></h4><p id="badge-earned-story" class="badge-earned-story"></p><p class="badge-earned-tip">点击任意位置继续</p></div>';
    document.body.appendChild(overlay);
  }
  
  // 添加点击事件，点击任意位置后隐藏并返回列表页
  overlay.onclick = () => {
    overlay.style.display = 'none';
    showPage('list-page');
  };
  
  const img = overlay.querySelector('#badge-earned-img');
  const text = overlay.querySelector('#badge-earned-text');
  const storyEl = overlay.querySelector('#badge-earned-story');
  img.src = cp.badgeImg;
  text.textContent = `🎉 获得 ${cp.badgeName} 徽章`;
  storyEl.textContent = story || '';
  overlay.style.display = 'flex';
  // 移除自动隐藏，改为用户点击后隐藏
}

// 渲染徽章网格（通用函数）
function renderBadgeGrid(containerId, checkpoints) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = '';
  checkpoints.forEach(cp => {
    // 列表页只显示已完成的徽章，所以不需要 badge-locked 类
    const item = document.createElement('div');
    item.className = 'badge-item';
    item.setAttribute('data-checkpoint-id', cp.id);
    item.innerHTML = `
      <img src="${cp.badgeImg}" alt="${cp.badgeName}徽章" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}'" />
      <span>${cp.badgeName}</span>
    `;
    grid.appendChild(item);
  });
}

// 首页徽章渲染（已移除，徽章只在列表页显示）
// function renderHomeBadges() {
//   renderBadgeGrid('badge-grid', checkpoints);
// }

// 列表页徽章渲染（只显示已完成的徽章）
function renderListBadges() {
  // 只渲染已完成的徽章
  const completedCheckpoints = checkpoints.filter(cp => cp.completed);
  renderBadgeGrid('list-badge-grid', completedCheckpoints);
  // 如果有最新获得的徽章，延迟高亮（等待DOM渲染完成）
  if (lastEarnedBadgeId !== null) {
    setTimeout(() => {
      highlightLatestBadge();
    }, 100);
  }
}

// 高亮最新获得的徽章并滚动到该位置
function highlightLatestBadge() {
  if (lastEarnedBadgeId === null) return;
  
  const grid = document.getElementById('list-badge-grid');
  if (!grid) return;
  
  const badgeItem = grid.querySelector(`[data-checkpoint-id="${lastEarnedBadgeId}"]`);
  if (!badgeItem) return;
  
  // 滚动到徽章位置
  badgeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  
  // 添加高亮动画
  badgeItem.classList.add('badge-highlight');
  
  // 3秒后移除高亮
  setTimeout(() => {
    badgeItem.classList.remove('badge-highlight');
    lastEarnedBadgeId = null; // 清除标记
  }, 3000);
}

// ========== 编辑页面功能 ==========

// 初始化编辑页面
async function initEditPage() {
  // 初始化landmarks30ForEdit
  if (!landmarks30ForEdit) {
    await initLandmarksForEdit();
  }
  
  // 初始化编辑地图
  if (!editMapInstance) {
    initEditMap();
  }
  
  // 渲染地标列表
  renderEditLandmarkList();
  
  // 渲染地图上的地标点
  renderEditMarkers();
  
  // 添加搜索框Enter键事件
  const searchInput = document.getElementById('edit-search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchLandmark();
      }
    });
  }
}

// 初始化编辑地图
function initEditMap() {
  const mapElement = document.getElementById('edit-map');
  if (!mapElement || editMapInstance) return;
  
  // 将默认中心点从 WGS84 转换为 GCJ-02（高德地图使用 GCJ-02）
  const defaultCenterWgs84 = [39.916, 116.397];
  const [gcjLng, gcjLat] = wgs84ToGcj02(defaultCenterWgs84[1], defaultCenterWgs84[0]);
  editMapInstance = L.map('edit-map').setView([gcjLat, gcjLng], 16);
  
  // 高德地图瓦片服务（稳定可靠，无需 API key）
  L.tileLayer('https://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    subdomains: ['01', '02', '03', '04'],
    attribution: '&copy; <a href="https://www.amap.com/">高德地图</a>',
    maxZoom: 18,
    tileSize: 256
  }).addTo(editMapInstance);
}

// 渲染地标列表
function renderEditLandmarkList() {
  const listContainer = document.getElementById('edit-landmark-list');
  if (!listContainer || !landmarks30ForEdit) return;
  
  listContainer.innerHTML = '';
  
  landmarks30ForEdit.forEach((landmark, index) => {
    const item = document.createElement('div');
    item.className = 'edit-landmark-item';
    if (selectedLandmarkIndex === index) {
      item.classList.add('selected');
    }
    
    item.innerHTML = `
      <div class="landmark-name">${landmark.name}</div>
    `;
    
    item.onclick = () => {
      selectLandmark(index);
      // 点击列表项时，打开对应的地图标记popup
      if (editMarkers[index]) {
        editMarkers[index].openPopup();
      }
    };
    listContainer.appendChild(item);
  });
}

// 选中地标
function selectLandmark(index) {
  selectedLandmarkIndex = index;
  renderEditLandmarkList();
  
  if (editMarkers[index] && editMapInstance) {
    const marker = editMarkers[index];
    editMapInstance.setView(marker.getLatLng(), 18);
    // 注意：这里不自动打开popup，让用户点击时再打开
  }
  
  showEditStatus(`已选中：${landmarks30ForEdit[index].name}`, false);
}

// 渲染地图上的地标点（可拖动）
function renderEditMarkers() {
  if (!editMapInstance || !landmarks30ForEdit) return;
  
  // 清除现有标记
  editMarkers.forEach(marker => editMapInstance.removeLayer(marker));
  editMarkers = [];
  
  const bounds = [];
  
  landmarks30ForEdit.forEach((landmark, index) => {
    // 将 WGS84 坐标转换为 GCJ-02 坐标（高德地图使用 GCJ-02）
    const [gcjLng, gcjLat] = wgs84ToGcj02(landmark.lng, landmark.lat);
    const marker = L.marker([gcjLat, gcjLng], {
      draggable: true,
      title: landmark.name
    });
    
    // Popup 显示 GCJ-02 坐标（用户在地图上看到的坐标）
    marker.bindPopup(`
      <div style="text-align: center;">
        <strong>${landmark.name}</strong><br>
        <small>${gcjLat.toFixed(6)}, ${gcjLng.toFixed(6)}</small>
      </div>
    `);
    
    // 拖动开始
    marker.on('dragstart', () => {
      showEditStatus(`正在拖动：${landmark.name}...`, false);
    });
    
    // 拖动结束，更新坐标
    marker.on('dragend', (e) => {
      const newLat = e.target.getLatLng().lat;
      const newLng = e.target.getLatLng().lng;
      
      // 将 GCJ-02 坐标转换回 WGS84（因为 landmarks.json 中存储的是 WGS84）
      const [wgsLng, wgsLat] = gcj02ToWgs84(newLng, newLat);
      landmarks30ForEdit[index].lat = wgsLat;
      landmarks30ForEdit[index].lng = wgsLng;
      
      // 更新列表显示
      renderEditLandmarkList();
      
      // 更新popup（显示 GCJ-02 坐标）
      marker.setPopupContent(`
        <div style="text-align: center;">
          <strong>${landmark.name}</strong><br>
          <small>${newLat.toFixed(6)}, ${newLng.toFixed(6)}</small>
        </div>
      `);
      
      showEditStatus(`已更新：${landmark.name} → ${newLat.toFixed(6)}, ${newLng.toFixed(6)} (GCJ-02)`, false);
    });
    
    // 点击标记选中并打开popup
    marker.on('click', () => {
      selectLandmark(index);
      marker.openPopup();
    });
    
    editMapInstance.addLayer(marker);
    editMarkers.push(marker);
    bounds.push([gcjLat, gcjLng]);
  });
  
  // 调整地图视图以显示所有地标
  if (bounds.length > 0) {
    editMapInstance.fitBounds(bounds, { padding: [50, 50] });
  }
}

// 显示编辑状态消息
function showEditStatus(message, isError = false) {
  const statusEl = document.getElementById('edit-status');
  if (!statusEl) return;
  
  statusEl.textContent = message;
  statusEl.className = `edit-status show ${isError ? 'error' : ''}`;
  
  // 3秒后自动隐藏
  setTimeout(() => {
    statusEl.classList.remove('show');
  }, 3000);
}

// GCJ-02 转 WGS84 坐标转换函数（反向转换）
function gcj02ToWgs84(lng, lat) {
  const a = 6378245.0;
  const ee = 0.00669342162296594323;
  
  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLng = transformLng(lng - 105.0, lat - 35.0);
  const radLat = lat / 180.0 * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
  
  return [lng - dLng, lat - dLat];
}

// 重置编辑地图视图
function resetEditMap() {
  if (!editMapInstance || !landmarks30ForEdit) return;
  
  // 将 WGS84 坐标转换为 GCJ-02 坐标
  const bounds = landmarks30ForEdit
    .filter(lm => typeof lm.lat === 'number' && typeof lm.lng === 'number')
    .map(lm => {
      const [gcjLng, gcjLat] = wgs84ToGcj02(lm.lng, lm.lat);
      return [gcjLat, gcjLng];
    });
  if (bounds.length > 0) {
    editMapInstance.fitBounds(bounds, { padding: [50, 50] });
    showEditStatus('已重置地图视图', false);
  }
}

// 导出坐标（生成可复制的JSON代码）
function exportLandmarks() {
  if (!landmarks30ForEdit) {
    showEditStatus('错误：地标数据未初始化', true);
    return;
  }
  
  // 生成格式化的JSON字符串
  const jsonStr = JSON.stringify(landmarks30ForEdit, null, 2);
  
  // 创建临时文本区域用于复制
  const textarea = document.createElement('textarea');
  textarea.value = jsonStr;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    showEditStatus('✅ 坐标已复制到剪贴板！', false);
    
    // 也显示在控制台
    console.log('=== 地标坐标数据 ===');
    console.log(jsonStr);
    console.log('==================');
  } catch (err) {
    showEditStatus('❌ 复制失败，请查看控制台', true);
    console.log('=== 地标坐标数据 ===');
    console.log(jsonStr);
    console.log('==================');
  }
  
  document.body.removeChild(textarea);
}

// 地图搜索（使用OpenStreetMap Nominatim API）
let searchMarker = null;

function searchLandmark() {
  const searchInput = document.getElementById('edit-search-input');
  if (!searchInput || !editMapInstance) return;
  
  const searchText = searchInput.value.trim();
  if (!searchText) {
    showEditStatus('请输入搜索关键词', false);
    return;
  }
  
  showEditStatus('正在搜索...', false);
  
  // 使用OpenStreetMap Nominatim API进行地理编码搜索
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=1&bounded=1&viewbox=116.2,39.8,116.5,40.0`;
  
  fetch(url, {
    headers: {
      'User-Agent': 'TourBeijingApp/1.0'
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const displayName = result.display_name;
        
        // 移除之前的搜索标记
        if (searchMarker) {
          editMapInstance.removeLayer(searchMarker);
        }
        
        // 创建新的搜索标记
        const searchIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        
        // 将 WGS84 坐标转换为 GCJ-02 坐标（高德地图使用 GCJ-02）
        const [gcjLng, gcjLat] = wgs84ToGcj02(lng, lat);
        searchMarker = L.marker([gcjLat, gcjLng], { icon: searchIcon }).addTo(editMapInstance);
        searchMarker.bindPopup(`
          <div style="text-align: center;">
            <strong>${displayName}</strong><br>
            <small>${gcjLat.toFixed(6)}, ${gcjLng.toFixed(6)}</small>
          </div>
        `);
        
        // 平移到搜索结果位置（不改变缩放级别）
        editMapInstance.panTo([gcjLat, gcjLng]);
        
        showEditStatus(`已找到：${displayName}`, false);
      } else {
        showEditStatus(`未找到"${searchText}"相关地点`, true);
      }
    })
    .catch(error => {
      console.error('Search error:', error);
      showEditStatus('搜索失败，请稍后重试', true);
    });
}

// 确保所有在 HTML 中通过 onclick 调用的函数都在全局作用域中可用
if (typeof window !== 'undefined') {
  window.showPage = showPage;
  window.showDetail = showDetail;
  window.completeCheckpoint = completeCheckpoint;
  window.resetGame = resetGame;
  window.locateMe = locateMe;
  window.resetToCheckpoints = resetToCheckpoints;
  window.exportLandmarks = exportLandmarks;
  window.resetEditMap = resetEditMap;
  window.searchLandmark = searchLandmark;
}
