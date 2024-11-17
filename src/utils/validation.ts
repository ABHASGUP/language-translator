export function validateName(name: string): boolean {
  // Name should be 2-50 characters, letters, spaces, and hyphens only
  return /^[a-zA-Z\s-]{2,50}$/.test(name);
}

export function validateText(text: string, language: string): boolean {
  if (!text.trim()) return false;
  
  // Basic validation for different language scripts
  const scripts = {
    en: /^[a-zA-Z0-9\s.,!?'-]+$/,
    es: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9\s.,!?'-]+$/,
    fr: /^[a-zàâçéèêëîïôûùüÿñæœA-ZÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ0-9\s.,!?'-]+$/,
    de: /^[a-zäöüßA-ZÄÖÜ0-9\s.,!?'-]+$/,
    // Add more language-specific regex patterns as needed
  };

  return scripts[language as keyof typeof scripts]?.test(text) ?? true;
}

export function validateMotivation(text: string): boolean {
  // 10-500 characters, basic punctuation allowed
  return text.length >= 10 && text.length <= 500 && /^[\w\s.,!?'-]+$/.test(text);
}