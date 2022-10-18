import knex from 'knex';

class DBcontainer{
    constructor(configuracion,tabla){
        this.knex = knex(configuracion);
        this.table = tabla;
    }

    async getAll(){
        try{
            return await this.knex.from(this.table).select("*")
        }catch(e){
            console.log(e)
        }
    }

    async getById(id) {
        try{
            return await this.knex.from(this.table).select("*").where("id",id)
        }catch(e){
            console.log(e)
        }
    }
    async save(data) {
        try{
            return await this.knex.insert(data).into(this.table)
        }catch(e){
            console.log(e)
        }
    }
    
    async updateById(id,data){
        try{
            return await this.knex.from(this.table).where("id",id).update(data)

        }catch(e){
            console.log(e)
        }
    }
    async deleteById(id){
        try{
            return await this.knex(this.table).where("id",id).del()
        }catch(e){
            console.log(e)
        }
    }    
}

export default DBcontainer  
