const config = {
    app: {
        port: process.env.PORT || 8080,
    },
    db: {
        uri: process.env.MONGODB_URI || "mongodb+srv://khangt00:Lns7eKGh&u@cluster0.s76td.mongodb.net/CT449?retryWrites=true&w=majority"
    }
};

module.exports = config;