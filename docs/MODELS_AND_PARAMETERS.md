# Supported Models and Parameters

Complete reference for all supported models and their configurable parameters in Worksona.js.

## 📋 Quick Reference

| Provider | Latest Models | Chat | Vision | Image Gen | Default Model |
|----------|--------------|------|--------|-----------|---------------|
| **OpenAI** | GPT-5, o3, GPT-4o | ✅ | ✅ | ✅ GPT Image 1.5 | `gpt-4o` |
| **Anthropic** | Claude Opus 4.5, Sonnet 4.5 | ✅ | ❌ | ❌ | `claude-sonnet-4-5-20250929` |
| **Google** | Gemini Pro | ✅ | ❌ | ❌ | `gemini-pro` |

---

## 🤖 OpenAI Models

### Latest Frontier Models

#### GPT-5 Series
- **`gpt-5`** - Flagship model for complex tasks
- **`gpt-5-mini`** - Balanced performance and cost
- **`gpt-5-nano`** - Fast and efficient for simple tasks

**⚠️ Important:** GPT-5 models only support `temperature=1` (fixed)

#### Reasoning Models (o-series)
- **`o3`** - Advanced reasoning capabilities
- **`o3-mini`** - Efficient reasoning
- **`o1`** - Previous generation reasoning
- **`o1-mini`** - Efficient o1 variant
- **`o1-preview`** - Preview version

**⚠️ Important:** o-series models only support `temperature=1` (fixed)

### GPT-4 Series
- **`gpt-4o`** - Latest GPT-4 optimized (default)
- **`gpt-4o-mini`** - Faster GPT-4 variant
- **`gpt-4-turbo`** - Turbo variant
- **`gpt-4-turbo-preview`** - Preview version
- **`gpt-4`** - Standard GPT-4
- **`gpt-4-32k`** - Extended context (32k tokens)

### Vision Models
- **`gpt-4o-vision`** - GPT-4o with vision capabilities
- **`gpt-4-turbo-vision`** - Turbo with vision
- **`gpt-4-vision-preview`** - Preview vision model

### GPT-3.5 Series (Legacy)
- **`gpt-3.5-turbo`** - Standard GPT-3.5
- **`gpt-3.5-turbo-16k`** - Extended context (16k tokens)

### Image Generation

#### GPT Image Models (Latest) 🆕
- **`gpt-image-1.5`** - Latest GPT Image model, best quality and instruction following (default)
- **`gpt-image-1`** - Previous GPT Image model, good quality
- **`gpt-image-1-mini`** - Cost-effective GPT Image model

**Key Features:**
- Returns base64-encoded images (not URLs)
- Supports transparency (`background: 'transparent'`)
- Multiple output formats: PNG, JPEG, WebP
- Quality control: `auto`, `high`, `medium`, `low`
- Streaming support with partial image previews
- Multiple image inputs (up to 16 for edits)

#### DALL-E Models (Legacy)
- **`dall-e-3`** - Latest DALL-E model (returns URLs)
- **`dall-e-2`** - Previous generation (returns URLs)

---

## 🧠 Anthropic Models

### Latest Frontier Models (Claude 4.5)

#### Claude 4.5 Series
- **`claude-opus-4-5-20251101`** - Most capable Claude model 🆕
- **`claude-sonnet-4-5-20250929`** - Balanced performance (default) 🆕

### Claude 3.5 Series
- **`claude-3-5-sonnet-20241022`** - Updated Sonnet 3.5
- **`claude-3-5-sonnet-20240620`** - Previous Sonnet 3.5
- **`claude-3-5-haiku-20241022`** - Fast and efficient

### Claude 3 Series (Legacy)
- **`claude-3-opus-20240229`** - Most capable Claude 3
- **`claude-3-sonnet-20240229`** - Balanced Claude 3
- **`claude-3-haiku-20240307`** - Fast Claude 3

### Older Models (Backward Compatibility)
- **`claude-2.1`** - Claude 2.1
- **`claude-2.0`** - Claude 2.0
- **`claude-instant-1.2`** - Instant variant

