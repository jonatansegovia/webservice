const { Service, Users, Services_users_favourites } = require('../db.js');
// const services_users_favourites = require('../models/Services_users_favourites.js');

async function addFavs(req, res, next) {
    try {
        const { serviceId , userId } = req.body;
        const favService = await Service.findByPk(serviceId);
        const user = await Users.findByPk(userId);
        await Services_users_favourites.create({ serviceId: serviceId, userId: userId  })
        // await user.createService(favService, 'services_users_favourites' );
        return res.status(200).json("add fav")
    } catch (e) {
        next (e);
    };
};

async function getFavs(req, res, next) {
    try {
        const { idUser } = req.params;
        const userFavs = await Services_users_favourites.findAll({ 
            where: {
                userId: idUser,
            }
        })
        return res.status(200).json(userFavs);
    } catch (e) {
        next (e);
    };
};

module.exports = {
    addFavs,
    getFavs,
};