const { JerseyModel } = require('./jersey.model.js');

const getAllJerseys = async (req, res) => {
    try {
        const jerseys = await JerseyModel.find();
        const response = {
            next: null,
            previous: null,
            results: jerseys.map(jersey => ({
                id: jersey.id,
                name: jersey.name,
                team: jersey.team,
                league: jersey.league,
                price: jersey.price,
                season: jersey.season,
                colour: jersey.colour,
                imageURL: jersey.imageURL
            }))
        };
        console.log(response);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getJerseysByLeague = async (req, res) => {
    try {
        const { league } = req.params;
        const jerseys = await JerseyModel.find({ league });
        res.status(200).json(jerseys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getJerseysByTeam = async (req, res) => {
    try {
        const { team } = req.params;
        const jerseys = await JerseyModel.find({ team });
        res.status(200).json(jerseys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getJerseysByColour = async (req, res) => {
    try {
        const { colour } = req.params;
        const jerseys = await JerseyModel.find({ colour });
        res.status(200).json(jerseys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getJerseysByID = async (req, res) => {
    try {
        const { id } = req.params;
        const jersey = await JerseyModel.findById(id);
        if (!jersey) {
            return res.status(404).json({ message: 'Jersey not found' });
        }
        res.json(jersey);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getJerseysBySeason = async (req, res) => {
    try {
        const { season } = req.params;
        const jerseys = await JerseyModel.find({ season });
        res.status(200).json(jerseys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createJersey = async (req, res) => {
    try {
        const jerseys = req.body;
        for (const jersey of jerseys) {
            const newJersey = new JerseyModel(jersey);
            await newJersey.save();
        }
        res.status(201).send('Jerseys inserted successfully');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllJerseys,
    getJerseysByLeague,
    getJerseysByTeam,
    getJerseysByColour,
    getJerseysByID,
    getJerseysBySeason,
    createJersey
};