---

## 🔍 Google Models

### Gemini Series
- **`gemini-pro`** - Standard Gemini model (default)
- **`gemini-pro-vision`** - Gemini with vision capabilities

---

## ⚙️ Configurable Parameters

### Common Parameters (All Providers)

#### Agent Configuration (`config` object)

```javascript
{
  provider: 'openai' | 'anthropic' | 'google',
  model: 'model-name',
  temperature: 0.7,        // 0.0 - 2.0 (OpenAI), 0.0 - 1.0 (Anthropic/Google)
  maxTokens: 500,           // Maximum response tokens
  systemPrompt: '...',      // System instructions
  topP: 1.0,                // Nucleus sampling (0.0 - 1.0)
  topK: 50,                 // Top-K sampling (Anthropic only)
  frequencyPenalty: 0,      // -2.0 to 2.0 (OpenAI only)
  presencePenalty: 0,       // -2.0 to 2.0 (OpenAI only)
  organization: ''          // OpenAI organization ID (optional)
}
```

### Chat Options (`chat()` method)

```javascript
await worksona.chat(agentId, message, {
  temperature: 0.7,         // Override agent temperature
  maxTokens: 800,           // Override agent maxTokens
  topP: 0.9,                // Override agent topP
  frequencyPenalty: 0.5,    // OpenAI only
  presencePenalty: 0.5      // OpenAI only
});
```

---

## 📊 Parameter Details

### Temperature
- **Range:** 
  - OpenAI: `0.0` - `2.0`
  - Anthropic: `0.0` - `1.0`
  - Google: `0.0` - `1.0`
- **Default:** `0.7`
- **Effect:** Controls randomness. Lower = more focused, Higher = more creative
- **⚠️ Restrictions:**
  - GPT-5 series: Fixed at `1.0`
  - o-series (o1, o3): Fixed at `1.0`

### Max Tokens
- **Range:** `1` - `4096` (varies by model)
- **Default:** `500`
- **Effect:** Maximum length of response
- **Model Limits:**
  - GPT-4o: Up to 16,384 tokens
  - GPT-4: Up to 8,192 tokens
  - Claude Opus 4.5: Up to 4,096 tokens
  - Claude Sonnet 4.5: Up to 4,096 tokens
  - Gemini Pro: Up to 2,048 tokens

### Top P (Nucleus Sampling)
- **Range:** `0.0` - `1.0`
- **Default:** `1.0`
- **Effect:** Controls diversity via nucleus sampling
- **Usage:** Lower values = more focused responses

### Top K (Anthropic Only)
- **Range:** `1` - `100`
- **Default:** `50`
- **Effect:** Limits sampling to top K tokens
- **Provider:** Anthropic only

### Frequency Penalty (OpenAI Only)
- **Range:** `-2.0` - `2.0`
- **Default:** `0`
- **Effect:** Reduces repetition of frequent tokens
- **Provider:** OpenAI only

### Presence Penalty (OpenAI Only)
- **Range:** `-2.0` - `2.0`
- **Default:** `0`
- **Effect:** Encourages new topics
- **Provider:** OpenAI only

---

## 🖼️ Image Generation Parameters (GPT Image Models)

### GPT Image Model-Specific Parameters

#### Quality
- **Range:** `'auto'` | `'high'` | `'medium'` | `'low'`
- **Default:** `'auto'`
- **Effect:** Controls image quality vs generation speed
- **Models:** GPT Image models only

#### Output Format
- **Range:** `'png'` | `'jpeg'` | `'webp'`
- **Default:** `'png'`
- **Effect:** Image file format
- **Models:** GPT Image models only
- **Note:** Required for transparency support

#### Output Compression
- **Range:** `0` - `100`
- **Default:** Not set
- **Effect:** Compression level for JPEG/WebP
- **Models:** GPT Image models only
- **Note:** Only applies when `output_format` is `'jpeg'` or `'webp'`

