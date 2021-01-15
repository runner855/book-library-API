module.exports = (connection, DataTypes) => {
    const schema = {
        mame: DataTypes.STRING,
        email: DataTypes.STRING,
    };

    const ReaderModel = connection.define('Reader', schema);
    return ReaderModel;
};