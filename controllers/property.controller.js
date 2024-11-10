const db = require('../models');
const Property = db.Property;


// Create a new property
exports.create = async (req, res) => {
  try { 
    
    console.log("Received values in request body:", JSON.stringify(req.body, null, 2));

    const newProperty = await Property.create(req.body);
    res.status(201).send(newProperty);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get all properties
exports.findAll = async (req, res) => {
  try {
    console.log("Received request in property findAll with body: ", req.body);
    
    // Fetch all properties from the database
    const properties = await Property.findAll();
    
    // Check the result and log the response
    console.log("Properties retrieved: ", properties);
    console.log("Total properties found: ", properties.length);

    // Send response with properties
    res.status(200).send(properties);
  } catch (error) {
    // Log the error before sending the response
    console.error("Error in property findAll: ", error.message);
    res.status(500).send({ message: error.message });
  }
};


// Get a single property by ID
exports.findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).send({ message: 'Property not found' });
    }
    res.status(200).send(property);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update a property by ID
exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Property.update(req.body, {
      where: { propertyId: id }
    });
    if (!updated) {
      return res.status(404).send({ message: 'Property not found' });
    }
    res.status(200).send({ message: 'Property updated' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a property by ID
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Property.destroy({
      where: { propertyId: id }
    });
    if (!deleted) {
      return res.status(404).send({ message: 'Property not found' });
    }
    res.status(200).send({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