#### Background
- **Range:** `'auto'` | `'transparent'` | `'opaque'`
- **Default:** `'auto'`
- **Effect:** Background transparency
- **Models:** GPT Image models only
- **Note:** Requires `output_format` to be `'png'` or `'webp'`

#### Moderation
- **Range:** `'auto'` | `'low'`
- **Default:** `'auto'`
- **Effect:** Content moderation level
- **Models:** GPT Image models only

#### Input Fidelity (Edit Only)
- **Range:** `'low'` | `'high'`
- **Default:** Not set
- **Effect:** How closely to follow the original image
- **Models:** `gpt-image-1` only (not available for `gpt-image-1-mini` or `gpt-image-1.5`)
- **Note:** Only applies to image editing

#### Streaming
- **Type:** `boolean`
- **Default:** `false`
- **Effect:** Enable streaming responses
- **Models:** GPT Image models only

#### Partial Images (Streaming)
- **Range:** `0` - `3`
- **Default:** `0`
- **Effect:** Number of partial image events during streaming
- **Models:** GPT Image models only
- **Note:** Only applies when `stream: true`

### Image Generation Size Options

#### GPT Image Models
- **`'auto'`** - Automatic size selection (default)
- **`'1024x1024'`** - Square
- **`'1536x1024'`** - Landscape
- **`'1024x1536'`** - Portrait

#### DALL-E Models
- **DALL-E 3:** `'1024x1024'`, `'1792x1024'`, `'1024x1792'`
- **DALL-E 2:** `'256x256'`, `'512x512'`, `'1024x1024'`

---

## 🎯 Model Selection Guide

### Use GPT-5 When:
- ✅ Need highest quality responses
- ✅ Complex reasoning tasks
- ✅ Can accept fixed temperature=1
- ✅ Budget allows premium pricing

### Use o3/o1 When:
- ✅ Need advanced reasoning
- ✅ Mathematical/logical problems
- ✅ Can accept fixed temperature=1
- ✅ Need step-by-step thinking

### Use GPT-4o When:
- ✅ Need vision capabilities
- ✅ Want customizable temperature
- ✅ Good balance of quality and cost
- ✅ General-purpose tasks

### Use GPT Image 1.5 When:
- ✅ Need highest quality image generation
- ✅ Want transparency support
- ✅ Need multiple output formats
- ✅ Want streaming with partial previews
- ✅ Need multiple image inputs for editing

### Use GPT Image 1 When:
- ✅ Need input_fidelity control for edits
- ✅ Good quality at lower cost than 1.5
- ✅ Don't need latest features

### Use GPT Image 1 Mini When:
- ✅ Cost-effective image generation
- ✅ Fast generation speed
- ✅ Quality is acceptable
- ✅ Don't need input_fidelity

### Use Claude Opus 4.5 When:
- ✅ Need highest quality (Anthropic)
- ✅ Long-form content generation
- ✅ Complex analysis tasks
- ✅ Can use Anthropic API

### Use Claude Sonnet 4.5 When:
- ✅ Need balanced performance
- ✅ Cost-effective quality
- ✅ General-purpose tasks
- ✅ Default Anthropic choice

### Use Gemini Pro When:
- ✅ Need Google ecosystem integration
- ✅ Cost-effective option
- ✅ General-purpose tasks

---

## 💡 Best Practices

### Temperature Settings
- **Creative writing:** `0.8` - `1.2`
- **Technical documentation:** `0.3` - `0.5`
- **Customer service:** `0.5` - `0.7`
- **Code generation:** `0.2` - `0.4`
- **Analysis/reasoning:** `0.1` - `0.3`

### Max Tokens
- **Short responses:** `100` - `300`
- **Standard responses:** `500` - `1000`
- **Long-form content:** `2000` - `4000`
- **Conversations:** `500` - `1500`

### Model Selection
1. **Start with defaults:** `gpt-4o` or `claude-sonnet-4-5-20250929`
2. **Upgrade for quality:** Use GPT-5 or Claude Opus 4.5
3. **Downgrade for speed/cost:** Use GPT-4o-mini or Claude Haiku
4. **Specialized needs:** Use o3 for reasoning, GPT-4o-vision for images

