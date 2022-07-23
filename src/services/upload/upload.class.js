class Upload {
    async find(params) {}
    async get(id, params) {}
    async create(data, params) {
        try {
            return {
                success: true,
                data: data
            }
        }catch(err){
            return {
                success: false,
                err: "something wrong"
            }
        }
    }
    async update(id, data, params) {}
    async patch(id, data, params) {}
    async remove(id, params) {}
};

module.exports = Upload;
