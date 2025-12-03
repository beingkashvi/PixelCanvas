// Install: npm install @huggingface/inference

const { HfInference } = require('@huggingface/inference');

// Generate image using Hugging Face API with Provider System
const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    
    if (!HF_API_KEY) {
      return res.status(500).json({ 
        error: 'Hugging Face API key not configured' 
      });
    }

    // Initialize Hugging Face Inference client
    const client = new HfInference(HF_API_KEY);

    console.log('Generating image with prompt:', prompt);
    console.log('Using FLUX.1-dev model with Nebius provider');

    // Use FLUX.1-dev model with provider system (as shown in HF docs)
    const image = await client.textToImage({
      model: "black-forest-labs/FLUX.1-dev",
      inputs: prompt,
      parameters: {
        num_inference_steps: 5,
      },
    });

    console.log('Image generated successfully');
    console.log('Image type:', image.constructor.name);

    // Convert Blob to Buffer
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer || buffer.length === 0) {
      throw new Error('Received empty image from API');
    }

    // Convert to base64
    const base64Image = buffer.toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    console.log('✓ Image successfully converted to base64');
    console.log('Image size:', buffer.length, 'bytes');

    res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      prompt: prompt,
    });

  } catch (error) {
    console.error('=== Image generation error ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    // Handle specific errors
    let errorMessage = error.message || 'Failed to generate image';
    let statusCode = 500;

    if (error.message && error.message.includes('Model is currently loading')) {
      errorMessage = 'AI model is loading. Please try again in 20-30 seconds.';
      statusCode = 503;
    } else if (error.message && error.message.includes('Invalid API token')) {
      errorMessage = 'Invalid API key. Please check your Hugging Face credentials.';
      statusCode = 401;
    } else if (error.message && error.message.includes('rate limit')) {
      errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      statusCode = 429;
    }
    
    res.status(statusCode).json({ 
      error: errorMessage 
    });
  }
};

module.exports = {
  generateImage,
};