### Image Generation Selection
1. **Default:** `gpt-image-1.5` - Best quality and features
2. **Cost-effective:** `gpt-image-1-mini` - Fast and affordable
3. **Editing with fidelity:** `gpt-image-1` - Supports input_fidelity
4. **Legacy:** `dall-e-3` - Still supported, returns URLs

---

## 📝 Example Configurations

### High-Quality Agent
```javascript
{
  provider: 'openai',
  model: 'gpt-5',
  temperature: 1,  // Fixed for GPT-5
  maxTokens: 2000,
  systemPrompt: 'You are an expert...'
}
```

### Fast & Efficient Agent
```javascript
{
  provider: 'openai',
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 500,
  systemPrompt: 'You are a helpful assistant...'
}
```

### Reasoning Agent
```javascript
{
  provider: 'openai',
  model: 'o3',
  temperature: 1,  // Fixed for o3
  maxTokens: 4000,
  systemPrompt: 'Think step by step...'
}
```

### Creative Writing Agent
```javascript
{
  provider: 'anthropic',
  model: 'claude-opus-4-5-20251101',
  temperature: 0.9,
  maxTokens: 2000,
  topP: 0.95,
  systemPrompt: 'You are a creative writer...'
}
```

### Technical Documentation Agent
```javascript
{
  provider: 'anthropic',
  model: 'claude-sonnet-4-5-20250929',
  temperature: 0.3,
  maxTokens: 3000,
  topP: 0.8,
  systemPrompt: 'You are a technical writer...'
}
```

### High-Quality Image Generation Agent
```javascript
{
  provider: 'openai',
  imageGenerationModel: 'gpt-image-1.5',
  // Image generation options
  imageOptions: {
    quality: 'high',
    output_format: 'png',
    background: 'transparent',
    size: 'auto'
  }
}
```

### Cost-Effective Image Generation Agent
```javascript
{
  provider: 'openai',
  imageGenerationModel: 'gpt-image-1-mini',
  imageOptions: {
    quality: 'medium',
    output_format: 'jpeg',
    output_compression: 85
  }
}
```

### Image Editing Agent (with Input Fidelity)
```javascript
{
  provider: 'openai',
  imageGenerationModel: 'gpt-image-1',
  imageOptions: {
    input_fidelity: 'high',  // Only for gpt-image-1
    quality: 'high',
    output_format: 'png'
  }
}
```

---

## 🔌 API Server Endpoints

### Image Generation Endpoint

**POST** `/api/images/generate`

```javascript
// Request
{
  "agentId": "optional-agent-id",
  "prompt": "A futuristic cityscape",
  "options": {
    "model": "gpt-image-1.5",
    "quality": "high",
    "output_format": "png",
    "background": "transparent",
    "size": "auto",
    "n": 1
  }
}

// Response
{
  "success": true,
  "data": {
    "imageUrl": "data:image/png;base64,...",
    "metadata": {
      "prompt": "A futuristic cityscape",
      "duration": 1234,
      "timestamp": "2026-01-23T..."
    }
  }
}
```

### Image Editing Endpoint

**POST** `/api/images/edit` (or via agent endpoint)

```javascript
// Request (multipart/form-data)
{
  "file": <image file>,
  "prompt": "Add a sunset sky",
  "model": "gpt-image-1",
  "input_fidelity": "high",
  "quality": "high",
  "output_format": "png"
}
```

---

## 🔗 Additional Resources

- **API Reference:** See `README.md` for full API documentation
- **Quick Start:** See `QUICK_START.md` for getting started guide
- **Examples:** Check `www/demos/` for interactive examples
- **LLM Documentation:** See `llm.txt` for AI-friendly reference
- **Server API:** See `worksona-server.js` for REST API endpoints

---

## 🎨 GPT Image Model Usage Examples

