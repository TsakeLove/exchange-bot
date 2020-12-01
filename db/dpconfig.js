module.exports = {
    pg:
        {
            client: 'pg',  // postgres
            connection: {
                host: process.env.HOST,
                user: process.env.USER,
                password: process.env.PASSWORD,
                database: process.env.DATABASE,
                ssl: {
                    rejectUnauthorized: false,
                },



            },
            //   debug: true
        }

}
