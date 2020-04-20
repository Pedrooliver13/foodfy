const Chefs = require("../models/chefs");
const File = require('../models/files');

module.exports = {
  async chefs(req, res) {
    try {

      let results,
        offset,
        { filter, page, limit } = req.query;

      page = page || 1;
      limit = limit || 6;
      offset = limit * (page - 1);

      const params = { page, limit, offset, filter };


      async function getImage(chefId){
        let results = await File.find(chefId); 
        const files  = results.rows.map(file => 
          `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
          )

        return files[0];
      };


      results = await Chefs.paginate(params);
      const chefs = results.rows;

      const files = results.rows.map(async chef => {
        chef.img = await getImage(chef.file_id);

        return chef;
      });
      await Promise.all(files);
      
      
      const pagination = { 
        page,
        total_chefs: Math.ceil(chefs[0].total_chefs / limit)
      };

      return res.render('admin/chefs/gerenciar' , { chefs, pagination, filter, files });

    } catch (error) {
      console.log(error);
    }
  },
  async recipes(req, res){
    return 
  }
};
