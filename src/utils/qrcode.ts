// QR Code generator using Canvas API
// Based on public domain QR code generation algorithm

interface QRCodeOptions {
  size?: number;
  margin?: number;
  color?: string;
  backgroundColor?: string;
}

class QRCodeGenerator {
  private size: number;
  private margin: number;
  private moduleCount: number = 33; // Version 3 QR Code

  constructor(options: QRCodeOptions = {}) {
    this.size = options.size || 256;
    this.margin = options.margin || 4;
  }

  // Generate QR code on canvas
  generate(text: string): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    // Calculate dimensions
    const totalSize = this.moduleCount + this.margin * 2;
    const moduleSize = this.size / totalSize;

    canvas.width = this.size;
    canvas.height = this.size;

    // Fill background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.size, this.size);

    // Create QR matrix
    const matrix = this.createQRMatrix(text);

    // Draw QR code
    ctx.fillStyle = 'black';
    for (let row = 0; row < this.moduleCount; row++) {
      for (let col = 0; col < this.moduleCount; col++) {
        if (matrix[row][col]) {
          const x = (col + this.margin) * moduleSize;
          const y = (row + this.margin) * moduleSize;
          ctx.fillRect(x, y, moduleSize, moduleSize);
        }
      }
    }

    return canvas;
  }

  // Create QR code matrix
  private createQRMatrix(text: string): boolean[][] {
    const size = this.moduleCount;
    const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));

    // Add finder patterns (the three corner squares)
    this.addFinderPattern(matrix, 0, 0);
    this.addFinderPattern(matrix, size - 7, 0);
    this.addFinderPattern(matrix, 0, size - 7);

    // Add separators
    this.addSeparators(matrix);

    // Add timing patterns
    this.addTimingPatterns(matrix);

    // Add dark module
    matrix[4 * 4 + 9][8] = true;

    // Encode data
    this.encodeData(matrix, text);

    return matrix;
  }

  // Add finder pattern (7x7 pattern with specific structure)
  private addFinderPattern(matrix: boolean[][], row: number, col: number): void {
    for (let i = -1; i <= 7; i++) {
      for (let j = -1; j <= 7; j++) {
        if (row + i < 0 || row + i >= this.moduleCount ||
            col + j < 0 || col + j >= this.moduleCount) {
          continue;
        }

        if ((i >= 0 && i <= 6 && (j === 0 || j === 6)) ||
            (j >= 0 && j <= 6 && (i === 0 || i === 6)) ||
            (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          matrix[row + i][col + j] = true;
        }
      }
    }
  }

  // Add separators around finder patterns
  private addSeparators(matrix: boolean[][]): void {
    const size = this.moduleCount;

    // Top-left separator
    for (let i = 0; i < 8; i++) {
      matrix[7][i] = false;
      matrix[i][7] = false;
    }

    // Top-right separator
    for (let i = 0; i < 8; i++) {
      matrix[7][size - 8 + i] = false;
      matrix[i][size - 8] = false;
    }

    // Bottom-left separator
    for (let i = 0; i < 8; i++) {
      matrix[size - 8][i] = false;
      matrix[size - 8 + i][7] = false;
    }
  }

  // Add timing patterns
  private addTimingPatterns(matrix: boolean[][]): void {
    for (let i = 8; i < this.moduleCount - 8; i++) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }
  }

  // Simple data encoding
  private encodeData(matrix: boolean[][], text: string): void {
    const data = this.textToBytes(text);
    let bitIndex = 0;

    // Zigzag pattern from bottom-right
    let col = this.moduleCount - 1;
    let direction = -1; // -1 = up, 1 = down

    while (col > 0) {
      if (col === 6) col--; // Skip timing column

      for (let i = 0; i < this.moduleCount; i++) {
        const row = direction === -1 ? this.moduleCount - 1 - i : i;

        for (let c = 0; c < 2; c++) {
          const currentCol = col - c;

          // Skip if position is already used
          if (this.isPositionUsed(row, currentCol)) continue;

          if (bitIndex < data.length * 8) {
            const byteIndex = Math.floor(bitIndex / 8);
            const bitPosition = 7 - (bitIndex % 8);
            const bit = (data[byteIndex] >> bitPosition) & 1;
            matrix[row][currentCol] = bit === 1;
            bitIndex++;
          }
        }
      }

      col -= 2;
      direction *= -1;
    }
  }

  // Check if position is used by patterns
  private isPositionUsed(row: number, col: number): boolean {
    const size = this.moduleCount;

    // Finder patterns
    if ((row < 9 && col < 9) ||
        (row < 9 && col >= size - 8) ||
        (row >= size - 8 && col < 9)) {
      return true;
    }

    // Timing patterns
    if (row === 6 || col === 6) {
      return true;
    }

    return false;
  }

  // Convert text to bytes
  private textToBytes(text: string): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < text.length; i++) {
      bytes.push(text.charCodeAt(i));
    }
    return bytes;
  }
}

// Generate QR code as data URL
export function generateQRCodeDataURL(text: string, size: number = 256): string {
  const generator = new QRCodeGenerator({ size });
  const canvas = generator.generate(text);
  return canvas.toDataURL('image/png');
}

// Generate QR code canvas element
export function generateQRCodeCanvas(text: string, size: number = 256): HTMLCanvasElement {
  const generator = new QRCodeGenerator({ size });
  return generator.generate(text);
}
