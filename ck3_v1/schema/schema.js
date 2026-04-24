import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

// 男爵领头衔列表（从 initvar.yaml 地图中提取）
const VALID_BARONIES = [
  '布拉格城堡',
  '圣维特修道院',
  '月影塔',
  '扎泰茨港',
  '啤酒坊',
  '西风塔',
  '银矿城',
  '商旅集市',
  '鹰堡',
  '主教城',
  '光辉塔',
  '摩拉维亚堡',
  '市集城',
  '红塔村',
  '葡萄丘庄园',
  '黄金谷',
  '大主教城',
  '易北河港',
  '石狮堡',
  '矿山堡',
  '山地修院',
  '帝国议会城',
  '多瑙河港',
  '三河渡口',
  '森林修道院',
  '宫廷堡',
  '渡船港',
  '修道院丘',
  '河岸村',
  '古王城',
  '主教区',
  '加冕城',
  '圣坛区',
  '瓦维尔城堡',
  '河岸市镇',
  '王室要塞',
  '盐谷村',
  '王权城',
  '大主教区',
  '塞克什白堡',
  '王室庄园',
  '草原市镇',
  '集市营地',
  '提河渡桥',
  '牧马人庄园',
];

// 军队共用结构（玩家军队 & 世界.其他军队）
const ArmySchema = z
  .object({
    持有者: z.string(),
    所处位置: z.enum(VALID_BARONIES),
    目标地点: z
      .string()
      .transform(value => (VALID_BARONIES.includes(value) ? value : '无')),
    构成: z
      .record(
        z.string(),
        z
          .object({
            类型: z.string(),
            数量: z.coerce.number().transform(value => _.clamp(value, 0, 99999)),
            单个战斗力: z.coerce.number().transform(value => _.clamp(value, 0, 10)),
            单个维护费: z.coerce.number().transform(value => _.clamp(value, 0, 999.9)),
          })
          .prefault({
            类型: '步兵',
            数量: 0,
            单个战斗力: 1,
            单个维护费: 0,
          }),
      )
      .prefault({}),
  })
  .prefault({
    持有者: '',
    所处位置: '布拉格城堡',
    目标地点: '无',
    构成: {},
  });

// 有效的头衔列表（包含帝国、王国、公国、伯爵领和男爵领）
const VALID_TITLES = [
  // 帝国
  '神圣罗马帝国',
  '维斯拉帝国',
  '多瑙帝国',
  // 王国
  '波希米亚王国',
  '德意志王国',
  '波兰王国',
  '匈牙利王国',
  // 公国
  '波希米亚公国',
  '摩拉维亚公国',
  '萨克森公国',
  '巴伐利亚公国',
  '奥地利公国',
  '大波兰公国',
  '小波兰公国',
  '潘诺尼亚公国',
  '蒂萨公国',
  // 伯爵领
  '布拉格伯爵领',
  '扎泰茨伯爵领',
  '普尔曾伯爵领',
  '奥洛穆茨伯爵领',
  '布尔诺伯爵领',
  '兹诺伊莫伯爵领',
  '马格德堡伯爵领',
  '哈尔堡伯爵领',
  '雷根斯堡伯爵领',
  '帕绍伯爵领',
  '维也纳伯爵领',
  '克雷姆斯伯爵领',
  '波兹南伯爵领',
  '格涅兹诺伯爵领',
  '克拉科夫伯爵领',
  '桑多梅日伯爵领',
  '埃斯泰尔戈姆伯爵领',
  '塞克什白堡伯爵领',
  '德布勒森伯爵领',
  '索尔诺克伯爵领',
  // 男爵领
  ...VALID_BARONIES,
];

