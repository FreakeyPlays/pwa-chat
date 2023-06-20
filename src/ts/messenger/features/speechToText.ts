export class SpeechToText {
  private static instance: SpeechToText;
  private speechRecognition: any;

  private outputElement!: HTMLTextAreaElement;
  private currentlyRecording = false;

  private constructor() {
    console.log('[SpeechToText] - instance created');
  }

  public static getInstance(): SpeechToText {
    if (!SpeechToText.instance) {
      SpeechToText.instance = new SpeechToText();
    }

    return this.instance;
  }

  public init(outputElement: HTMLTextAreaElement): void {
    this.speechRecognition = new window.webkitSpeechRecognition();

    this.speechRecognition.lang = 'de-DE'; //navigator.language || 'en-US';
    this.speechRecognition.interimResults = true;
    this.speechRecognition.continuous = true;

    this.outputElement = outputElement;

    this.speechRecognition.addEventListener('result', (e: any) => {
      this.resultHandler(e);
    });
    this.speechRecognition.addEventListener('end', () => {
      this.endHandler();
    });

    console.log('[SpeechToText] - initialized SpeechToText');
  }

  private resultHandler(e: any): void {
    const transcript = Array.from(e.results)
      .map((result: any) => result[0])
      .map((result: any) => result.transcript)
      .join('');

    this.outputElement.innerText = transcript;
    console.log('[SpeechToText] - result handled');
  }

  private endHandler(): void {
    console.log('[SpeechToText] - speech recognition ended');
  }

  public start(): void {
    if (this.currentlyRecording) return;

    this.currentlyRecording = true;
    this.speechRecognition.start();
    console.log('[SpeechToText] - speech recognition started');
  }

  public stop(): void {
    this.speechRecognition.stop();
    console.log('[SpeechToText] - speech recognition stopped');
  }
}
