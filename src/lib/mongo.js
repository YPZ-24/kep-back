import {MongoClient} from 'mongodb'
import config from '../config/config'
import {ObjectId} from 'mongodb'

const USER = config.DB.USER
const PASSWORD = config.DB.PASSWORD
const HOST = config.DB.HOST
const NAME = config.DB.NAME

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@cluster0.xv7op.mongodb.net/${NAME}?retryWrites=true&w=majority`

class MongoLib {
    constructor(){
        this.client = new MongoClient(MONGO_URI,{
            useNewUrlParser: true, 
            useUnifiedTopology: true
        })
        this.dbName = NAME
    }

    connect(){
        if(!MongoLib.connection){
            MongoLib.connection = new Promise((resolve, reject)=>{
                this.client.connect(error=>{
                    if(error) return reject(error)
                    console.log("DB Connected")
                    resolve(this.client.db(this.dbName))
                })
            })
        }
        return MongoLib.connection;
    }

    getAll(collection, query){
        return this.connect().then(db=>{
            return db.collection(collection).find(query).toArray();
        })
    }

    get(collection, query){
        return this.connect().then(db=>{
            return db.collection(collection).findOne(query)
            //{_id: ObjectId(id)}
        })
    }

    create(collection, data){
        return this.connect().then(db=>{
            return db.collection(collection).insertOne(data)
        }).then(result=>result.insertedId)
    }

    update(collection, id, data){
        return this.connect().then(db=>{
            return db.collection(collection).updateOne({_id: ObjectId(id)}, {$set: data}, {upsert: true})
        }).then(result=>result.upsertedId || id)
    }

    delete(collection, id){
        return this.connect().then(db=>{
            return db.collection(collection).deleteOne({_id: ObjectId(id)})
        }).then(result=>id)
    }

    aggregate(collection, agreggateArray){
        return this.connect().then(db=>{
            return db.collection(collection).aggregate(agreggateArray).map((u)=>{
                return u._id
            }).toArray()
        })
    }

}

export default MongoLib