module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      age: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      married: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );
};
// id를 기본키로 연결하므로 id 컬럼은 기입할 필요 없음
// sequelize.define으로 테이블명, 각 컬럼 스펙 기입
// VARCHAR = STRING
// INT = INTEGER
// TINYINT = BOOLEAN
// DATETIME = DATE
