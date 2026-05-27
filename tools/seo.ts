export const seoData: Record<string, {
  seoTitle: string;
  metaDescription: string;
  faqs: { question: string; answer: string }[];
  howToUse: string[];
}> = {
  "json-formatter": {
    "seoTitle": "JSON Formatter - Online JSON Beautifier & Prettifier",
    "metaDescription": "Free online tool to format, beautify, and prettify JSON data. Make your JSON readable with custom indentation instantly.",
    "faqs": [
      { "question": "How do I format JSON?", "answer": "Paste your messy JSON into the input box and click 'Format JSON' to instantly beautify it." },
      { "question": "Is my data safe?", "answer": "Yes, all processing happens locally in your browser. No data is sent to our servers." },
      { "question": "Can it handle large JSON?", "answer": "Yes, our browser-based formatter can handle large JSON strings efficiently." }
    ],
    "howToUse": [
      "Paste your JSON into the input area.",
      "Click the 'Format JSON' button.",
      "Copy the beautified result from the output area."
    ]
  },
  "json-validator": {
    "seoTitle": "JSON Validator - Check JSON Syntax Online",
    "metaDescription": "Validate your JSON data instantly. Check for syntax errors and ensure your JSON follows RFC 8259 standards.",
    "faqs": [
      { "question": "How do I validate JSON?", "answer": "Paste your JSON and click 'Validate JSON'. We will tell you if it's valid or where the error is." },
      { "question": "Is it free?", "answer": "Yes, our JSON validator is 100% free and works entirely in your browser." },
      { "question": "Does it support nested JSON?", "answer": "Yes, it validates deeply nested objects and arrays perfectly." }
    ],
    "howToUse": [
      "Paste your JSON string into the validator.",
      "Click 'Validate JSON'.",
      "Check the status message for errors or success."
    ]
  },
  "base64-tool": {
    "seoTitle": "Base64 Encoder & Decoder - Online Base64 Tool",
    "metaDescription": "Easily encode text to Base64 or decode Base64 strings back to plain text. Supports Unicode characters.",
    "faqs": [
      { "question": "What is Base64?", "answer": "Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format." },
      { "question": "Does it support UTF-8?", "answer": "Yes, our tool correctly handles Unicode characters during both encoding and decoding." },
      { "question": "Is it secure?", "answer": "Everything is processed locally on your device, ensuring your data never leaves your browser." }
    ],
    "howToUse": [
      "Enter your text or Base64 string.",
      "Choose 'Encode' or 'Decode' mode.",
      "Copy the result instantly."
    ]
  },
  "url-tool": {
    "seoTitle": "URL Encoder & Decoder - Percent-Encoding Online",
    "metaDescription": "Safely encode or decode URLs. Convert special characters into percent-encoded format for safe web transmission.",
    "faqs": [
      { "question": "Why encode URLs?", "answer": "Encoding converts unsafe characters into a format that can be transmitted over the internet safely." },
      { "question": "What is decodeURIComponent?", "answer": "It is a JavaScript function used by this tool to turn encoded URLs back into readable text." },
      { "question": "Is it fast?", "answer": "Yes, processing is instantaneous since it happens locally in your browser." }
    ],
    "howToUse": [
      "Paste the URL or text you wish to process.",
      "Select 'Encode' or 'Decode'.",
      "The result is generated immediately."
    ]
  },
  "uuid-generator": {
    "seoTitle": "UUID Generator - Generate Random Version 4 UUIDs",
    "metaDescription": "Quick and easy online UUID v4 generator. Generate unique identifiers for your software projects instantly.",
    "faqs": [
      { "question": "What is a UUID?", "answer": "A Universally Unique Identifier is a 128-bit number used to identify information in computer systems." },
      { "question": "Are they truly unique?", "answer": "The probability of duplicate v4 UUIDs is so low it is effectively zero for most applications." },
      { "question": "Can I generate many at once?", "answer": "Yes, you can generate up to 50 UUIDs in a single click." }
    ],
    "howToUse": [
      "Select the number of UUIDs you need.",
      "Click 'Generate'.",
      "Copy the generated IDs individually or all at once."
    ]
  },
  "sha256-generator": {
    "seoTitle": "SHA-256 Hash Generator - Secure Online Hashing",
    "metaDescription": "Securely generate SHA-256 cryptographic hashes from any text. Fast, private, and 100% browser-based.",
    "faqs": [
      { "question": "Is SHA-256 reversible?", "answer": "No, SHA-256 is a one-way cryptographic hash function. It cannot be reversed to get the original text." },
      { "question": "Is it safe for passwords?", "answer": "While secure, SHA-256 should be used with a salt for password storage; our tool generates the raw hash." },
      { "question": "Does my text leave my browser?", "answer": "No, the hashing is performed using the browser's native Crypto API on your machine." }
    ],
    "howToUse": [
      "Type or paste your text into the input field.",
      "Click 'Generate SHA-256 Hash'.",
      "Copy the resulting hex string."
    ]
  },
  "regex-tester": {
    "seoTitle": "Regex Tester - Test Regular Expressions Online",
    "metaDescription": "Test and debug your regular expressions in real-time. Includes highlighting for matches and support for regex flags.",
    "faqs": [
      { "question": "How do I use flags?", "answer": "Enter flags like 'g' (global) or 'i' (ignore case) in the flags input to change how the regex behaves." },
      { "question": "Why isn't it matching?", "answer": "Ensure your pattern is valid. Errors are displayed in red to help you fix your syntax." },
      { "question": "Is it real-time?", "answer": "Yes, matches update instantly as you type your regex or your test string." }
    ],
    "howToUse": [
      "Enter your regex pattern and desired flags.",
      "Paste the test text into the input area.",
      "View the highlighted matches below."
    ]
  },
  "timestamp-converter": {
    "seoTitle": "Unix Timestamp Converter - Epoch Time Online",
    "metaDescription": "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds.",
    "faqs": [
      { "question": "What is Epoch time?", "answer": "Unix Epoch time is the number of seconds that have elapsed since January 1, 1970." },
      { "question": "Does it support local time?", "answer": "Yes, it displays the conversion in both your local time zone and UTC." },
      { "question": "Can I get the current timestamp?", "answer": "Yes, use the 'Current Time' button to instantly populate the current Unix time." }
    ],
    "howToUse": [
      "Enter a timestamp or use the date picker.",
      "The conversion happens automatically.",
      "View the results in both Local and UTC formats."
    ]
  },
  "html-minifier": {
    "seoTitle": "HTML Minifier - Compress HTML Code Online",
    "metaDescription": "Minify your HTML code to reduce file size and improve website speed. Removes comments, spaces, and empty lines.",
    "faqs": [
      { "question": "Why minify HTML?", "answer": "Minification reduces payload size, which makes your website load faster and improves SEO." },
      { "question": "Does it break my code?", "answer": "No, it removes non-functional whitespace and comments while preserving your HTML structure." },
      { "question": "Is it safe?", "answer": "Yes, the minification is done locally in your browser without any server communication." }
    ],
    "howToUse": [
      "Paste your source HTML code.",
      "Click 'Minify HTML'.",
      "Copy the compressed output."
    ]
  },
  "css-minifier": {
    "seoTitle": "CSS Minifier - Compress CSS Stylesheets Online",
    "metaDescription": "Minify your CSS stylesheets instantly. Remove comments and extra whitespace to optimize your site performance.",
    "faqs": [
      { "question": "How much space can I save?", "answer": "Depending on your formatting, CSS minification can reduce file size by 20% to 50%." },
      { "question": "Does it remove comments?", "answer": "Yes, our minifier strips all CSS comments and unnecessary spaces." },
      { "question": "Is it production-ready?", "answer": "Absolutely, the output is standard CSS that works in all browsers." }
    ],
    "howToUse": [
      "Paste your CSS into the input field.",
      "Click 'Minify CSS'.",
      "Copy the result to your project."
    ]
  },
  "word-counter": {
    "seoTitle": "Word Counter - Count Words & Characters Online",
    "metaDescription": "Free online word counter tool. Calculate word count, character count, sentences, and paragraphs in real-time.",
    "faqs": [
      { "question": "Does it count spaces?", "answer": "Yes, it provides both total character count (including spaces) and word count." },
      { "question": "Is there a limit?", "answer": "No, you can paste large documents, and it will process them instantly." },
      { "question": "Can I count paragraphs?", "answer": "Yes, the tool tracks words, characters, sentences, and paragraphs simultaneously." }
    ],
    "howToUse": [
      "Paste or type your text into the box.",
      "View the live statistics below.",
      "Copy or clear your text as needed."
    ]
  },
  "case-converter": {
    "seoTitle": "Text Case Converter - UPPERCASE & lowercase",
    "metaDescription": "Easily convert text to UPPERCASE, lowercase, Capitalized, or Sentence case with one click.",
    "faqs": [
      { "question": "What is Sentence case?", "answer": "It capitalizes the first letter of each sentence and makes the rest lowercase." },
      { "question": "Can it capitalize all words?", "answer": "Yes, use the 'Capitalize Each Word' button for titles." },
      { "question": "Is it private?", "answer": "Yes, all conversions are done in your browser on your device." }
    ],
    "howToUse": [
      "Enter your text into the converter.",
      "Click the button for the desired case.",
      "Copy the converted text."
    ]
  },
  "slug-generator": {
    "seoTitle": "Slug Generator - Create SEO-Friendly URLs",
    "metaDescription": "Convert any text into a URL-friendly slug. Removes special characters and replaces spaces with hyphens.",
    "faqs": [
      { "question": "What is a URL slug?", "answer": "A slug is the part of a URL that identifies a page in human-readable words." },
      { "question": "Why use hyphens?", "answer": "Hyphens are the best way to separate words in URLs for search engine optimization." },
      { "question": "Are symbols removed?", "answer": "Yes, all special characters and emojis are stripped to keep the URL valid." }
    ],
    "howToUse": [
      "Type your page title or text.",
      "The slug is generated in real-time.",
      "Copy the result for use in your URL."
    ]
  },
  "space-remover": {
    "seoTitle": "Remove Extra Spaces - Clean Text Online",
    "metaDescription": "Quickly remove duplicate spaces, trailing spaces, and empty lines from your text.",
    "faqs": [
      { "question": "How does it work?", "answer": "It trims every line and replaces multiple spaces between words with a single space." },
      { "question": "Can it remove empty lines?", "answer": "Yes, the tool automatically filters out blank lines from your text." },
      { "question": "Is it free?", "answer": "Yes, it's a free utility that works entirely in your browser." }
    ],
    "howToUse": [
      "Paste your messy text.",
      "Click 'Remove Extra Spaces'.",
      "Copy the cleaned text."
    ]
  },
  "text-sorter": {
    "seoTitle": "Text Sorter - Sort Lines Alphabetically",
    "metaDescription": "Sort your lists or text lines alphabetically from A-Z or Z-A. Supports case-insensitive sorting.",
    "faqs": [
      { "question": "Can I sort Z-A?", "answer": "Yes, use the 'Sort Z → A' button for descending order." },
      { "question": "Does it remove empty lines?", "answer": "Yes, it filters out empty lines before sorting your list." },
      { "question": "Is it case-sensitive?", "answer": "No, it uses locale-aware sorting which is case-insensitive by default." }
    ],
    "howToUse": [
      "Enter your list (one item per line).",
      "Click the sort button (A-Z or Z-A).",
      "Copy your sorted list."
    ]
  },
  "duplicate-remover": {
    "seoTitle": "Remove Duplicate Lines - Clean Lists Online",
    "metaDescription": "Strip duplicate lines from your text or list while preserving the original order of items.",
    "faqs": [
      { "question": "Does it keep order?", "answer": "Yes, it keeps the first occurrence of every line and removes only the duplicates." },
      { "question": "Is it fast?", "answer": "Yes, it uses efficient algorithms to process large lists in milliseconds." },
      { "question": "Does it use my data?", "answer": "No, all processing is done locally on your machine." }
    ],
    "howToUse": [
      "Paste your list into the tool.",
      "Click 'Remove Duplicates'.",
      "Copy the unique lines."
    ]
  },
  "text-reverser": {
    "seoTitle": "Text Reverser - Flip Text and Lines Online",
    "metaDescription": "Reverse your text or flip each line individually. Useful for puzzles, data processing, and fun.",
    "faqs": [
      { "question": "How do I reverse lines?", "answer": "Use 'Reverse Each Line' to flip the characters in each line while keeping the line order." },
      { "question": "Can I flip everything?", "answer": "Yes, 'Reverse Entire Text' will flip the entire content from end to start." },
      { "question": "Is there a limit?", "answer": "No, you can reverse text of any length in your browser." }
    ],
    "howToUse": [
      "Enter the text you want to flip.",
      "Choose to reverse the whole text or individual lines.",
      "Copy the result."
    ]
  },
  "character-counter": {
    "seoTitle": "Character Counter - Accurate Text Counter",
    "metaDescription": "Count characters with and without spaces. Perfect for social media posts and academic requirements.",
    "faqs": [
      { "question": "Why count without spaces?", "answer": "Many platforms have limits that only apply to non-whitespace characters." },
      { "question": "Does it count line breaks?", "answer": "Yes, standard character counts include newlines." },
      { "question": "Is it live?", "answer": "Yes, the counts update instantly as you type." }
    ],
    "howToUse": [
      "Type or paste your text.",
      "Read the counts in the dashboard below.",
      "Clear the box when finished."
    ]
  },
  "random-text-generator": {
    "seoTitle": "Random Text Generator - Create Random Strings",
    "metaDescription": "Generate secure random strings for passwords, testing, or unique IDs. Customizable length and characters.",
    "faqs": [
      { "question": "Are strings secure?", "answer": "They are generated using Math.random() in your browser, suitable for most non-crypto uses." },
      { "question": "Can I include symbols?", "answer": "Yes, you can toggle numbers and symbols to increase string complexity." },
      { "question": "What is the max length?", "answer": "You can generate strings up to 10,000 characters long." }
    ],
    "howToUse": [
      "Select your desired length.",
      "Toggle numbers and symbols as needed.",
      "Click 'Generate' and copy the result."
    ]
  },
  "lorem-ipsum-generator": {
    "seoTitle": "Lorem Ipsum Generator - Placeholder Text",
    "metaDescription": "Generate custom Lorem Ipsum dummy text for your designs. Choose paragraph count and word length.",
    "faqs": [
      { "question": "What is Lorem Ipsum?", "answer": "It is standard dummy text used by designers to fill layouts before content is ready." },
      { "question": "Can I choose paragraph count?", "answer": "Yes, you can specify exactly how many paragraphs you need." },
      { "question": "Is it truly random?", "answer": "It shuffles a standard set of Latin words to create natural-looking text." }
    ],
    "howToUse": [
      "Enter the number of paragraphs.",
      "Set the words per paragraph.",
      "Click 'Generate' and copy the text."
    ]
  },
  "image-compressor": {
    "seoTitle": "Image Compressor - Reduce Image Size Online",
    "metaDescription": "Compress images without losing quality. Support for JPG, PNG, and WebP. Faster website loading times.",
    "faqs": [
      { "question": "Will I lose quality?", "answer": "You can adjust the quality slider to find the perfect balance between size and clarity." },
      { "question": "Is it secure?", "answer": "Yes, your images are processed in your browser and are never uploaded to our servers." },
      { "question": "What formats are supported?", "answer": "We support standard web formats: JPG, PNG, and WebP." }
    ],
    "howToUse": [
      "Upload your image file.",
      "Adjust the quality slider.",
      "Click 'Compress' and download the result."
    ]
  },
  "png-to-jpg": {
    "seoTitle": "PNG to JPG Converter – Free Online Tool",
    "metaDescription": "Convert PNG images to JPG instantly in your browser. No upload required.",
    "faqs": [
      { "question": "How do I convert PNG to JPG?", "answer": "Upload your PNG images and click 'Convert to JPG'." },
      { "question": "Will it lose quality?", "answer": "Converting to JPG involves compression, but we use high-quality settings." },
      { "question": "Is it safe?", "answer": "Yes, processing is 100% local in your browser." }
    ],
    "howToUse": [
      "Select your PNG files.",
      "Click 'Convert to JPG'.",
      "Download your JPG images."
    ]
  },
  "jpg-to-png": {
    "seoTitle": "JPG to PNG Converter – Free Online Tool",
    "metaDescription": "Convert JPG images to PNG instantly in your browser. No upload required.",
    "faqs": [
      { "question": "Is the conversion lossless?", "answer": "Yes, PNG is a lossless format, so quality is preserved." },
      { "question": "Does it support transparency?", "answer": "JPG doesn't have transparency, but the output PNG will be high quality." },
      { "question": "Is it private?", "answer": "Yes, no files are ever uploaded." }
    ],
    "howToUse": [
      "Select your JPG files.",
      "Click 'Convert to PNG'.",
      "Download your PNG images."
    ]
  },
  "jpg-to-webp": {
    "seoTitle": "JPG to WebP Converter – Free Online Tool",
    "metaDescription": "Convert JPG images to WebP format instantly in your browser. No upload required.",
    "faqs": [
      { "question": "Why convert to WebP?", "answer": "WebP provides superior compression and smaller file sizes for the web." },
      { "question": "Is it widely supported?", "answer": "Yes, all modern browsers support WebP." },
      { "question": "Is it free?", "answer": "Yes, entirely free and browser-based." }
    ],
    "howToUse": [
      "Select your JPG files.",
      "Click 'Convert to WebP'.",
      "Download your WebP images."
    ]
  },
  "webp-to-jpg": {
    "seoTitle": "WebP to JPG Converter – Free Online Tool",
    "metaDescription": "Convert WebP images to JPG instantly in your browser. No upload required.",
    "faqs": [
      { "question": "Can I convert many images?", "answer": "Yes, you can upload up to 12 files at once." },
      { "question": "Will it work on my phone?", "answer": "Yes, it works on any device with a modern browser." },
      { "question": "Is it fast?", "answer": "It is ultra-fast as it uses your device's hardware." }
    ],
    "howToUse": [
      "Select your WebP files.",
      "Click 'Convert to JPG'.",
      "Download your JPG images."
    ]
  },
  "png-to-webp": {
    "seoTitle": "PNG to WebP Converter – Free Online Tool",
    "metaDescription": "Convert PNG images to WebP instantly in your browser. No upload required.",
    "faqs": [
      { "question": "Does it keep transparency?", "answer": "Yes, WebP supports alpha transparency just like PNG." },
      { "question": "Is it better than PNG?", "answer": "WebP usually produces much smaller files with similar quality." },
      { "question": "How many can I convert?", "answer": "Up to 12 images per batch." }
    ],
    "howToUse": [
      "Select your PNG files.",
      "Click 'Convert to WebP'.",
      "Download your WebP images."
    ]
  },
  "webp-to-png": {
    "seoTitle": "WebP to PNG Converter – Free Online Tool",
    "metaDescription": "Convert WebP images to PNG instantly in your browser. No upload required.",
    "faqs": [
      { "question": "Is it lossless?", "answer": "Yes, if the source WebP was lossless, the PNG will be too." },
      { "question": "Why use PNG?", "answer": "PNG is widely compatible with all image editors and viewers." },
      { "question": "Are my files safe?", "answer": "Yes, they never leave your device." }
    ],
    "howToUse": [
      "Select your WebP files.",
      "Click 'Convert to PNG'.",
      "Download your PNG images."
    ]
  },
  "heic-to-jpg": {
    "seoTitle": "HEIC to JPG Converter – Free Online Tool",
    "metaDescription": "Convert HEIC images to JPG instantly in your browser. No upload required.",
    "faqs": [
      { "question": "What is HEIC?", "answer": "HEIC is a high-efficiency image format used by Apple devices." },
      { "question": "Can all browsers convert HEIC?", "answer": "Browser support for HEIC varies; it works best in Safari and modern browsers." },
      { "question": "Is it free?", "answer": "Yes, 100% free and private." }
    ],
    "howToUse": [
      "Select your HEIC files.",
      "Click 'Convert to JPG'.",
      "Download your JPG images."
    ]
  },
  "avif-to-jpg": {
    "seoTitle": "AVIF to JPG Converter – Free Online Tool",
    "metaDescription": "Convert AVIF images to JPG instantly in your browser. No upload required.",
    "faqs": [
      { "question": "What is AVIF?", "answer": "AVIF is a modern image format with superior compression." },
      { "question": "Why convert to JPG?", "answer": "JPG has wider compatibility with older software and devices." },
      { "question": "Is it secure?", "answer": "Yes, processing happens entirely on your device." }
    ],
    "howToUse": [
      "Select your AVIF files.",
      "Click 'Convert to JPG'.",
      "Download your JPG images."
    ]
  },
  "svg-to-png": {
    "seoTitle": "SVG to PNG Converter – Free Online Tool",
    "metaDescription": "Convert SVG images to PNG instantly in your browser. No upload required.",
    "faqs": [
      { "question": "Does it keep transparency?", "answer": "Yes, the resulting PNG will preserve the transparency of your SVG." },
      { "question": "Can I scale the SVG?", "answer": "The tool converts the SVG at its original defined size." },
      { "question": "Is it private?", "answer": "Yes, all processing is done locally." }
    ],
    "howToUse": [
      "Select your SVG files.",
      "Click 'Convert to PNG'.",
      "Download your PNG images."
    ]
  },
  "image-resizer": {
    "seoTitle": "Image Resizer - Resize Images Online Free",
    "metaDescription": "Change image dimensions to any width and height. Maintain aspect ratio for professional results.",
    "faqs": [
      { "question": "Can I keep aspect ratio?", "answer": "Yes, the tool can automatically calculate height based on width to avoid stretching." },
      { "question": "What is the output format?", "answer": "Resized images are currently exported as PNG for maximum quality." },
      { "question": "Is it free?", "answer": "Yes, all our image tools are 100% free to use." }
    ],
    "howToUse": [
      "Upload the image you want to resize.",
      "Enter the new width and height.",
      "Download the resized image."
    ]
  },
  "image-editor": {
    "seoTitle": "Image Editor - Rotate & Flip Images Online",
    "metaDescription": "Quickly rotate or flip your images horizontally and vertically. Simple and fast online editing.",
    "faqs": [
      { "question": "Can I rotate 90 degrees?", "answer": "Yes, you can rotate clockwise or counter-clockwise in 90-degree increments." },
      { "question": "Does it support flipping?", "answer": "Yes, you can flip images both horizontally and vertically." },
      { "question": "Is transparency kept?", "answer": "Yes, PNG transparency is preserved during editing." }
    ],
    "howToUse": [
      "Upload your image.",
      "Use the buttons to rotate or flip.",
      "Download the edited version."
    ]
  },
  "image-base64": {
    "seoTitle": "Image to Base64 - Online Base64 Encoder",
    "metaDescription": "Convert any image into a Base64 string for use in HTML, CSS, or JSON. Secure and instant conversion.",
    "faqs": [
      { "question": "Why use Base64 for images?", "answer": "It allows you to embed small images directly in code, reducing the number of HTTP requests." },
      { "question": "Can I go from Base64 to Image?", "answer": "Yes, paste a Base64 string and our tool will render and let you download the image." },
      { "question": "Is it private?", "answer": "Yes, conversion happens entirely on your machine." }
    ],
    "howToUse": [
      "Upload an image or paste a Base64 string.",
      "Copy the generated string or preview the image.",
      "Download the result if needed."
    ]
  },
  "image-metadata": {
    "seoTitle": "Image Metadata Tool - View & Remove EXIF",
    "metaDescription": "Inspect image metadata or strip EXIF data for better privacy. Secure browser-based removal.",
    "faqs": [
      { "question": "What is EXIF data?", "answer": "EXIF data contains info like camera model, settings, and sometimes GPS location." },
      { "question": "Does stripping data help privacy?", "answer": "Yes, it removes sensitive location and hardware info before you share photos." },
      { "question": "Will quality change?", "answer": "Stripping metadata requires re-encoding, which may slightly change quality for JPGs." }
    ],
    "howToUse": [
      "Upload your image.",
      "View the metadata in the summary.",
      "Click 'Remove Metadata' to download a clean version."
    ]
  },
  "image-color-tool": {
    "seoTitle": "Image Color Tool - Extract Palette & Grayscale",
    "metaDescription": "Extract dominant colors from an image or convert photos to grayscale instantly.",
    "faqs": [
      { "question": "How do I extract colors?", "answer": "Upload an image and the tool will automatically find the most prominent hex codes." },
      { "question": "Can I copy the hex codes?", "answer": "Yes, click any color block to copy its hex value to your clipboard." },
      { "question": "What is Grayscale?", "answer": "It converts the image to black and white by removing all color saturation." }
    ],
    "howToUse": [
      "Upload an image file.",
      "View extracted colors or click 'Convert to Grayscale'.",
      "Copy colors or download the black and white image."
    ]
  },
  "thumbnail-generator": {
    "seoTitle": "Thumbnail Generator - Create Image Thumbnails",
    "metaDescription": "Generate custom-sized thumbnails from your images. Perfect for profile pictures and previews.",
    "faqs": [
      { "question": "Does it crop images?", "answer": "Yes, it uses a 'cover' crop to ensure the thumbnail is filled and looks professional." },
      { "question": "Can I set the size?", "answer": "Yes, use the slider to choose any size from 50px to 500px." },
      { "question": "What is the output?", "answer": "Thumbnails are exported as PNG files." }
    ],
    "howToUse": [
      "Upload your original image.",
      "Choose your thumbnail size.",
      "Download the generated thumbnail."
    ]
  },
  "blur-detector": {
    "seoTitle": "Blur Detector - Check Image Sharpness",
    "metaDescription": "Analyze your photos to see if they are blurry or sharp. Uses edge detection to estimate clarity.",
    "faqs": [
      { "question": "How is blur measured?", "answer": "We use a mathematical edge detection filter; a higher score means a sharper image." },
      { "question": "Is it always right?", "answer": "It's an estimate. Dark or low-contrast images might return lower scores even if sharp." },
      { "question": "Does it upload my file?", "answer": "No, analysis is done purely in your browser." }
    ],
    "howToUse": [
      "Upload the photo you want to check.",
      "Wait for the score to calculate.",
      "Review the sharpness analysis."
    ]
  },
  "pdf-merge": {
    "seoTitle": "PDF Merge - Combine PDF Files Online",
    "metaDescription": "Merge multiple PDF documents into a single file securely. Fast, private, and 100% browser-based.",
    "faqs": [
      { "question": "How many PDFs can I merge?", "answer": "You can merge up to 10 PDF files at once for stability." },
      { "question": "Is my data safe?", "answer": "Yes, merging happens on your device. Your PDFs are never sent to a server." },
      { "question": "Can I change order?", "answer": "Currently, files are merged in the order they are selected." }
    ],
    "howToUse": [
      "Select all PDF files you want to combine.",
      "Click 'Merge PDFs'.",
      "Download the new merged document."
    ]
  },
  "pdf-split": {
    "seoTitle": "PDF Split - Extract PDF Pages Online",
    "metaDescription": "Split a PDF or extract specific pages into a new file. Free and secure online PDF tool.",
    "faqs": [
      { "question": "Can I extract one page?", "answer": "Yes, enter the page number you want and click 'Extract Page'." },
      { "question": "Is there a limit?", "answer": "No, any standard PDF can be split in your browser." },
      { "question": "Is quality lost?", "answer": "No, the PDF content is preserved exactly as it is." }
    ],
    "howToUse": [
      "Upload the PDF you want to split.",
      "Enter the page number to extract.",
      "Download the extracted page."
    ]
  },
  "image-to-pdf": {
    "seoTitle": "Image to PDF - Convert JPG/PNG to PDF",
    "metaDescription": "Turn your photos and images into a PDF document. Support for JPG and PNG formats.",
    "faqs": [
      { "question": "Can I merge images into one PDF?", "answer": "Yes, upload multiple images and they will be converted into a multi-page PDF." },
      { "question": "What formats work?", "answer": "We support JPG and PNG image files." },
      { "question": "Is it free?", "answer": "Yes, it is a free utility for all users." }
    ],
    "howToUse": [
      "Upload one or more images.",
      "Click 'Convert to PDF'.",
      "Download your new PDF document."
    ]
  },
  "pdf-metadata": {
    "seoTitle": "PDF Metadata Viewer - Inspect PDF Info",
    "metaDescription": "View PDF title, author, producer, and page count instantly in your browser.",
    "faqs": [
      { "question": "What info can I see?", "answer": "You can see the title, author, creator, and total page count." },
      { "question": "Can I edit it?", "answer": "This version is for viewing only; editing features are coming soon." },
      { "question": "Is it secure?", "answer": "Yes, the PDF data is read locally on your machine." }
    ],
    "howToUse": [
      "Upload your PDF file.",
      "Review the information in the dashboard.",
      "Clear the file when finished."
    ]
  },
  "pdf-rotate": {
    "seoTitle": "PDF Rotate - Rotate PDF Pages Online",
    "metaDescription": "Rotate every page in your PDF document permanently. Choose 90, 180, or 270 degrees.",
    "faqs": [
      { "question": "Does it rotate all pages?", "answer": "Yes, the current tool rotates all pages in the document by the same angle." },
      { "question": "Is it permanent?", "answer": "Yes, the downloaded PDF will have the new orientation saved." },
      { "question": "Is quality preserved?", "answer": "Yes, rotating does not re-render the content, so quality remains perfect." }
    ],
    "howToUse": [
      "Upload your PDF file.",
      "Select the rotation angle.",
      "Click 'Rotate & Download'."
    ]
  },
  "pdf-compress": {
    "seoTitle": "PDF Compress - Reduce PDF Size Online",
    "metaDescription": "Compress PDF documents to make them smaller for sharing. Secure and fast browser-based compression.",
    "faqs": [
      { "question": "How much smaller will it be?", "answer": "It varies based on the PDF structure; many files see significant reductions." },
      { "question": "Will images be blurry?", "answer": "This tool optimizes the PDF file structure, preserving image quality." },
      { "question": "Is it private?", "answer": "Yes, the compression is done entirely on your computer." }
    ],
    "howToUse": [
      "Upload the PDF you want to shrink.",
      "Click 'Compress PDF'.",
      "Download the smaller version."
    ]
  },
  "color-picker": {
    "seoTitle": "Color Picker - Hex, RGB, HSL Selector",
    "metaDescription": "Pick colors and get instant Hex, RGB, and HSL values. Perfect for developers and designers.",
    "faqs": [
      { "question": "Can I copy the values?", "answer": "Yes, click any color format to copy the code to your clipboard." },
      { "question": "Are there HSL values?", "answer": "We provide Hex and RGB; HSL support is coming soon!" },
      { "question": "Is it free?", "answer": "Yes, it's a free utility on our platform." }
    ],
    "howToUse": [
      "Use the color wheel or slider to find a color.",
      "Click on the generated Hex or RGB code.",
      "Paste the code into your project."
    ]
  },
  "gradient-generator": {
    "seoTitle": "CSS Gradient Generator - Linear Gradients",
    "metaDescription": "Design beautiful CSS linear gradients with live preview. Copy the CSS code for your website instantly.",
    "faqs": [
      { "question": "Can I change the angle?", "answer": "Yes, use the slider to set the gradient angle from 0 to 360 degrees." },
      { "question": "How many colors?", "answer": "Our tool currently supports elegant two-color linear gradients." },
      { "question": "Is the CSS compatible?", "answer": "Yes, it generates standard CSS background-image properties." }
    ],
    "howToUse": [
      "Select your two colors.",
      "Adjust the gradient angle.",
      "Copy the CSS code from the output box."
    ]
  },
  "box-shadow-generator": {
    "seoTitle": "CSS Box Shadow Generator - UI Design Tool",
    "metaDescription": "Create custom CSS box shadows with live preview. Adjust blur, spread, offset, and opacity.",
    "faqs": [
      { "question": "What is spread?", "answer": "Spread makes the shadow larger or smaller relative to the element size." },
      { "question": "Can I set opacity?", "answer": "Yes, use the slider to make the shadow subtle or bold." },
      { "question": "How do I get the code?", "answer": "Click 'Copy CSS' to get the property ready for your stylesheet." }
    ],
    "howToUse": [
      "Adjust the X, Y, and blur sliders.",
      "Set the spread and opacity.",
      "Copy the resulting CSS code."
    ]
  },
  "border-radius-generator": {
    "seoTitle": "CSS Border Radius Generator - Rounded Corners",
    "metaDescription": "Design rounded corners for your UI elements. Fast CSS border-radius tool with live preview.",
    "faqs": [
      { "question": "Can I make a circle?", "answer": "Yes, for a square element, set the radius high (e.g., 100px) to create a circle." },
      { "question": "Does it set all corners?", "answer": "Yes, this tool creates a uniform radius for all four corners." },
      { "question": "Is it free?", "answer": "Yes, all our design tools are free." }
    ],
    "howToUse": [
      "Use the slider to change the corner radius.",
      "View the preview on the box above.",
      "Copy the CSS property."
    ]
  },
  "color-palette-generator": {
    "seoTitle": "Color Palette Generator - Random Color Schemes",
    "metaDescription": "Generate random, beautiful color palettes for your designs. Copy hex codes with one click.",
    "faqs": [
      { "question": "How do I get a new palette?", "answer": "Click the 'Generate New Palette' button for a fresh set of colors." },
      { "question": "Can I save them?", "answer": "You can copy the hex codes; saving palettes to a library is coming soon." },
      { "question": "How many colors?", "answer": "Each palette consists of 5 perfectly matched colors." }
    ],
    "howToUse": [
      "Click 'Generate New Palette'.",
      "Click any color block to copy its hex code.",
      "Use the colors in your design."
    ]
  },
  "contrast-checker": {
    "seoTitle": "Contrast Checker - WCAG Accessibility Tool",
    "metaDescription": "Check if your colors meet WCAG accessibility standards. Ensure your text is readable for everyone.",
    "faqs": [
      { "question": "What is the AA limit?", "answer": "For normal text, WCAG AA requires a contrast ratio of 4.5:1." },
      { "question": "Does it check AAA?", "answer": "Yes, we check both AA and AAA standards for normal and large text." },
      { "question": "Why use this?", "answer": "To ensure your website is accessible to users with visual impairments." }
    ],
    "howToUse": [
      "Select your foreground and background colors.",
      "Review the PASS/FAIL status for each standard.",
      "Adjust colors until you meet the requirements."
    ]
  },
  "font-preview": {
    "seoTitle": "Font Preview Tool - Typography Tester",
    "metaDescription": "Test your text with different font families, sizes, and weights. Simple typography design tool.",
    "faqs": [
      { "question": "Can I use custom fonts?", "answer": "The tool uses standard system and web-safe fonts available in your browser." },
      { "question": "What can I change?", "answer": "You can adjust font size, weight, family, and line height." },
      { "question": "Is the CSS available?", "answer": "Yes, the CSS properties are displayed below the preview." }
    ],
    "howToUse": [
      "Type your text in the box.",
      "Use the controls to adjust the typography.",
      "Copy the CSS styles for your project."
    ]
  },
  "qr-code-generator": {
    "seoTitle": "QR Code Generator - Create Custom QR Codes",
    "metaDescription": "Generate high-quality QR codes for links or text instantly. Download as PNG for free.",
    "faqs": [
      { "question": "Are QR codes permanent?", "answer": "Yes, since they contain static data, they will work forever." },
      { "question": "Can I use it for URLs?", "answer": "Absolutely, it's perfect for website links and digital menus." },
      { "question": "Is it free to download?", "answer": "Yes, you can generate and download QR codes for free." }
    ],
    "howToUse": [
      "Enter your URL or text.",
      "The QR code updates automatically.",
      "Download the PNG file."
    ]
  },
  "password-generator": {
    "seoTitle": "Password Generator - Secure Random Passwords",
    "metaDescription": "Generate strong, secure passwords to protect your accounts. Customizable length and characters.",
    "faqs": [
      { "question": "How long should it be?", "answer": "We recommend at least 12-16 characters for good security." },
      { "question": "Are passwords saved?", "answer": "No, they are generated in your browser and never stored anywhere." },
      { "question": "Can I include symbols?", "answer": "Yes, you can toggle both numbers and symbols for extra strength." }
    ],
    "howToUse": [
      "Select password length and character types.",
      "Click 'Generate Secure Password'.",
      "Copy and use your new password."
    ]
  },
  "unit-converter": {
    "seoTitle": "Unit Converter - Length & Weight Converter",
    "metaDescription": "Convert between metric and imperial units for length and weight instantly. Fast and accurate.",
    "faqs": [
      { "question": "What units are supported?", "answer": "We support meters, feet, inches, kilograms, pounds, and more." },
      { "question": "Is it accurate?", "answer": "Yes, it uses high-precision conversion factors." },
      { "question": "Does it have temperature?", "answer": "Not yet, temperature and other units are being added soon." }
    ],
    "howToUse": [
      "Select Length or Weight mode.",
      "Enter the value and the starting unit.",
      "View all conversions in the table below."
    ]
  },
  "percentage-calculator": {
    "seoTitle": "Percentage Calculator - Fast Math Tool",
    "metaDescription": "Calculate percentages, increases, and decreases quickly with our easy-to-use math tool.",
    "faqs": [
      { "question": "What can it calculate?", "answer": "Currently, it finds the percentage of a number; more modes are coming soon." },
      { "question": "Is it free?", "answer": "Yes, like all our tools, it is completely free." },
      { "question": "Does it work on phone?", "answer": "Yes, it's fully responsive and works on all mobile devices." }
    ],
    "howToUse": [
      "Enter the percentage you want to find.",
      "Enter the base number.",
      "The result is displayed immediately."
    ]
  }
};
