// aiController.js

// No external SDK imports needed for Pollinations (uses native fetch)

const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Generating image with prompt:', prompt);
    console.log('Using Pollinations.ai (Flux Model)...');

    // 1. Construct the URL
    // We add a random seed to ensure different images for the same prompt
    const randomSeed = Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(prompt);
    
    // URL Structure: https://image.pollinations.ai/prompt/[prompt]?[parameters]
    const imageUrlURL = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=flux&seed=${randomSeed}&nologo=true`;

    // 2. Fetch the image directly
    const response = await fetch(imageUrlURL);

    if (!response.ok) {
      throw new Error(`Pollinations API Error: ${response.statusText}`);
    }

    // 3. Convert blob/buffer to node Buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer || buffer.length === 0) {
      throw new Error('Received empty image from API');
    }

    // 4. Convert to base64 (Matching your frontend expectation)
    const base64Image = buffer.toString('base64');
    const finalImageUrl = `data:image/jpeg;base64,${base64Image}`;

    console.log('✓ Image successfully converted to base64');
    console.log('Image size:', buffer.length, 'bytes');

    // 5. Send response
    res.status(200).json({
      success: true,
      imageUrl: finalImageUrl, // Matches your frontend's expected key
      prompt: prompt,
    });

  } catch (error) {
    console.error('=== Image generation error ===');
    console.error('Error message:', error.message);
    
    res.status(500).json({ 
      error: 'Failed to generate image. Please try again.',
      details: error.message
    });
  }
};

module.exports = {
  generateImage,
};