import knex from "knex";

const mysqloptions = {
    
        client:'mysql',
        connection:{
            host:'127.0.0.1',
            user:'root',
            password:'',
            database:'products_base'
        }
    
}

const sqliteOptions={
    client:'sqlite3',
    connection:{
        filename:'./databaseProducts.sqlite'
    },
    useNullAsDefault:true
}
let db  = knex(sqliteOptions)

try {
    let exists = await db.schema.hasTable('products');
    if(exists){
       console.log("Tabla products existente");
    }else{
        await db.schema.createTable('products',table=>{
            table.primary('id');
            table.increments('id');
            table.string('title',30)
            table.integer('prices')
            table.string('thumbnail')
        })
    }
    let chat = await db.schema.hasTable('chat');
    if (chat) {
        console.log('Chat existente')
    } else {
        await db.schema.createTable('chat',table=>{
            table.string('user');
            table.string('message')
            table.string('fecha')
        })
    }
} catch (error) {
    console.log(error)
}

export default db;