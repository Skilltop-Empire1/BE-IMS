

module.exports = (sequelize,DataTypes) => {
    const Notification = sequelize.define('Notification',{
        notId:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },
        message:{type:DataTypes.STRING,allowNull:false},
        type:{type:DataTypes.STRING,allowNull:false}, //either product or staff
        status:{type:DataTypes.STRING,defaultValue:'unread'},
        userId:{type:DataTypes.UUID}
    })
    return Notification
}