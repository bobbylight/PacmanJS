// this file is only being used by karma

(window as any).game = {};

const testsContext: any = (require as any).context('.', true, /\.spec\.ts$/);
testsContext.keys().forEach(testsContext);
