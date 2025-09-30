import { createWorker } from "tesseract.js";

export interface OCRResult {
  extractedText: string;
  confidence: number;
  medicines: ExtractedMedicine[];
}

export interface ExtractedMedicine {
  name: string;
  dosage?: string;
  quantity?: number;
  instructions?: string;
  confidence: number;
}

export class OCRService {
  /**
   * Extract text from image buffer using Tesseract.js
   */
  static async extractText(imageBuffer: Buffer): Promise<OCRResult> {
    let worker;
    
    try {
      worker = await createWorker("eng", 1, {
        logger: (m) => console.log("OCR Progress:", m),
      });

      const { data } = await worker.recognize(imageBuffer);
      
      await worker.terminate();

      // Extract text and parse medicines
      const extractedText = data.text;
      const confidence = data.confidence;
      const medicines = this.parseMedicines(extractedText);

      return {
        extractedText,
        confidence,
        medicines,
      };
    } catch (error) {
      if (worker) {
        await worker.terminate();
      }
      console.error("OCR Error:", error);
      throw new Error("Failed to extract text from image");
    }
  }

  /**
   * Parse medicine names and details from extracted text
   */
  private static parseMedicines(text: string): ExtractedMedicine[] {
    const medicines: ExtractedMedicine[] = [];
    const lines = text.split("\n").filter(line => line.trim().length > 0);

    // Common medicine patterns and keywords
    const medicinePatterns = [
      // Pattern: Medicine name with dosage (e.g., "Paracetamol 500mg")
      /([A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+(?:\.\d+)?)\s*(mg|g|ml|mcg|iu)\b/gi,
      // Pattern: Medicine name followed by tablet/capsule count
      /([A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+)\s*(tablet|tab|capsule|cap|syrup|ml)\b/gi,
    ];

    const dosagePatterns = [
      /(\d+)\s*times?\s*(?:a\s*|per\s*)?day/gi,
      /(\d+)\s*(?:x|times)\s*(?:daily|per day)/gi,
      /morning|afternoon|evening|night|bedtime|before meal|after meal/gi,
    ];

    for (const line of lines) {
      let foundMedicine = false;

      // Try each pattern
      for (const pattern of medicinePatterns) {
        const matches = [...line.matchAll(pattern)];
        
        for (const match of matches) {
          const medicineName = match[1].trim();
          const dosageValue = match[2];
          const dosageUnit = match[3];

          // Skip if medicine name is too short or looks invalid
          if (medicineName.length < 3) continue;

          // Extract instructions from the same line
          const instructions = this.extractInstructions(line);
          
          medicines.push({
            name: medicineName,
            dosage: dosageValue && dosageUnit ? `${dosageValue}${dosageUnit}` : undefined,
            quantity: this.extractQuantity(line),
            instructions: instructions || undefined,
            confidence: 0.8, // Base confidence, could be improved with ML
          });

          foundMedicine = true;
        }
      }

      // If no pattern matched but line contains potential medicine name
      if (!foundMedicine && this.looksLikeMedicine(line)) {
        const medicineName = this.extractMedicineName(line);
        if (medicineName && medicineName.length >= 3) {
          medicines.push({
            name: medicineName,
            dosage: this.extractDosageFromLine(line),
            quantity: this.extractQuantity(line),
            instructions: this.extractInstructions(line),
            confidence: 0.6, // Lower confidence for fallback extraction
          });
        }
      }
    }

    // Remove duplicates and improve confidence based on context
    return this.deduplicateAndRankMedicines(medicines);
  }

  private static looksLikeMedicine(line: string): boolean {
    const medicineKeywords = [
      'tablet', 'tab', 'capsule', 'cap', 'syrup', 'injection', 'cream', 'ointment',
      'drops', 'suspension', 'mg', 'g', 'ml', 'mcg', 'iu'
    ];

    const lowerLine = line.toLowerCase();
    return medicineKeywords.some(keyword => lowerLine.includes(keyword)) ||
           /\b[A-Za-z]{4,}\s+\d+(?:mg|g|ml|mcg)\b/.test(line);
  }

  private static extractMedicineName(line: string): string {
    // Extract the main medicine name (usually the first meaningful word(s))
    const words = line.trim().split(/\s+/);
    const medicineWords: string[] = [];

    for (const word of words) {
      // Stop at dosage indicators, quantities, or instructions
      if (/^\d+(?:mg|g|ml|mcg|iu|tablet|tab|cap)$/i.test(word)) {
        break;
      }
      if (/^(?:take|use|apply|morning|evening|daily)$/i.test(word)) {
        break;
      }
      
      medicineWords.push(word);
      
      // Limit to 2-3 words for medicine name
      if (medicineWords.length >= 3) break;
    }

    return medicineWords.join(' ');
  }

  private static extractDosageFromLine(line: string): string | undefined {
    const dosageMatch = line.match(/(\d+(?:\.\d+)?)\s*(mg|g|ml|mcg|iu)\b/i);
    return dosageMatch ? `${dosageMatch[1]}${dosageMatch[2]}` : undefined;
  }

  private static extractQuantity(line: string): number | undefined {
    // Look for tablet/capsule quantities
    const quantityMatch = line.match(/(\d+)\s*(?:tablet|tab|capsule|cap|piece)/i);
    if (quantityMatch) {
      return parseInt(quantityMatch[1], 10);
    }

    // Look for numeric quantities at the beginning
    const numberMatch = line.match(/^\s*(\d+)\s+/);
    if (numberMatch) {
      const num = parseInt(numberMatch[1], 10);
      return num > 0 && num <= 1000 ? num : undefined;
    }

    return undefined;
  }

  private static extractInstructions(line: string): string | undefined {
    const instructionPatterns = [
      /(?:take|use|apply)\s+([^,\n]+)/i,
      /(\d+\s*times?\s*(?:a\s*|per\s*)?day)/i,
      /(morning|afternoon|evening|night|bedtime)/i,
      /(before|after)\s+(?:meal|food|eating)/i,
    ];

    for (const pattern of instructionPatterns) {
      const match = line.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }

    return undefined;
  }

  private static deduplicateAndRankMedicines(medicines: ExtractedMedicine[]): ExtractedMedicine[] {
    const uniqueMedicines = new Map<string, ExtractedMedicine>();

    for (const medicine of medicines) {
      const key = medicine.name.toLowerCase().trim();
      
      if (!uniqueMedicines.has(key) || 
          medicine.confidence > uniqueMedicines.get(key)!.confidence) {
        uniqueMedicines.set(key, medicine);
      }
    }

    return Array.from(uniqueMedicines.values())
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 20); // Limit to top 20 medicines
  }

  /**
   * Mock OCR for testing when Tesseract isn't available
   */
  static async mockExtractText(fileName: string): Promise<OCRResult> {
    // Mock response based on filename or return generic prescription
    const mockMedicines: ExtractedMedicine[] = [
      {
        name: "Paracetamol",
        dosage: "500mg", 
        quantity: 10,
        instructions: "Take 1 tablet twice daily after meals",
        confidence: 0.9
      },
      {
        name: "Amoxicillin",
        dosage: "250mg",
        quantity: 15,
        instructions: "Take 1 capsule three times daily",
        confidence: 0.85
      }
    ];

    return {
      extractedText: "Rx\n\n1. Paracetamol 500mg - Take 1 tablet twice daily after meals x 10 tablets\n2. Amoxicillin 250mg - Take 1 capsule three times daily x 15 capsules\n\nDr. John Smith\nLicense: MD12345",
      confidence: 0.87,
      medicines: mockMedicines
    };
  }
}