import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

// 男爵领头衔列表（仅包含最低层级）50个男爵领）
const VALID_BARONIES = [
  '布拉格城堡',
  '圣维特修道院',
  '老商街',
  '月影塔',
  '河畔堡',
  '青松庄园',
  '银桥村',
  '扎泰茨港',
  '啤酒坊',
  '西风塔',
  '银矿城',
  '商旅集市',
  '苍鹰堡',
  '主教城',
  '圣母广场',
  '光辉塔',
  '摩拉维亚堡',
  '市集城',
  '红塔村',
  '翠林修道院',
  '葡萄丘庄园',
  '边境哨',
  '黄金谷',
  '大主教城',
  '易北河港',
  '石鹰堡',
  '矿山堡',
  '山地修院',
  '贸易城',
  '圣塞韦里修道院',
  '瓦尔特城堡',
  '山谷村镇',
  '帝国议会城',
  '多瑙河港',
  '因戈尔堡',
  '市民广场',
  '伊萨尔城堡',
  '公爵市镇',
  '古王城',
  '主教区',
  '加冕城',
  '圣坛区',
  '瓦维尔城堡',
  '河岸市镇',
  '王权城',
  '大主教区',
  '塞克什白堡',
  '王室庄园',
  '草原市镇',
  '集市营地',
];

// 有效的头衔列表（包含帝国、王国、公国、伯爵领和男爵领）
const VALID_TITLES = [
  // 帝国
  '神圣罗马帝国',
  '西斯拉维亚帝国',
  '喀尔巴阡帝国',
  // 王国
  '波希米亚王国',
  '德意志王国',
  '巴伐利亚王国',
  '波兰王国',
  '匈牙利王国',
  // 公国
  '波希米亚公国',
  '摩拉维亚公国',
  '萨克森公国',
  '图林根公国',
  '上巴伐利亚公国',
  '下巴伐利亚公国',
  '大波兰公国',
  '小波兰公国',
  '潘诺尼亚公国',
  '外喀尔巴阡公国',
  // 伯爵领
  '布拉格伯爵领',
  '利托梅日采伯爵领',
  '扎泰茨伯爵领',
  '普尔曾伯爵领',
  '奥洛穆茨伯爵领',
  '布尔诺伯爵领',
  '兹诺伊莫伯爵领',
  '马格德堡伯爵领',
  '哈茨山伯爵领',
  '埃尔福特伯爵领',
  '瓦尔特堡伯爵领',
  '雷根斯堡伯爵领',
  '因戈尔施塔特伯爵领',
  '兰茨胡特伯爵领',
  '波兹南伯爵领',
  '格涅兹诺伯爵领',
  '克拉科夫伯爵领',
  '埃斯泰尔戈姆伯爵领',
  '塞克什白堡伯爵领',
  '德布勒森伯爵领',
  // 男爵领
  ...VALID_BARONIES,
];

export const Schema = z.object({
  世界: z
    .object({
      年: z.coerce
        .number()
        .transform(value => _.clamp(value, 1, 2026))
        .prefault(1066),
      月: z.coerce
        .number()
        .transform(value => _.clamp(value, 1, 12))
        .prefault(6),
      日: z.coerce
        .number()
        .transform(value => _.clamp(value, 1, 31))
        .prefault(20),
      时: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 23))
        .prefault(9),
      分: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 59))
        .prefault(20),
    })
    .prefault({
      年: 1066,
      月: 6,
      日: 20,
      时: 9,
      分: 20,
    }),

  玩家: z
    .object({
      出生年份: z.coerce.number().readonly(),
      持有头衔: z.array(z.enum(VALID_TITLES)).prefault(['苍鹰堡']),
      称号: z.array(z.string()).prefault(['苍鹰堡男爵']),
      所在男爵领: z.enum(VALID_BARONIES),
      所在位置: z.string(),
      金币: z.coerce.number(),
      月度金币变化: z.coerce.number().readonly(),
    })
    .prefault({
      出生年份: 1049,
      持有头衔: ['苍鹰堡'],
      称号: ['苍鹰堡男爵'],
      所在男爵领: '苍鹰堡',
      所在位置: '城堡大厅',
      金币: 5,
      月度金币变化: 0.8,
    }),

  产业与建筑: z
    .record(
      z.string(),
      z
        .object({
          所在地: z.enum(VALID_BARONIES),
          收入: z.coerce.number(),
        })
        .prefault({
          所在地: '布拉格城堡',
          收入: 1,
        }),
    )
    .prefault({}),

  军队: z
    .record(
      z.string(),
      z
        .object({
          类型: z.string(),
          数量: z.coerce.number().transform(value => _.clamp(value, 0, 99999)),
          战斗力: z.coerce.number().transform(value => _.clamp(value, 0, 10)),
          维护费: z.coerce.number().transform(value => _.clamp(value, 0, 999.9)),
        })
        .prefault({
          类型: '近战',
          数量: 8,
          战斗力: 1,
          维护费: 0.5,
        }),
    )
    .prefault({}),

  亲信: z
    .record(
      z.string(),
      z
        .object({
          出生年份: z.coerce.number().readonly(),
          称号: z.array(z.string()),
          关系: z.array(z.string()),
          外表: z.array(z.string()),
          性格: z.array(z.string()),
          好感度: z.coerce.number().transform(value => _.clamp(value, -100, 100)),
        })
        .prefault({
          出生年份: 1055,
          称号: [],
          关系: [],
          外表: [],
          性格: [],
          好感度: 0,
        }),
    )
    .prefault({}),

  势力: z
    .record(
      z.string(),
      z
        .object({
          持有者: z.string(),
          关系: z.string(),
          战争状态: z.string(),
          态度: z.string(),
        })
        .prefault({
          持有者: '默认持有者（变量加载失败）',
          关系: '中立',
          战争状态: '和平',
          态度: '温和',
        }),
    )
    .prefault({}),
});

$(() => {
  registerMvuSchema(Schema);
});
