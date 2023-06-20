export class Camera {
  private static instance: Camera;

  private previewElement!: HTMLVideoElement;
  private stream!: MediaStream;

  private pictureWidth = 640;
  private pictureHeight = 480;

  private constructor() {
    console.log('[Camera] - instance created');
  }

  public static getInstance(): Camera {
    if (!Camera.instance) {
      Camera.instance = new Camera();
    }

    return this.instance;
  }

  public init(preview: HTMLVideoElement): void {
    this.previewElement = preview;
  }

  public start(): void {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: this.pictureWidth,
          height: this.pictureHeight,
          facingMode: 'user'
        },
        audio: false
      })
      .then(stream => {
        this.stream = stream;
        this.previewElement.srcObject = stream;

        console.log('[Camera] - camera started');
      })
      .catch(err => {
        console.log('[Camera] - a error occurred\n' + err);
      });
  }

  public stop(): void {
    if (!this.stream) return;

    this.previewElement.pause();
    this.stream.getTracks().forEach(track => {
      track.stop();
    });

    console.log('[Camera] - camera stopped');
  }

  public takePicture(): string | null {
    if (!this.stream) return null;

    const canvas = <HTMLCanvasElement>document.createElement('canvas');
    canvas.width = this.pictureWidth;
    canvas.height = this.pictureHeight;

    let context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.drawImage(this.previewElement, 0, 0, canvas.width, canvas.height);

    const picture = canvas.toDataURL('image/png');

    return picture;
  }
}