### Basic Image Generation
```javascript
// Generate image with GPT Image 1.5 (default)
const imageUrl = await worksona.generateImage('agent-id', 'A futuristic cityscape', {
  model: 'gpt-image-1.5',
  quality: 'high',
  output_format: 'png',
  size: 'auto'
});
// Returns: data:image/png;base64,... (base64 data URL)
```

### Transparent Background Image
```javascript
const transparentImage = await worksona.generateImage('agent-id', 'A logo design', {
  model: 'gpt-image-1.5',
  background: 'transparent',
  output_format: 'png',  // Required for transparency
  quality: 'high'
});
```

### Cost-Effective Generation
```javascript
const image = await worksona.generateImage('agent-id', 'A simple illustration', {
  model: 'gpt-image-1-mini',
  quality: 'medium',
  output_format: 'jpeg',
  output_compression: 85  // Compress JPEG
});
```

### Image Editing with Input Fidelity
```javascript
// Edit with gpt-image-1 (supports input_fidelity)
const editedImage = await worksona.editImage('agent-id', originalImageData, 'Add a sunset sky', {
  model: 'gpt-image-1',
  input_fidelity: 'high',  // Only for gpt-image-1
  quality: 'high',
  output_format: 'png'
});
```

### Multiple Image Editing
```javascript
// Edit up to 16 images at once (GPT Image models)
const editedImages = await worksona.editImage('agent-id', [img1, img2, img3], 'Apply vintage filter', {
  model: 'gpt-image-1.5',
  quality: 'high',
  output_format: 'png'
});
```

### Streaming with Partial Previews
```javascript
// Enable streaming for progressive image previews
const image = await worksona.generateImage('agent-id', 'A detailed painting', {
  model: 'gpt-image-1.5',
  stream: true,
  partial_images: 2,  // Get 2 partial image events
  quality: 'high'
});
// Listen for 'image-generation-complete' event for final image
// Listen for partial image events during generation
```

### Converting Base64 to File
```javascript
// GPT Image models return base64 data URLs
const dataUrl = await worksona.generateImage('agent-id', 'An illustration', {
  model: 'gpt-image-1.5',
  output_format: 'png'
});

// Extract format from data URL
const format = dataUrl.match(/data:image\/(\w+);base64/)[1];

// Convert to blob/file
const base64Data = dataUrl.split(',')[1];
const binaryData = atob(base64Data);
const bytes = new Uint8Array(binaryData.length);
for (let i = 0; i < binaryData.length; i++) {
  bytes[i] = binaryData.charCodeAt(i);
}
const blob = new Blob([bytes], { type: `image/${format}` });
const file = new File([blob], `image.${format}`, { type: `image/${format}` });

// Or use directly in img tag
const img = document.createElement('img');
img.src = dataUrl;  // Works directly!
```

### Handling Multiple Images (Editing)
```javascript
// Edit multiple images at once (up to 16)
const imageArray = [image1DataUrl, image2DataUrl, image3DataUrl];

const editedImages = await worksona.editImage('agent-id', imageArray, 'Apply vintage filter', {
  model: 'gpt-image-1.5',
  quality: 'high',
  output_format: 'png'
});

// Returns single edited image (first in array)
// For multiple outputs, use n parameter
const multipleEdits = await worksona.editImage('agent-id', imageArray, 'Apply filter', {
  model: 'gpt-image-1.5',
  n: 3  // Generate 3 variations
});
```

### Error Handling
```javascript
try {
  const image = await worksona.generateImage('agent-id', 'A painting', {
    model: 'gpt-image-1.5',
    quality: 'high'
  });
  
  if (!image) {
    console.error('Image generation failed');
    return;
  }
  
  // Handle base64 data URL
  console.log('Image generated:', image.substring(0, 50) + '...');
} catch (error) {
  // Listen for error events
  worksona.on('image-generation-error', (data) => {
    console.error('Generation error:', data.error);
  });
  
  // Handle specific errors
  if (error.message.includes('organization')) {
    console.error('Organization verification required');
  } else if (error.message.includes('quota')) {
    console.error('API quota exceeded');
  }
}
```

