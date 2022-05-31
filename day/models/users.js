module.exports = function(sequelize, DataTypes) {
    return sequelize.define('users', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        profile_pic: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        phone_number: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        company: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        is_deleted: {
            type: DataTypes.INTEGER(1),
            allowNull: true,
            defaultValue: '0'
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn('current_timestamp')
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn('current_timestamp')
        }

    }, {
        tableName: 'users'
    });
};