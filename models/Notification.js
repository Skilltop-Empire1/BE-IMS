

module.exports = (sequelize,DataTypes) => {
    const Notification = sequelize.define('Notification',{
        notId:{type:DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
        message:{type:DataTypes.STRING,allowNull:false},
        type:{type:DataTypes.STRING,allowNull:false}, //either product or staff
        status:{type:DataTypes.STRING,defaultValue:'unread'},
        userId:{type:DataTypes.INTEGER}
    })
    return Notification
}