export const Schema = z.object({
  时间: z
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
      _出生年份: z.coerce.number(),
      称号: z.array(z.string()).prefault(['无名之辈']),
      所在男爵领: z.enum(VALID_BARONIES),
      所在位置: z.string(),
      金币: z.coerce.number(),
      _月度金币变化: z.coerce.number(),
      声名: z
        .object({
          大众好感度: z.coerce.number().transform(value => _.clamp(value, -100, 100)),
          暴政值: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
          恐吓值: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
        })
        .prefault({
          大众好感度: 0,
          暴政值: 0,
          恐吓值: 0,
        }),

      // 内嵌：产业与建筑
      产业与建筑: z
        .record(
          z.string(),
          z
            .object({
              详情: z.string(),
              所在地: z.enum(VALID_BARONIES),
              收入: z.coerce.number(),
            })
            .prefault({
              详情: '',
              所在地: '鹰堡',
              收入: 0,
            }),
        )
        .prefault({}),

      // 内嵌：军队（带嵌套构成）
      军队: z.record(z.string(), ArmySchema).prefault({}),

      // 内嵌：亲信
      亲信: z
        .record(
          z.string(),
          z
            .object({
              _出生年份: z.coerce.number(),
              称号: z.array(z.string()),
              关系: z.array(z.string()),
              外表: z.array(z.string()),
              性格: z.array(z.string()),
              经历: z.string(),
              好感度: z.coerce.number().transform(value => _.clamp(value, -100, 100)),
            })
            .prefault({
              出生年份: 1050,
              称号: [],
              关系: [],
              外表: [],
              性格: [],
              经历: '',
              好感度: 0,
            }),
        )
        .prefault({}),

      // 内嵌：加成
      加成: z
        .record(
          z.string(),
          z
            .object({
              描述: z.string(),
              效果: z.string(),
            })
            .prefault({
              描述: '没有成功设置描述',
              效果: '没有成功设置效果',
            }),
        )
        .prefault({}),
    })
    .prefault({
      出生年份: 1049,
      称号: [],
      所在男爵领: '鹰堡',
      所在位置: '城堡大厅',
      金币: 50,
      月度金币变化: 0,
      声名: {
        大众好感度: -5,
        暴政值: 0,
        恐吓值: 0,
      },
      产业与建筑: {},
      军队: {},
      亲信: {},
      加成: {},
    }),

  世界: z
    .object({
      // 联盟
      联盟: z
        .record(
          z.string(),
          z
            .object({
              成员: z.array(z.string()),
              理由: z.string(),
            })
            .prefault({
              成员: [],
              理由: '',
            }),
        )
        .prefault({}),

      // 战争
      战争: z
        .record(
          z.string(),
          z
            .object({
              战争借口: z.string(),
              进攻方: z.array(z.string()),
              防守方: z.array(z.string()),
              战争结果: z.string(),
              开始时间: z.string(),
              结束时间: z.string(),
            })
            .prefault({
              战争借口: '',
              进攻方: [],
              防守方: [],
              战争结果: '',
              开始时间: '',
              结束时间: '',
            }),
        )
        .prefault({}),

      // 其他军队（非玩家控制的军队）
      其他军队: z.record(z.string(), ArmySchema).prefault({}),

      // 地图数据
      _地图: z
        .record(
          z.string(),
          z
            .object({
              _位置: z.object({
                x: z.coerce.number(),
                y: z.coerce.number(),
              }),
              控制力: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
              发展度: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
            })
            .prefault({
              位置: { x: 0, y: 0 },
              控制力: 50,
              发展度: 10,
            }),
        )
        .prefault({}),

      // 势力
      势力: z
        .record(
          z.string(),
          z
            .object({
              性别: z.string(),
              头衔: z.enum(VALID_TITLES),
              首府: z.enum(VALID_BARONIES),
              封臣: z.array(z.string()),
              领主: z.string(),
              态度: z.coerce.number().transform(value => _.clamp(value, -100, 100)),
            })
            .prefault({
              性别: '未知',
              头衔: [],
              首府: '布拉格城堡',
              封臣: [],
              领主: '无',
              态度: 0,
            }),
        )
        .prefault({}),
    })
    .prefault({
      联盟: {},
      战争: {},
      其他军队: {},
      _地图: {},
      势力: {},
    }),
});

$(() => {
  registerMvuSchema(Schema);
});
