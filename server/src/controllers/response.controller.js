// Backend: Response Controller (src/controllers/response.controller.js)
import { Response } from '../models/response.model.js';

export const saveResponse = async (req, res) => {
  try {
    const { content, type } = req.body;
    const response = new Response({
      userId: req.user._id,
      content,
      type
    });
    await response.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to save response',
      error: error.message
    });
  }
};

export const getUserResponses = async (req, res) => {
  try {
    const responses = await Response.find({ 
      userId: req.user._id 
    }).sort({ createdAt: -1 });
    res.json(responses);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get responses',
      error: error.message
    });
  }
};

export const deleteResponse = async (req, res) => {
  try {
    const response = await Response.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }
    
    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete response',
      error: error.message
    });
  }
};