---

## ⚠️ Important Notes

### GPT Image vs DALL-E Differences

| Feature | GPT Image Models | DALL-E Models |
|---------|------------------|---------------|
| **Response Format** | Base64 (always) | URL or Base64 |
| **Transparency** | ✅ Supported | ❌ Not supported |
| **Multiple Images** | ✅ Up to 16 (edit) | ❌ Single image |
| **Input Fidelity** | ✅ (gpt-image-1 only) | ❌ Not supported |
| **Streaming** | ✅ With partial images | ❌ Not supported |
| **Quality Control** | ✅ 4 levels | ❌ Not supported |
| **Output Formats** | PNG, JPEG, WebP | PNG, URL |

### Model-Specific Restrictions

- **`gpt-image-1-mini`**: Does NOT support `input_fidelity` parameter
- **`gpt-image-1`**: Supports `input_fidelity` for edits
- **`gpt-image-1.5`**: Latest features, best quality
- **Transparency**: Requires `output_format` to be `'png'` or `'webp'`
- **Compression**: Only applies to JPEG/WebP formats

### API Requirements

- **Organization Verification**: May be required for GPT Image models
- **Base64 Handling**: GPT Image models always return base64 (not URLs)
- **File Size Limits**: Images must be < 50MB for GPT Image models
- **Multiple Images**: Up to 16 images supported for editing (GPT Image models only)
- **Mask Format**: PNG format required for masks (alpha=0 = editable regions)

---

---

## 📚 Complete Parameter Reference

### Image Generation Options (Complete)

```javascript
{
  // Model selection
  model: 'gpt-image-1.5' | 'gpt-image-1' | 'gpt-image-1-mini' | 'dall-e-3' | 'dall-e-2',
  
  // Output configuration
  quality: 'auto' | 'high' | 'medium' | 'low',           // GPT Image only
  output_format: 'png' | 'jpeg' | 'webp',                // GPT Image only
  output_compression: 0-100,                              // GPT Image only (JPEG/WebP)
  background: 'auto' | 'transparent' | 'opaque',          // GPT Image only
  size: 'auto' | '1024x1024' | '1536x1024' | '1024x1536', // GPT Image
  size: '1024x1024' | '1792x1024' | '1024x1792',        // DALL-E 3
  size: '256x256' | '512x512' | '1024x1024',            // DALL-E 2
  
  // Batch generation
  n: 1-10,                                                // Number of images
  
  // Safety & tracking
  moderation: 'auto' | 'low',                            // GPT Image only
  user: 'user-id',                                        // User identifier
  
  // Streaming (GPT Image only)
  stream: true | false,
  partial_images: 0 | 1 | 2 | 3,                         // Partial previews
  
  // Editing specific (GPT Image only)
  input_fidelity: 'low' | 'high',                        // gpt-image-1 only
  images: [image1, image2, ...],                         // Up to 16 images
  mask: maskImageData                                     // PNG mask (DALL-E)
}
```

---

## 🎓 Quick Decision Tree

### Choosing an Image Model

```
Need transparency or multiple formats?
├─ Yes → Use gpt-image-1.5 (best) or gpt-image-1
└─ No → Continue...

Need input_fidelity for editing?
├─ Yes → Use gpt-image-1
└─ No → Continue...

Budget conscious?
├─ Yes → Use gpt-image-1-mini
└─ No → Use gpt-image-1.5 (best quality)

Legacy compatibility needed?
└─ Yes → Use dall-e-3 (returns URLs)
```

### Choosing a Chat Model

```
Need reasoning/step-by-step thinking?
├─ Yes → Use o3 or o1
└─ No → Continue...

Need vision/image analysis?
├─ Yes → Use gpt-4o-vision
└─ No → Continue...

Highest quality needed?
├─ Yes → Use gpt-5 or claude-opus-4-5-20251101
└─ No → Use gpt-4o or claude-sonnet-4-5-20250929 (defaults)
```

---

**Last Updated:** January 2026  
**Version:** 0.3.0
